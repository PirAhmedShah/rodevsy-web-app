<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { userState } from '$lib/state/user.svelte';
	import { UserType } from '$lib/types/auth.type';
	import { resolve } from '$app/paths';
	import MailIcon from '@lucide/svelte/icons/mail';
	import AtSignIcon from '@lucide/svelte/icons/at-sign';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import StarIcon from '@lucide/svelte/icons/star';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
	import WrenchIcon from '@lucide/svelte/icons/wrench';

	const profile = $derived(userState.profile);

	const memberSince = $derived(
		profile
			? new Date(profile.createdAt).toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'long'
				})
			: ''
	);
	const displayName = $derived(profile?.displayName ?? '');
</script>

<div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	{#if !profile}
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<Skeleton class="h-64" />
			<Skeleton class="h-64 lg:col-span-2" />
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Identity card -->
			<Card.Root>
				<Card.Content class="flex flex-col items-center pt-6 text-center">
					<div
						class="flex size-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary"
					>
						{displayName.slice(0, 1).toUpperCase()}
					</div>
					<h1 class="mt-4 text-2xl font-bold tracking-tight text-foreground">{displayName}</h1>
					<p class="text-sm text-muted-foreground">@{profile.username}</p>
					<div class="mt-3 flex items-center gap-2">
						<Badge>{profile.type}</Badge>
						{#if profile.type === UserType.DEVELOPER}
							{#if profile.developer.isForHire}
								<Badge variant="secondary">Open to contracts</Badge>
							{:else}
								<Badge variant="outline">Not hiring</Badge>
							{/if}
						{/if}
					</div>

					<Separator class="my-5" />

					<div class="w-full space-y-3 text-sm">
						<div class="flex items-center gap-3 text-muted-foreground">
							<MailIcon class="size-4 shrink-0" />
							<span class="truncate">{profile.email}</span>
						</div>
						<div class="flex items-center gap-3 text-muted-foreground">
							<AtSignIcon class="size-4 shrink-0" />
							<span>{profile.gender}</span>
						</div>
						<div class="flex items-center gap-3 text-muted-foreground">
							<CalendarDaysIcon class="size-4 shrink-0" />
							<span>Member since {memberSince}</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<div class="space-y-6 lg:col-span-2">
				{#if profile.type === UserType.DEVELOPER}
					<!-- Developer overview -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Overview</Card.Title>
							<Card.Description>Your public developer profile.</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="flex items-center gap-6">
								<div class="flex items-center gap-2">
									<StarIcon class="size-4 text-primary" />
									<span class="text-lg font-bold">{profile.developer.averageRating.toFixed(2)}</span
									>
									<span class="text-sm text-muted-foreground">/ 5</span>
								</div>
								<div class="flex items-center gap-2">
									<WrenchIcon class="size-4 text-primary" />
									<span class="text-lg font-bold">{profile.skills.length}</span>
									<span class="text-sm text-muted-foreground">skills</span>
								</div>
							</div>

							{#if profile.developer.metadata.headline}
								<p class="text-lg font-semibold text-foreground">
									{profile.developer.metadata.headline}
								</p>
							{/if}
							{#if profile.developer.metadata.bio}
								<p class="text-sm leading-relaxed text-muted-foreground">
									{profile.developer.metadata.bio}
								</p>
							{/if}
							{#if profile.developer.metadata.portfolioUrl}
								<button
									type="button"
									onclick={() =>
										window.open(
											profile.developer.metadata.portfolioUrl ?? '',
											'_blank',
											'noopener,noreferrer'
										)}
									class="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:underline"
								>
									<GlobeIcon class="size-4" />
									{profile.developer.metadata.portfolioUrl}
								</button>
							{/if}
						</Card.Content>
					</Card.Root>

					<!-- Skills -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Skills & Tiers</Card.Title>
							<Card.Description>Verified skill tiers shown to clients.</Card.Description>
						</Card.Header>
						<Card.Content>
							{#if profile.skills.length > 0}
								<div class="flex flex-wrap gap-2">
									{#each profile.skills as skill (skill.subCategory)}
										<Badge variant="secondary" class="px-3 py-1">
											{skill.subCategory}
											<Separator orientation="vertical" class="h-3" />
											<span class="text-primary">{skill.tier}</span>
										</Badge>
									{/each}
								</div>
							{:else}
								<p class="text-sm text-muted-foreground">No skills added yet.</p>
							{/if}
						</Card.Content>
					</Card.Root>
				{:else}
					<!-- Client overview -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Overview</Card.Title>
							<Card.Description>Your public client profile.</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="flex items-center gap-6">
								<div class="flex items-center gap-2">
									<BadgeCheckIcon class="size-4 text-primary" />
									<span class="text-lg font-bold">{profile.client.trustScore.toFixed(2)}</span>
									<span class="text-sm text-muted-foreground">/ 100 trust score</span>
								</div>
								<div class="flex items-center gap-2">
									<WrenchIcon class="size-4 text-primary" />
									<span class="text-lg font-bold">{profile.client.reviewCount}</span>
									<span class="text-sm text-muted-foreground">reviews</span>
								</div>
							</div>
							<p class="text-sm leading-relaxed text-muted-foreground">
								{profile.client.isVerifiedOrg
									? 'This account is a verified organization.'
									: 'This account is not yet verified as an organization.'}
							</p>
						</Card.Content>
					</Card.Root>
				{/if}

				<Card.Root>
					<Card.Header>
						<Card.Title>Account</Card.Title>
						<Card.Description>Account-level details.</Card.Description>
					</Card.Header>
					<Card.Content class="flex flex-wrap items-center justify-between gap-4 text-sm">
						<div class="text-muted-foreground">
							Balance:
							<span class="ml-1 font-bold text-foreground"
								>{profile.balance.toLocaleString()} CRD</span
							>
						</div>
						<a href={resolve('/settings/')} class="font-medium text-primary hover:underline">
							Edit profile →
						</a>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	{/if}
</div>
