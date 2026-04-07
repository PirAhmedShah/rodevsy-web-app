<script lang="ts">
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription,
		FieldSeparator
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { resolve } from '$app/paths';
	import type { LoginPayload } from '$lib/types/auth.type.js';
	import { toast } from 'svelte-sonner';
	import { AxiosError } from 'axios';
	import { login } from '$lib/services/auth.service.js';

	let { ref = $bindable(null), class: className = '', ...restProps } = $props();

	const id = $props.id();

	// ── Field errors ─────────────────────────────────────────────
	type FieldErrors = Partial<Record<keyof LoginPayload | 'general', string>>;
	let errors = $state<FieldErrors>({});

	const clearError = (field: keyof FieldErrors) => {
		if (errors[field]) errors = { ...errors, [field]: undefined };
	};

	let isSubmitting = $state(false);

	// ── Error parser ─────────────────────────────────────────────
	function parseBackendErrors(err: unknown): FieldErrors {
		const response = (err as AxiosError<{ message: string | string[] }>).response;

		if (!response) return { general: 'Network error. Please check your connection.' };

		const { status, data } = response;

		if (status === 401) return { general: 'Invalid username or password.' };
		if (status === 403) return { general: 'Your account has been suspended.' };
		if (status === 429) return { general: 'Too many attempts. Please wait a moment.' };
		if (status >= 500) return { general: 'Server error. Please try again later.' };

		const messages = Array.isArray(data?.message)
			? data.message
			: [data?.message ?? 'Login failed.'];

		const fieldErrors: FieldErrors = {};

		for (const msg of messages) {
			if (!msg) continue;
			const lower = msg.toLowerCase();
			if (lower.includes('username')) fieldErrors.username = msg;
			else if (lower.includes('password')) fieldErrors.password = msg;
			else fieldErrors.general = msg;
		}

		return fieldErrors;
	}

	// ── Submit ───────────────────────────────────────────────────
	async function handleSubmit(event: Event) {
		event.preventDefault();
		errors = {};

		const form = event.currentTarget as HTMLFormElement;
		const payload = Object.fromEntries(new FormData(form).entries()) as unknown as LoginPayload;

		isSubmitting = true;

		try {
			await login(payload);
			toast.success('Welcome back! Redirecting...');
			form.reset();
		} catch (err) {
			errors = parseBackendErrors(err);
			if (errors.general) toast.error(errors.general);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form class={className} bind:this={ref} {...restProps} onsubmit={handleSubmit} novalidate>
	<FieldGroup>
		<!-- Header -->
		<div class="flex flex-col items-center gap-1 text-center">
			<h1 class="text-2xl font-bold tracking-tight">Welcome back</h1>
			<p class="text-sm text-balance text-muted-foreground">
				Enter your RoDevsy credentials to access your dashboard
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

		<!-- Username -->
		<Field>
			<FieldLabel for="username-{id}">Username</FieldLabel>
			<Input
				id="username-{id}"
				name="username"
				type="text"
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

		<!-- Password -->
		<Field>
			<div class="flex items-center">
				<FieldLabel for="password-{id}">Password</FieldLabel>
				<Button variant="link" class="ms-auto h-auto p-0 text-xs" type="button" tabindex={-1}>
					Forgot password?
				</Button>
			</div>
			<Input
				id="password-{id}"
				name="password"
				type="password"
				placeholder="••••••••"
				minlength={8}
				maxlength={64}
				aria-invalid={!!errors.password}
				oninput={() => clearError('password')}
				required
			/>
			{#if errors.password}
				<p class="text-xs text-destructive">{errors.password}</p>
			{/if}
		</Field>

		<!-- Submit -->
		<Field>
			<Button
				type="submit"
				class="w-full font-bold active:scale-95 disabled:opacity-70 disabled:active:scale-100"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Signing in...' : 'Sign In'}
			</Button>
		</Field>

		<FieldSeparator>Or continue with</FieldSeparator>

		<Field class="space-y-4">
			<Button
				variant="outline"
				type="button"
				class="w-full gap-2 hover:bg-muted/50"
				disabled={isSubmitting}
			>
				Login with Roblox
			</Button>

			<FieldDescription class="text-center text-xs">
				New to the community?
				<a
					href={resolve('/signup/')}
					class="font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
				>
					Create an account
				</a>
			</FieldDescription>
		</Field>
	</FieldGroup>
</form>
