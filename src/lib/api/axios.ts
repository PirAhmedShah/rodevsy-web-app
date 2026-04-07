// src/lib/api/axios.ts
import axios, { type InternalAxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';
import type { refereshResponse } from '$lib/types/auth.type.js';

// ── Access token store ───────────────────────────────────────────
let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
	accessToken = token;
};

// ── Axios instance ───────────────────────────────────────────────
export const api = axios.create({
	baseURL: import.meta.env.PROD ? 'https://api.rodevsy.app' : 'http://localhost:80',
	withCredentials: true
});

// ── Request interceptor — attach access token ────────────────────
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (accessToken && config.headers) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

// ── Response interceptor — silent token refresh on 401 ───────────
interface RetryableConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

interface QueueItem {
	resolve: (token: string | null) => void;
	reject: (reason: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const flushQueue = (error: unknown, token: string | null): void => {
	failedQueue.forEach((item) => (error ? item.reject(error) : item.resolve(token)));
	failedQueue = [];
};

const isRefreshRequest = (config?: InternalAxiosRequestConfig): boolean =>
	!!config?.url?.includes('/auth/refresh');

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as RetryableConfig | undefined;
		const status = error.response?.status;

		// Don't intercept non-401s or missing config
		if (status !== 401 || !originalRequest) {
			return Promise.reject(error);
		}

		// ── Refresh endpoint itself failed — session is dead ─────────
		if (isRefreshRequest(originalRequest)) {
			setAccessToken(null);
			flushQueue(error, null);
			return Promise.reject(error);
		}

		// ── Already retried this request — don't loop ────────────────
		if (originalRequest._retry) {
			return Promise.reject(error);
		}

		// ── Another refresh already in flight — queue this request ───
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({
					resolve: (token) => {
						if (originalRequest.headers) {
							originalRequest.headers['Authorization'] = `Bearer ${token}`;
						}
						resolve(api(originalRequest));
					},
					reject
				});
			});
		}

		// ── Kick off a refresh ───────────────────────────────────────
		originalRequest._retry = true;
		isRefreshing = true;

		try {
			const { data } = await api.post<refereshResponse>('/auth/refresh');
			setAccessToken(data);

			if (originalRequest.headers) {
				originalRequest.headers['Authorization'] = `Bearer ${data}`;
			}

			flushQueue(null, data);
			return api(originalRequest);
		} catch (refreshError) {
			setAccessToken(null);
			flushQueue(refreshError, null);
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	}
);
