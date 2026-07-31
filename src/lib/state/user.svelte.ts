// src/lib/state/user.svelte.ts
import type { UserProfile } from '$lib/types/auth.type';

interface UserState {
	profile: UserProfile | null;
}

export const userState: UserState = $state({
	profile: null
});

export function setUser(profile: UserProfile): void {
	userState.profile = profile;
}

export function updateUser(profile: UserProfile): void {
	userState.profile = profile;
}

export function clearUser(): void {
	userState.profile = null;
}
