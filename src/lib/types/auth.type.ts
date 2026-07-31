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

export const SkillSubCategory = {
	GAMEPLAY_SCRIPTER: 'Gameplay Scripter',
	SYSTEMS_BACKEND: 'Systems/Backend',
	UI_PROGRAMMER: 'UI Programmer',
	ANTI_EXPLOIT: 'Anti-Exploit',
	BOT_WEB_DEVELOPER: 'Bot/Web Developer',
	ARCHITECTURAL_BUILDER: 'Architectural Builder',
	TERRAIN_ARTIST: 'Terrain Artist',
	LEVEL_DESIGNER: 'Level Designer',
	THREE_D_MODELER: '3D Modeler',
	UI_UX_DESIGNER: 'UI/UX Designer',
	VFX_ARTIST: 'VFX Artist',
	GFX_ARTIST: 'GFX Artist',
	ANIMATOR: 'Animator',
	CLOTHING_DESIGNER: 'Clothing Designer',
	SOUND_DESIGNER: 'Sound Designer',
	COMPOSER: 'Composer',
	GAME_PRODUCER: 'Game Producer',
	QA_TESTER: 'QA Tester',
	COMMUNITY_MANAGER: 'Community Manager'
} as const;

export type SkillSubCategory = (typeof SkillSubCategory)[keyof typeof SkillSubCategory];

export const SkillTier = {
	TIER_V: '1.Tier V',
	TIER_IV: '2.Tier IV',
	TIER_III: '3.Tier III',
	TIER_II: '4.Tier II',
	TIER_I: '5.Tier I',
	CHAMPION: '6.Champion'
} as const;

export type SkillTier = (typeof SkillTier)[keyof typeof SkillTier];

export interface LoginPayload {
	username: string;
	password: string;
}

export interface SignupPayload {
	displayName: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
	dateOfBirth: string;
	type: UserType;
	gender: UserGender;
}

export type RefreshResponse = string;

export interface Skill {
	subCategory: SkillSubCategory;
	tier: SkillTier;
}

export interface DeveloperMetadata {
	bio?: string;
	headline?: string;
	portfolioUrl?: string;
}

export interface BaseProfile {
	id: string;
	username: string;
	email: string;
	displayName: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	gender: UserGender;
	createdAt: string;
	updatedAt: string;
	balance: number;
	type: UserType;
	skills: Skill[];
}

export interface DeveloperProfile extends BaseProfile {
	type: typeof UserType.DEVELOPER;
	developer: {
		averageRating: number;
		reviewCount: number;
		isForHire: boolean;
		metadata: DeveloperMetadata;
	};
}

export interface ClientProfile extends BaseProfile {
	type: typeof UserType.CLIENT;
	client: {
		trustScore: number;
		reviewCount: number;
		isVerifiedOrg: boolean;
	};
}

export type UserProfile = DeveloperProfile | ClientProfile;

export interface UpdateProfilePayload {
	displayName?: string;
	isForHire?: boolean;
	metadata?: DeveloperMetadata;
}

export interface UpdateSkillsPayload {
	skills: Skill[];
}
