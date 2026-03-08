// src/lib/api/axios.ts
import axios, { 
  type InternalAxiosRequestConfig, 
  type AxiosError, 
  type AxiosResponse 
} from 'axios';
import { type refereshResponse } from '$lib/types/auth.type.js';
import { setAuth } from '$lib/state/auth.svelte.js';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
    console.log("Setting access token");
    console.log(token)
  accessToken = token;
};

export const api = axios.create({
  baseURL: 'http://localhost:80',
  withCredentials: true 
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // config.headers can be undefined in older Axios versions, but it's safe to check
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
let isRefreshing = false;

// Define the shape of our queue items
interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}

let failedQueue: QueueItem[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Extend Axios config to recognize our custom retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          if (originalRequest.headers) {
             originalRequest.headers['Authorization'] = 'Bearer ' + token;
          }
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {

        const {data} = await api.post<refereshResponse>('/auth/refresh');
        const newToken = data;
        setAccessToken(newToken);
        setAuth(true);

        processQueue(null, newToken);
        
        if (originalRequest.headers) {
           originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        }
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        setAccessToken(null);
        setAuth(false);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);