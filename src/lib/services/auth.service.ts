// src/lib/services/auth.service.ts
import { api, setAccessToken } from '../api/axios';
import { setAuth } from '../state/auth.svelte';
import type { LoginPayload, refereshResponse, SignupPayload } from '$lib/types/auth.type';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

export async function login(payload: LoginPayload): Promise<void> {
	await api.post('/auth/login', payload);
	window.location.href = resolve('/dashboard/');
}

export async function signup(payload: SignupPayload): Promise<void> {
	await api.post('/auth/signup', payload);
	goto(resolve('/login/'));
}

export async function logout(): Promise<void> {
	await api.post('/auth/logout', {});
	setAccessToken(null);
	setAuth(false);
	goto(resolve('/login/'));
}

export async function initializeApp() {
	try {
		await new Promise((res) => setTimeout(res, Math.random() * 1500 + 500));
		const { data } = await api.post<refereshResponse>('/auth/refresh');
		setAccessToken(data);
		setAuth(true);
	} catch {
		console.debug('No active session found during initialization.');
		setAuth(false); // explicitly set false, not null, so isLoading stops
	}
}
