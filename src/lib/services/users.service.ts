// src/lib/services/users.service.ts
import { api } from '../api/axios';
import type {
	Skill,
	UpdateProfilePayload,
	UpdateSkillsPayload,
	UserProfile
} from '$lib/types/auth.type';

export async function getProfile(): Promise<UserProfile> {
	const { data } = await api.get<UserProfile>('/users/me');
	return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
	const { data } = await api.patch<UserProfile>('/users/me', payload);
	return data;
}

export async function getSkills(): Promise<Skill[]> {
	const { data } = await api.get<Skill[]>('/users/me/skills');
	return data;
}

export async function updateSkills(payload: UpdateSkillsPayload): Promise<Skill[]> {
	const { data } = await api.put<Skill[]>('/users/me/skills', payload);
	return data;
}
