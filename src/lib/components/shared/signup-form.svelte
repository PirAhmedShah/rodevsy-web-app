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
	import { goto } from '$app/navigation';
	import { signup } from '$lib/services/auth.service.js';
	import type { AxiosError } from 'axios';
	import { UserGender, UserType, type SignupPayload } from '$lib/types/auth.type.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLFormAttributes> = $props();

	const id = $props.id();

	const today = new Date();
	const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())
		.toISOString()
		.split('T')[0];
	const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
		.toISOString()
		.split('T')[0];

	const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,64}$';

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	let userType = $state<UserType | ''>('');
	const userTypeLabel = $derived(
		userType === UserType.DEVELOPER
			? 'Developer / Creator'
			: userType === UserType.CLIENT
				? 'Client / Studio'
				: 'Select your role'
	);

	let gender = $state<UserGender | ''>('');
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

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const emailValue = formData.get('email')?.toString() || '';

		if (!emailRegex.test(emailValue)) {
			toast('Please enter a valid email address with a domain (e.g. dev@rodevsy.com).');
			return;
		}

		if (!userType) {
			toast('Please select an Account Type.');
			return;
		}
		if (!gender) {
			toast('Please select your Gender.');
			return;
		}

		isSubmitting = true;

		if (!formData.has('type')) formData.append('type', userType);
		if (!formData.has('gender')) formData.append('gender', gender);

		const rawPayload = Object.fromEntries(formData.entries());
		delete rawPayload.userType;
		const payload = rawPayload as unknown as SignupPayload;

		try {
			await signup(payload);
			toast('Account created successfully!');
			form.reset();
			userType = '';
			gender = '';
			goto(resolve('/login'));
		} catch (err) {
			const backendData = (err as AxiosError<{ message: string }>).response?.data?.message;
			if (Array.isArray(backendData)) backendData.forEach((message) => toast(message));
			else toast(backendData || 'Registration failed, please check your credentials.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form class={cn(className)} bind:this={ref} {...restProps} onsubmit={handleSubmit}>
	<FieldGroup>
		<div class="flex flex-col items-center gap-1 text-center">
			<h1 class="text-2xl font-bold tracking-tight">Create your account</h1>
			<p class="text-sm text-balance text-muted-foreground">
				Join the elite Roblox development ecosystem
			</p>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Field>
				<FieldLabel for="firstName-{id}">First Name</FieldLabel>
				<Input
					id="firstName-{id}"
					name="firstName"
					placeholder="John"
					minlength={2}
					maxlength={32}
					pattern="^[a-zA-Z]+$"
					title="Only alphabetical characters are allowed"
					required
				/>
			</Field>

			<Field>
				<FieldLabel for="lastName-{id}">Last Name</FieldLabel>
				<Input
					id="lastName-{id}"
					name="lastName"
					placeholder="Doe"
					minlength={2}
					maxlength={32}
					pattern="^[a-zA-Z]+$"
					title="Only alphabetical characters are allowed"
					required
				/>
			</Field>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Field>
				<FieldLabel for="username-{id}">Username</FieldLabel>
				<Input
					id="username-{id}"
					name="username"
					placeholder="rodev_pro"
					minlength={4}
					maxlength={30}
					pattern="^[a-zA-Z0-9]+$"
					title="Only letters and numbers are allowed"
					required
				/>
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
					required
				/>
			</Field>
		</div>

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
					title="Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol."
					required
				/>
			</Field>

			<Field>
				<FieldLabel for="dob-{id}">Date of Birth</FieldLabel>
				<Input id="dob-{id}" name="dob" type="date" max={maxDate} min={minDate} required />
			</Field>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Field>
				<FieldLabel for="userType-{id}">Account Type</FieldLabel>
				<Select.Root type="single" bind:value={userType} required>
					<Select.Trigger
						id="userType-{id}"
						class="bg-muted/40 transition-colors focus:bg-background"
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
			</Field>

			<Field>
				<FieldLabel for="gender-{id}">Gender</FieldLabel>
				<Select.Root type="single" bind:value={gender} required>
					<Select.Trigger
						id="gender-{id}"
						class="bg-muted/40 transition-colors focus:bg-background"
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
			</Field>
		</div>

		<Field>
			<Button
				type="submit"
				class="mt-2 w-full font-bold transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Registering...' : 'Register'}
			</Button>
		</Field>

		<FieldSeparator>Or sign up with</FieldSeparator>

		<Field class="space-y-4">
			<Button
				variant="outline"
				type="button"
				class="w-full gap-2 transition-colors hover:bg-muted/50"
				disabled={isSubmitting}
			>
				<Github class="size-4" />
				GitHub
			</Button>

			<p class="text-center text-xs text-muted-foreground">
				Already a member?
				<a
					href={resolve('/login')}
					class="font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
				>
					Log in
				</a>
			</p>
		</Field>
	</FieldGroup>
</form>
