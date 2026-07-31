<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { toast } from 'svelte-sonner';
	import { userState, updateUser } from '$lib/state/user.svelte';
	import { updateProfile, updateSkills } from '$lib/services/users.service';
	import {
		SkillSubCategory,
		SkillTier,
		UserType,
		type Skill,
		type UpdateProfilePayload
	} from '$lib/types/auth.type';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';

	const profile = $derived(userState.profile);

	// ── Profile form state ─────────────────────────────────────────
	let displayName = $state('');
	let isForHire = $state(false);
	let headline = $state('');
	let bio = $state('');
	let portfolioUrl = $state('');
	let savingProfile = $state(false);

	// ── Skills state ───────────────────────────────────────────────
	let skills = $state<Skill[]>([]);
	let savingSkills = $state(false);

	// ── Seeding (runs once profile is available) ───────────────────
	let seeded = $state(false);
	$effect(() => {
		const current = profile;
		if (!current || seeded) return;
		seeded = true;

		displayName = current.displayName;
		skills = current.skills.map((skill) => ({ ...skill }));

		if (current.type === UserType.DEVELOPER) {
			isForHire = current.developer.isForHire;
			headline = current.developer.metadata.headline ?? '';
			bio = current.developer.metadata.bio ?? '';
			portfolioUrl = current.developer.metadata.portfolioUrl ?? '';
		}
	});

	const subCategories = $derived(
		Object.values(SkillSubCategory).filter(
			(category) => !skills.some((s) => s.subCategory === category)
		)
	);
	const isDeveloper = $derived(profile?.type === UserType.DEVELOPER);

	// ── Handlers ───────────────────────────────────────────────────
	async function handleSaveProfile() {
		if (!profile) return;
		savingProfile = true;
		try {
			const payload: UpdateProfilePayload = { displayName };
			if (profile.type === UserType.DEVELOPER) {
				payload.isForHire = isForHire;
				payload.metadata = { headline, bio, portfolioUrl };
			}
			const updated = await updateProfile(payload);
			updateUser(updated);
			toast.success('Profile updated.');
		} catch {
			toast.error('Failed to update profile. Please try again.');
		} finally {
			savingProfile = false;
		}
	}

	async function handleSaveSkills() {
		if (!profile) return;
		savingSkills = true;
		try {
			const updated = await updateSkills({ skills });
			updateUser({ ...profile, skills: updated });
			toast.success('Skills updated.');
		} catch {
			toast.error('Failed to update skills. Please try again.');
		} finally {
			savingSkills = false;
		}
	}

	function addSkill() {
		const category = subCategories[0];
		if (!category) return;
		skills = [...skills, { subCategory: category, tier: SkillTier.TIER_V }];
	}

	function removeSkill(subCategory: string) {
		skills = skills.filter((skill) => skill.subCategory !== subCategory);
	}
</script>

<div class="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-6 text-3xl font-bold tracking-tight text-foreground">Settings</h1>

	{#if !profile}
		<div class="space-y-6">
			<Skeleton class="h-64" />
			<Skeleton class="h-64" />
		</div>
	{:else}
		<div class="space-y-6">
			<!-- Profile settings -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Profile</Card.Title>
					<Card.Description>Update your public profile information.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-5">
					<Field.Field>
						<Field.FieldLabel for="settings-display-name">Display Name</Field.FieldLabel>
						<Input
							id="settings-display-name"
							bind:value={displayName}
							minlength={2}
							maxlength={32}
							placeholder="How others see you"
						/>
					</Field.Field>

					{#if isDeveloper}
						<div class="flex items-center justify-between rounded-lg border border-border p-4">
							<div>
								<p class="text-sm font-medium text-foreground">Open to contracts</p>
								<p class="text-xs text-muted-foreground">
									Show clients that you're available for new work.
								</p>
							</div>
							<Switch bind:checked={isForHire} aria-label="Open to contracts" />
						</div>

						<Field.Field>
							<Field.FieldLabel for="settings-headline">Headline</Field.FieldLabel>
							<Input
								id="settings-headline"
								bind:value={headline}
								maxlength={120}
								placeholder="e.g. Lead Scripter with 5 years of experience"
							/>
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel for="settings-bio">Bio</Field.FieldLabel>
							<Textarea
								id="settings-bio"
								bind:value={bio}
								maxlength={500}
								rows={4}
								placeholder="Tell clients about yourself..."
							/>
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel for="settings-portfolio">Portfolio URL</Field.FieldLabel>
							<Input
								id="settings-portfolio"
								bind:value={portfolioUrl}
								type="url"
								placeholder="https://your-portfolio.example"
							/>
						</Field.Field>
					{/if}

					<div class="flex justify-end">
						<Button onclick={handleSaveProfile} disabled={savingProfile}>
							{#if savingProfile}
								<LoaderCircleIcon class="size-4 animate-spin" />
							{/if}
							Save profile
						</Button>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Skills settings -->
			{#if isDeveloper}
				<Card.Root>
					<Card.Header>
						<Card.Title>Skills & Tiers</Card.Title>
						<Card.Description>
							Add the sub-categories you specialize in and their verified tier.
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						{#if skills.length > 0}
							<div class="space-y-3">
								{#each skills as skill, index (skill.subCategory)}
									<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
										<Select.Root type="single" bind:value={skill.subCategory}>
											<Select.Trigger class="w-full sm:flex-1">
												{skill.subCategory}
											</Select.Trigger>
											<Select.Content>
												{#each subCategories.filter((category) => category === skill.subCategory || !skills.some((s) => s.subCategory === category)) as category (category)}
													<Select.Item value={category}>{category}</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>

										<Select.Root type="single" bind:value={skill.tier}>
											<Select.Trigger class="w-full sm:w-40">{skill.tier}</Select.Trigger>
											<Select.Content>
												{#each Object.values(SkillTier) as tier (tier)}
													<Select.Item value={tier}>{tier}</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>

										<Button
											variant="ghost"
											size="icon"
											aria-label={`Remove ${skill.subCategory}`}
											onclick={() => removeSkill(skill.subCategory)}
										>
											<Trash2Icon class="size-4" />
										</Button>
									</div>
									{#if index < skills.length - 1}
										<hr class="border-border" />
									{/if}
								{/each}
							</div>
						{:else}
							<p class="text-sm text-muted-foreground">No skills added yet.</p>
						{/if}

						<div class="flex items-center justify-between">
							<Button variant="outline" onclick={addSkill} disabled={subCategories.length === 0}>
								<PlusIcon class="size-4" />
								Add skill
							</Button>
							<Button onclick={handleSaveSkills} disabled={savingSkills}>
								{#if savingSkills}
									<LoaderCircleIcon class="size-4 animate-spin" />
								{/if}
								Save skills
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	{/if}
</div>
