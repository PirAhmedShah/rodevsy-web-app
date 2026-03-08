// src/lib/state/auth.svelte.js

interface AuthState {
  isAuthenticated: boolean
}

export const authState:AuthState = $state({
  isAuthenticated: false
});

export function setAuth(isAuthenticated:boolean) {
    authState.isAuthenticated = isAuthenticated;
}
