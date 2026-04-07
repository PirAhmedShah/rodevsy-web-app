// src/lib/state/auth.svelte.ts
interface AuthState {
	isAuthenticated: boolean | null; // null = not yet checked
}

export const authState: AuthState = $state({
	isAuthenticated: null
});

export function setAuth(isAuthenticated: boolean) {
	console.log(`Auth Updated to ${isAuthenticated}`);
	authState.isAuthenticated = isAuthenticated;
}
