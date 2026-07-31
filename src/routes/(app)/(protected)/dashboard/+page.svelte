<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { userState } from '$lib/state/user.svelte';
	import { UserType } from '$lib/types/auth.type';
	import WalletIcon from '@lucide/svelte/icons/wallet';
	import StarIcon from '@lucide/svelte/icons/star';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import WrenchIcon from '@lucide/svelte/icons/wrench';
	import { resolve } from '$app/paths';

	const profile = $derived(userState.profile);

	const displayName = $derived(profile?.displayName ?? 'there');
	const balance = $derived(profile?.balance ?? 0);
	const skillCount = $derived(profile?.skills.length ?? 0);
</script>

<div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	{#if !profile}
		<!-- Loading state -->
		<div class="space-y-6">
			<Skeleton class="h-8 w-64" />
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<Skeleton class="h-32" />
				<Skeleton class="h-32" />
				<Skeleton class="h-32" />
			</div>
			<Skeleton class="h-48" />
		</div>
	{:else}
		<!-- Greeting -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold tracking-tight text-foreground">
				Welcome back, {displayName}
			</h1>
			<p class="mt-1 text-muted-foreground">Here's an overview of your RoDevsy account.</p>
		</div>

		<!-- Stat cards -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0">
					<Card.Title class="text-sm font-medium text-muted-foreground">Balance</Card.Title>
					<WalletIcon class="size-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold text-foreground">
						{balance.toLocaleString()} <span class="text-base font-semibold text-primary">CRD</span>
					</div>
					<p class="mt-1 text-xs text-muted-foreground">Available for contracts and payouts.</p>
				</Card.Content>
			</Card.Root>

			{#if profile.type === UserType.DEVELOPER}
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0">
						<Card.Title class="text-sm font-medium text-muted-foreground">Rating</Card.Title>
						<StarIcon class="size-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold text-foreground">
							{profile.developer.averageRating.toFixed(2)}
							<span class="text-base font-semibold text-muted-foreground">/ 5</span>
						</div>
						<p class="mt-1 text-xs text-muted-foreground">
							{profile.developer.reviewCount}
							{profile.developer.reviewCount === 1 ? 'review' : 'reviews'}
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0">
						<Card.Title class="text-sm font-medium text-muted-foreground">Skills</Card.Title>
						<WrenchIcon class="size-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold text-foreground">
							{skillCount}
							<span class="text-base font-semibold text-muted-foreground">verified</span>
						</div>
						<p class="mt-1 text-xs text-muted-foreground">
							{profile.developer.isForHire
								? 'Open to contracts.'
								: 'Currently not open to contracts.'}
						</p>
					</Card.Content>
				</Card.Root>
			{:else}
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0">
						<Card.Title class="text-sm font-medium text-muted-foreground">Trust Score</Card.Title>
						<BadgeCheckIcon class="size-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold text-foreground">
							{profile.client.trustScore.toFixed(2)}
							<span class="text-base font-semibold text-muted-foreground">/ 100</span>
						</div>
						<p class="mt-1 text-xs text-muted-foreground">
							{profile.client.reviewCount}
							{profile.client.reviewCount === 1 ? 'review' : 'reviews'} · {profile.client
								.isVerifiedOrg
								? 'Verified organization'
								: 'Not verified'}
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0">
						<Card.Title class="text-sm font-medium text-muted-foreground"
							>Active Projects</Card.Title
						>
						<WrenchIcon class="size-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold text-foreground">0</div>
						<p class="mt-1 text-xs text-muted-foreground">Contracts you're currently funding.</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>

		<!-- Skills overview -->
		<Card.Root class="mt-6">
			<Card.Header>
				<Card.Title>Your Skills</Card.Title>
				<Card.Description>
					{profile.skills.length > 0
						? 'Tiers shown below are visible to clients.'
						: 'No skills added yet — add some from Settings.'}
				</Card.Description>
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
					<a href={resolve('/settings/')} class="text-sm font-medium text-primary hover:underline">
						Add your first skill →
					</a>
				{/if}
			</Card.Content>
		</Card.Root>
	{/if}
</div>
