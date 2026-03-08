// src/lib/services/authService.ts
import { api, setAccessToken } from '../api/axios.js';
import { setAuth } from '../state/auth.svelte.js';
import { type LoginPayload, type loginResponse, type refereshResponse, type SignupPayload, type signupResponse } from '$lib/types/auth.type.js';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';


export async function login(payload: LoginPayload): Promise<void> {
    const { data } = await api.post<loginResponse>('/auth/login', payload);

    setAccessToken(data.accessToken);
    setAuth(true);
}

export async function signup(payload: SignupPayload): Promise<void> {
    await api.post<signupResponse>('/auth/signup', payload);
    goto(resolve('/login'))
}

export async function logout(): Promise<void> {
    await api.post<signupResponse>('/auth/logout', {});
    setAccessToken(null);
    setAuth(false);
    goto(resolve('/login'))
}




export async function initializeApp(): Promise<void> {
    try {
      const {data} = await api.post<refereshResponse>('/auth/refresh');
        const newToken = data;
        setAccessToken(newToken);
        setAuth(true);
        
    } catch {
        // Error handling (e.g., no active session found)
        console.debug('No active session found during initialization.');
    } finally {
        // authState.isInitialized = true;
    }
}
