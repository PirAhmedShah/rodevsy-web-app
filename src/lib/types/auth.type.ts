export const UserType = {
	DEVELOPER: 'Developer',
	CLIENT: 'Client'
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];

export const UserGender = {
	MALE: 'male',
	FEMALE: 'female',
	OTHERS: 'others'
} as const;

export type UserGender = (typeof UserGender)[keyof typeof UserGender];

export interface LoginPayload {
	username: string;
	password: string;
}

export interface SignupPayload {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
	dob: string;
	type: UserType;
	gender: UserGender;
}

export type refereshResponse = string;

export interface User {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	gender: UserGender;
}
