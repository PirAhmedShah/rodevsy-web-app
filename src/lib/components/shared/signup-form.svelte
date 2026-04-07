<script lang="ts">
	import { FieldGroup, Field, FieldLabel, FieldSeparator } from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import Github from '@lucide/svelte/icons/github';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { signup } from '$lib/services/auth.service.js';
	import type { AxiosError } from 'axios';
	import { UserGender, UserType, type SignupPayload } from '$lib/types/auth.type.js';

	let {
		ref = $bindable(null),
		class: className = '',
		...restProps
	}: WithElementRef<HTMLFormAttributes> = $props();

	const id = $props.id();

	// ── Date constraints ─────────────────────────────────────────
	const today = new Date();
	const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())
		.toISOString()
		.split('T')[0];
	const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
		.toISOString()
		.split('T')[0];

	const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,64}$';

	// ── Field errors (keyed by field name, matches NestJS field names) ──
	type FieldErrors = Partial<Record<keyof SignupPayload | 'general', string>>;
	let errors = $state<FieldErrors>({});

	const clearError = (field: keyof FieldErrors) => {
		if (errors[field]) errors = { ...errors, [field]: undefined };
	};

	// ── Select state ─────────────────────────────────────────────
	let userType = $state<UserType | ''>('');
	let gender = $state<UserGender | ''>('');

	const userTypeLabel = $derived(
		userType === UserType.DEVELOPER
			? 'Developer / Creator'
			: userType === UserType.CLIENT
				? 'Client / Studio'
				: 'Select your role'
	);
	const genderLabel = $derived(
		gender === UserGender.MALE
			? 'Male'
			: gender === UserGender.FEMALE
				? 'Female'
				: gender === UserGender.OTHERS
					? 'Other'
					: 'Select your gender'
	);

	let isSubmitting = $state(false);

	// ── Error parser ─────────────────────────────────────────────
	// NestJS class-validator returns either:
	//   { message: string[] }   — validation errors array
	//   { message: string }     — single message
	function parseBackendErrors(err: unknown): FieldErrors {
		const response = (err as AxiosError<{ message: string | string[] }>).response;

		if (!response) return { general: 'Network error. Please check your connection.' };

		const { status, data } = response;

		if (status === 409) return { general: 'Username or email is already taken.' };
		if (status === 429) return { general: 'Too many attempts. Please wait a moment.' };
		if (status >= 500) return { general: 'Server error. Please try again later.' };

		const messages = Array.isArray(data?.message)
			? data.message
			: [data?.message ?? 'Registration failed.'];

		const fieldErrors: FieldErrors = {};

		for (const msg of messages) {
			if (!msg) continue;
			const lower = msg.toLowerCase();

			// Map NestJS validation messages to field keys
			if (lower.includes('firstname') || lower.includes('first name')) fieldErrors.firstName = msg;
			else if (lower.includes('lastname') || lower.includes('last name'))
				fieldErrors.lastName = msg;
			else if (lower.includes('username')) fieldErrors.username = msg;
			else if (lower.includes('email')) fieldErrors.email = msg;
			else if (lower.includes('password')) fieldErrors.password = msg;
			else if (lower.includes('dob') || lower.includes('birth')) fieldErrors.dob = msg;
			else if (lower.includes('type') || lower.includes('role')) fieldErrors.type = msg;
			else if (lower.includes('gender')) fieldErrors.gender = msg;
			else fieldErrors.general = msg;
		}

		return fieldErrors;
	}

	// ── Submit ───────────────────────────────────────────────────
	async function handleSubmit(event: Event) {
		event.preventDefault();
		errors = {};

		if (!userType) {
			errors = { ...errors, type: 'Please select an account type.' };
			return;
		}
		if (!gender) {
			errors = { ...errors, gender: 'Please select your gender.' };
			return;
		}

		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		if (!formData.has('type')) formData.append('type', userType);
		if (!formData.has('gender')) formData.append('gender', gender);

		const rawPayload = Object.fromEntries(formData.entries());
		const payload = rawPayload as unknown as SignupPayload;

		isSubmitting = true;

		try {
			await signup(payload);
			toast.success('Account created! Check your email to verify.');
			form.reset();
			userType = '';
			gender = '';
		} catch (err) {
			errors = parseBackendErrors(err);
			// Also toast the general error if present so it's hard to miss
			if (errors.general) toast.error(errors.general);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form class={cn(className)} bind:this={ref} {...restProps} onsubmit={handleSubmit} novalidate>
	<FieldGroup>
		<!-- Header -->
		<div class="flex flex-col items-center gap-1 text-center">
			<h1 class="text-2xl font-bold tracking-tight">Create your account</h1>
			<p class="text-sm text-balance text-muted-foreground">
				Join the elite Roblox development ecosystem
			</p>
		</div>

		<!-- General error banner -->
		{#if errors.general}
			<div
				class="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
			>
				{errors.general}
			</div>
		{/if}

		<!-- Name -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Field>
				<FieldLabel for="firstName-{id}">First Name</FieldLabel>
				<Input
					id="firstName-{id}"
					name="firstName"
					placeholder="John"
					minlength={2}
					maxlength={32}
					aria-invalid={!!errors.firstName}
					oninput={() => clearError('firstName')}
					required
				/>
				{#if errors.firstName}
					<p class="text-xs text-destructive">{errors.firstName}</p>
				{/if}
			</Field>

			<Field>
				<FieldLabel for="lastName-{id}">Last Name</FieldLabel>
				<Input
					id="lastName-{id}"
					name="lastName"
					placeholder="Doe"
					minlength={2}
					maxlength={32}
					aria-invalid={!!errors.lastName}
					oninput={() => clearError('lastName')}
					required
				/>
				{#if errors.lastName}
					<p class="text-xs text-destructive">{errors.lastName}</p>
				{/if}
			</Field>
		</div>

		<!-- Username + Email -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Field>
				<FieldLabel for="username-{id}">Username</FieldLabel>
				<Input
					id="username-{id}"
					name="username"
					placeholder="rodev_pro"
					minlength={4}
					maxlength={30}
					aria-invalid={!!errors.username}
					oninput={() => clearError('username')}
					required
				/>
				{#if errors.username}
					<p class="text-xs text-destructive">{errors.username}</p>
				{/if}
			</Field>

			<Field>
				<FieldLabel for="email-{id}">Email</FieldLabel>
				<Input
					id="email-{id}"
					name="email"
					type="email"
					placeholder="dev@rodevsy.com"
					minlength={5}
					maxlength={100}
					aria-invalid={!!errors.email}
					oninput={() => clearError('email')}
					required
				/>
				{#if errors.email}
					<p class="text-xs text-destructive">{errors.email}</p>
				{/if}
			</Field>
		</div>

		<!-- Password + DOB -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Field>
				<FieldLabel for="password-{id}">Password</FieldLabel>
				<Input
					id="password-{id}"
					name="password"
					type="password"
					placeholder="••••••••"
					minlength={8}
					maxlength={64}
					pattern={passwordPattern}
					title="Min 8 chars with uppercase, lowercase, number and symbol."
					aria-invalid={!!errors.password}
					oninput={() => clearError('password')}
					required
				/>
				{#if errors.password}
					<p class="text-xs text-destructive">{errors.password}</p>
				{/if}
			</Field>

			<Field>
				<FieldLabel for="dob-{id}">Date of Birth</FieldLabel>
				<Input
					id="dob-{id}"
					name="dob"
					type="date"
					max={maxDate}
					min={minDate}
					aria-invalid={!!errors.dob}
					onchange={() => clearError('dob')}
					required
				/>
				{#if errors.dob}
					<p class="text-xs text-destructive">{errors.dob}</p>
				{/if}
			</Field>
		</div>

		<!-- Account Type + Gender -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Field>
				<FieldLabel for="userType-{id}">Account Type</FieldLabel>
				<Select.Root type="single" bind:value={userType} onValueChange={() => clearError('type')}>
					<Select.Trigger
						id="userType-{id}"
						class={cn(
							'bg-muted/40 transition-colors focus:bg-background',
							errors.type && 'border-destructive focus-visible:ring-destructive/20'
						)}
					>
						{userTypeLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.GroupHeading>Roles</Select.GroupHeading>
							<Select.Item value={UserType.DEVELOPER}>Developer / Creator</Select.Item>
							<Select.Item value={UserType.CLIENT}>Client / Studio</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
				{#if errors.type}
					<p class="text-xs text-destructive">{errors.type}</p>
				{/if}
			</Field>

			<Field>
				<FieldLabel for="gender-{id}">Gender</FieldLabel>
				<Select.Root type="single" bind:value={gender} onValueChange={() => clearError('gender')}>
					<Select.Trigger
						id="gender-{id}"
						class={cn(
							'bg-muted/40 transition-colors focus:bg-background',
							errors.gender && 'border-destructive focus-visible:ring-destructive/20'
						)}
					>
						{genderLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.GroupHeading>Gender</Select.GroupHeading>
							<Select.Item value={UserGender.MALE}>Male</Select.Item>
							<Select.Item value={UserGender.FEMALE}>Female</Select.Item>
							<Select.Item value={UserGender.OTHERS}>Other</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
				{#if errors.gender}
					<p class="text-xs text-destructive">{errors.gender}</p>
				{/if}
			</Field>
		</div>

		<!-- Submit -->
		<Field>
			<Button
				type="submit"
				class="mt-2 w-full font-bold active:scale-95 disabled:opacity-70 disabled:active:scale-100"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Creating account...' : 'Create Account'}
			</Button>
		</Field>

		<FieldSeparator>Or sign up with</FieldSeparator>

		<Field class="space-y-4">
			<Button
				variant="outline"
				type="button"
				class="w-full gap-2 hover:bg-muted/50"
				disabled={isSubmitting}
			>
				<Github class="size-4" />
				Continue with GitHub
			</Button>

			<p class="text-center text-xs text-muted-foreground">
				Already a member?
				<a
					href={resolve('/login/')}
					class="font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
				>
					Log in
				</a>
			</p>
		</Field>
	</FieldGroup>
</form>
