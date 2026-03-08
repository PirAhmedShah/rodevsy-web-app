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
	import { goto } from '$app/navigation';

	let { ref = $bindable(null), class: className, ...restProps } = $props();

	const id = $props.id();

	const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,64}$';

	let isSubmitting = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();

		isSubmitting = false;

		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		const payload = Object.fromEntries(formData.entries()) as unknown as LoginPayload;

		try {
			await login(payload);

			toast('Logged in successfully! Redirecting...');
			form.reset();

			goto(resolve('/dashboard'));
		} catch (err) {
			const backendData = (err as AxiosError<{ message: string }>).response?.data?.message;
			if (Array.isArray(backendData)) backendData.forEach((message) => toast(message));
			else toast(backendData || 'Login failed. Please check your credentials.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form class={className} bind:this={ref} {...restProps} onsubmit={handleSubmit}>
	<FieldGroup>
		<div class="flex flex-col items-center gap-1 text-center">
			<h1 class="text-2xl font-bold tracking-tight">Welcome back</h1>
			<p class="text-sm text-balance text-muted-foreground">
				Enter your RoDevsy credentials to access your dashboard
			</p>
		</div>

		<Field>
			<FieldLabel for="username-{id}">Username</FieldLabel>
			<Input
				id="username-{id}"
				name="username"
				type="text"
				placeholder="rodev_pro"
				minlength={4}
				maxlength={30}
				pattern="^[a-zA-Z0-9]+$"
				title="Only letters and numbers are allowed"
				required
			/>
		</Field>

		<Field>
			<div class="flex items-center">
				<FieldLabel for="password-{id}">Password</FieldLabel>
				<Button variant="link" class="ms-auto" type="button" tabindex={-1}>Forgot password?</Button>
			</div>
			<Input
				id="password-{id}"
				name="password"
				type="password"
				placeholder="••••••••"
				minlength={8}
				maxlength={64}
				pattern={passwordPattern}
				title="Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol."
				required
			/>
		</Field>

		<Field>
			<Button
				type="submit"
				class="w-full font-bold transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Signing In...' : 'Sign In'}
			</Button>
		</Field>

		<FieldSeparator>Or continue with</FieldSeparator>

		<Field class="space-y-4">
			<Button
				variant="outline"
				type="button"
				class="w-full gap-2 transition-colors hover:bg-muted/50"
				disabled={isSubmitting}
			>
				Login with Roblox
			</Button>

			<FieldDescription class="text-center text-xs">
				New to the community?
				<a
					href={resolve('/signup')}
					class="font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
				>
					Create an account
				</a>
			</FieldDescription>
		</Field>
	</FieldGroup>
</form>
