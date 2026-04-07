<script lang="ts">
	import { resolve } from '$app/paths';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Progress } from '$lib/components/ui/progress';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';

	import {
		Coins,
		Briefcase,
		ShieldCheck,
		Star,
		ArrowUpRight,
		ArrowDownRight,
		Plus,
		ChevronRight,
		Package,
		MessageSquare,
		Users,
		AlertCircle,
		Timer,
		BarChart3,
		Wallet,
		type Icon
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	// ── Types ──────────────────────────────────────────────────────
	type ContractStatus = 'active' | 'review' | 'pending';
	type TransactionType = 'credit' | 'debit';
	type NotificationType = 'contract' | 'payment' | 'dispute' | 'message';

	interface Contract {
		readonly id: string;
		readonly title: string;
		readonly client: string;
		readonly value: number;
		progress: number;
		readonly status: ContractStatus;
		readonly dueDate: string;
		readonly avatar: string;
	}

	interface Transaction {
		readonly id: string;
		readonly type: TransactionType;
		readonly label: string;
		readonly amount: number;
		readonly date: string;
	}

	interface Notification {
		readonly id: string;
		readonly type: NotificationType;
		readonly message: string;
		readonly time: string;
		read: boolean;
	}

	interface Stat {
		readonly label: string;
		readonly value: string;
		readonly icon: Component<Icon>;
		readonly delta: string;
		readonly positive: boolean | null;
	}

	interface QuickLink {
		readonly id: string;
		readonly icon: Component<Icon>;
		readonly label: string;
		readonly desc: string;
		readonly href: string;
		readonly color: string;
	}

	// ── Reactive state (only what truly needs reactivity) ──────────
	let username = $state('Developer');
	let balance = $state(0);
	let profileCompletion = $state(72);

	// API responses are reassigned, not mutated — use $state.raw for perf
	let contracts = $state.raw<Contract[]>([
		{
			id: 'c1',
			title: 'Obby Game — Full Script Package',
			client: 'StudioX',
			value: 1200,
			progress: 65,
			status: 'active',
			dueDate: 'Mar 28',
			avatar: 'SX'
		},
		{
			id: 'c2',
			title: 'UI/UX Overhaul for Tycoon',
			client: 'NeonBuilds',
			value: 850,
			progress: 90,
			status: 'review',
			dueDate: 'Mar 22',
			avatar: 'NB'
		},
		{
			id: 'c3',
			title: 'NPC Combat System',
			client: 'PixelForge',
			value: 2000,
			progress: 20,
			status: 'active',
			dueDate: 'Apr 10',
			avatar: 'PF'
		}
	]);

	let transactions = $state.raw<Transaction[]>([
		{ id: 't1', type: 'credit', label: 'Milestone 1 — Obby Game', amount: 400, date: 'Mar 18' },
		{ id: 't2', type: 'debit', label: 'Marketplace — Combat Asset', amount: 150, date: 'Mar 15' },
		{ id: 't3', type: 'credit', label: 'UI Project — Final Payment', amount: 850, date: 'Mar 10' },
		{ id: 't4', type: 'debit', label: 'Dispute Fee Waived', amount: 0, date: 'Mar 8' }
	]);

	// Notifications are mutated in-place (mark as read) — deep proxy needed
	let notifications = $state<Notification[]>([
		{
			id: 'n1',
			type: 'payment',
			message: 'Milestone payment of 400 CRD released',
			time: '2h ago',
			read: false
		},
		{
			id: 'n2',
			type: 'contract',
			message: 'NeonBuilds submitted milestone for review',
			time: '5h ago',
			read: false
		},
		{
			id: 'n3',
			type: 'message',
			message: 'New message from PixelForge on NPC contract',
			time: '1d ago',
			read: true
		}
	]);

	// ── Derived state ──────────────────────────────────────────────
	const unreadCount = $derived(notifications.filter((n) => !n.read).length);
	const recentTransactions = $derived(transactions.slice(0, 3));
	const hasContracts = $derived(contracts.length > 0);
	const isProfileIncomplete = $derived(profileCompletion < 100);

	// ── Static data (plain const — not reactive) ───────────────────
	const stats: Stat[] = [
		{
			label: 'Active Contracts',
			value: '3',
			icon: Briefcase,
			delta: '+1 this week',
			positive: true
		},
		{ label: 'CRD Balance', value: '0', icon: Coins, delta: 'Top up wallet', positive: null },
		{
			label: 'Completion Rate',
			value: '100%',
			icon: ShieldCheck,
			delta: 'Perfect score',
			positive: true
		},
		{ label: 'Reputation Score', value: '—', icon: Star, delta: 'Earn reviews', positive: null }
	];

	const quickLinks: QuickLink[] = [
		{
			id: 'ql-talent',
			icon: Users,
			label: 'Hire Talent',
			desc: 'Browse developers',
			href: '/talent/',
			color: 'text-blue-500 bg-blue-500/10'
		},
		{
			id: 'ql-market',
			icon: Package,
			label: 'Marketplace',
			desc: 'Buy & sell assets',
			href: '/marketplace/',
			color: 'text-violet-500 bg-violet-500/10'
		},
		{
			id: 'ql-forum',
			icon: MessageSquare,
			label: 'Forum',
			desc: 'Join discussions',
			href: '/forum/',
			color: 'text-emerald-500 bg-emerald-500/10'
		},
		{
			id: 'ql-analytics',
			icon: BarChart3,
			label: 'Analytics',
			desc: 'Coming soon',
			href: '#',
			color: 'text-primary bg-primary/10'
		}
	];

	const STATUS_CONFIG: Record<ContractStatus, { label: string; class: string }> = {
		active: { label: 'In Progress', class: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
		review: { label: 'In Review', class: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
		pending: { label: 'Pending', class: 'bg-muted text-muted-foreground border-border' }
	};

	const NOTIF_ICONS: Record<NotificationType, Component<Icon>> = {
		contract: Briefcase,
		payment: Coins,
		dispute: AlertCircle,
		message: MessageSquare
	};

	// ── Handlers ───────────────────────────────────────────────────
	function markAllRead() {
		for (const n of notifications) {
			n.read = true;
		}
	}
</script>

<svelte:head>
	<title>Dashboard — RoDevsy</title>
</svelte:head>

<!-- ── Reusable snippets ────────────────────────────────────────── -->

{#snippet statDelta(positive: boolean | null, delta: string)}
	{#if positive === true}
		<p class="mt-0.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
			<ArrowUpRight class="size-3" />{delta}
		</p>
	{:else if positive === false}
		<p class="mt-0.5 flex items-center gap-1 text-xs text-destructive">
			<ArrowDownRight class="size-3" />{delta}
		</p>
	{:else}
		<p class="mt-0.5 text-xs text-muted-foreground">{delta}</p>
	{/if}
{/snippet}

{#snippet txRow(tx: Transaction)}
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2.5">
			<div
				class="flex size-7 items-center justify-center rounded-full {tx.type === 'credit'
					? 'bg-emerald-500/10'
					: 'bg-destructive/10'}"
			>
				{#if tx.type === 'credit'}
					<ArrowDownRight class="size-3.5 text-emerald-500" />
				{:else}
					<ArrowUpRight class="size-3.5 text-destructive" />
				{/if}
			</div>
			<div>
				<p class="max-w-[130px] truncate text-xs font-medium text-foreground">{tx.label}</p>
				<p class="text-[10px] text-muted-foreground">{tx.date}</p>
			</div>
		</div>
		<span
			class="text-xs font-bold {tx.type === 'credit'
				? 'text-emerald-600 dark:text-emerald-400'
				: 'text-destructive'}"
		>
			{tx.type === 'credit' ? '+' : '-'}{tx.amount} CRD
		</span>
	</div>
{/snippet}

<!-- ── Page ─────────────────────────────────────────────────────── -->

<div class="min-h-svh bg-background">
	<!-- Page Header -->
	<div class="border-b border-border bg-card">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p class="text-sm text-muted-foreground">Welcome back,</p>
					<h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
						{username}<span class="text-primary"> ✦</span>
					</h1>
					<p class="mt-1 text-sm text-muted-foreground">
						Here's what's happening in your workspace today.
					</p>
				</div>
				<div class="flex items-center gap-2">
					<Button variant="outline" size="sm" href={resolve('/marketplace/')}>
						<Package class="size-4" />
						Browse Assets
					</Button>
					<Button size="sm" href={resolve('/projects/')}>
						<Plus class="size-4" />
						New Project
					</Button>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<!-- Stat Cards — keyed by label (stable unique string) -->
		<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
			{#each stats as stat (stat.label)}
				<Card.Root class="gap-3 px-5 py-4">
					<div class="flex items-center justify-between">
						<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
							{stat.label}
						</p>
						<div class="rounded-md bg-primary/10 p-1.5">
							<stat.icon class="size-3.5 text-primary" />
						</div>
					</div>
					<div>
						<p class="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
						{@render statDelta(stat.positive, stat.delta)}
					</div>
				</Card.Root>
			{/each}
		</div>

		<!-- Profile Completion Banner -->
		{#if isProfileIncomplete}
			<div
				class="mt-4 flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3"
			>
				<div class="flex-1">
					<div class="flex items-center justify-between">
						<p class="text-sm font-medium text-foreground">
							Complete your profile to unlock more visibility
						</p>
						<span class="text-sm font-bold text-primary">{profileCompletion}%</span>
					</div>
					<Progress value={profileCompletion} class="mt-2 h-1.5" />
				</div>
				<Button
					variant="outline"
					size="sm"
					class="shrink-0 border-primary/30 text-primary hover:bg-primary/10"
				>
					Complete
					<ChevronRight class="size-3.5" />
				</Button>
			</div>
		{/if}

		<!-- Main Grid -->
		<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Active Contracts -->
			<div class="lg:col-span-2">
				<Card.Root class="gap-0 p-0">
					<div class="flex items-center justify-between border-b border-border px-6 py-4">
						<div>
							<Card.Title class="text-base">Active Contracts</Card.Title>
							<Card.Description class="text-xs">Your ongoing escrow agreements</Card.Description>
						</div>
						<Button variant="ghost" size="sm" href={resolve('/projects/')} class="gap-1 text-xs">
							View all
							<ChevronRight class="size-3.5" />
						</Button>
					</div>

					{#if hasContracts}
						<div class="divide-y divide-border">
							{#each contracts as contract (contract.id)}
								{@const status = STATUS_CONFIG[contract.status]}
								<div class="group px-6 py-4 transition-colors hover:bg-accent/50">
									<div class="flex items-start gap-3">
										<Avatar.Root class="mt-0.5 size-9 shrink-0">
											<Avatar.Fallback
												class="bg-secondary text-xs font-bold text-secondary-foreground"
											>
												{contract.avatar}
											</Avatar.Fallback>
										</Avatar.Root>

										<div class="min-w-0 flex-1">
											<div class="flex items-start justify-between gap-2">
												<div class="min-w-0">
													<p class="truncate text-sm font-semibold text-foreground">
														{contract.title}
													</p>
													<p class="text-xs text-muted-foreground">{contract.client}</p>
												</div>
												<div class="flex shrink-0 flex-col items-end gap-1.5">
													<span
														class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium {status.class}"
													>
														{status.label}
													</span>
													<span class="text-xs font-bold text-primary">{contract.value} CRD</span>
												</div>
											</div>

											<div class="mt-2.5">
												<div class="mb-1.5 flex items-center justify-between">
													<span class="text-xs text-muted-foreground">Progress</span>
													<div class="flex items-center gap-2">
														<span class="text-xs font-medium text-foreground"
															>{contract.progress}%</span
														>
														<span class="flex items-center gap-1 text-xs text-muted-foreground">
															<Timer class="size-3" />
															Due {contract.dueDate}
														</span>
													</div>
												</div>
												<div class="h-1.5 overflow-hidden rounded-full bg-muted">
													<div
														class="h-full rounded-full bg-primary transition-all duration-500"
														style:width="{contract.progress}%"
													></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center gap-3 py-12 text-center">
							<Briefcase class="size-10 text-muted-foreground/40" />
							<div>
								<p class="text-sm font-medium text-foreground">No active contracts</p>
								<p class="text-xs text-muted-foreground">Browse projects to get started</p>
							</div>
							<Button size="sm" href={resolve('/projects/')}>
								<Plus class="size-4" />
								Find Projects
							</Button>
						</div>
					{/if}
				</Card.Root>
			</div>

			<!-- Right Column -->
			<div class="flex flex-col gap-6">
				<!-- Wallet -->
				<Card.Root class="gap-0 p-0">
					<div class="border-b border-border px-5 py-4">
						<div class="flex items-center justify-between">
							<Card.Title class="text-base">Wallet</Card.Title>
							<div class="rounded-md bg-primary/10 p-1.5">
								<Wallet class="size-3.5 text-primary" />
							</div>
						</div>
					</div>
					<div class="px-5 py-5">
						<div class="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
							<p class="text-xs text-muted-foreground">Available Balance</p>
							<p class="mt-0.5 text-3xl font-bold tracking-tight text-primary">
								{balance}<span class="text-lg font-medium"> CRD</span>
							</p>
						</div>
						<div class="mt-3 grid grid-cols-2 gap-2">
							<Button variant="outline" size="sm" class="w-full text-xs">
								<ArrowDownRight class="size-3.5" />
								Withdraw
							</Button>
							<Button size="sm" class="w-full text-xs">
								<ArrowUpRight class="size-3.5" />
								Top Up
							</Button>
						</div>
					</div>

					<Separator />

					<div class="px-5 py-3">
						<p class="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Recent Activity
						</p>
						<div class="space-y-2.5">
							{#each recentTransactions as tx (tx.id)}
								{@render txRow(tx)}
							{/each}
						</div>
					</div>
				</Card.Root>

				<!-- Notifications -->
				<Card.Root class="gap-0 p-0">
					<div class="flex items-center justify-between border-b border-border px-5 py-4">
						<Card.Title class="text-base">Notifications</Card.Title>
						<div class="flex items-center gap-2">
							{#if unreadCount > 0}
								<Badge class="bg-primary px-1.5 py-0 text-[10px] text-primary-foreground">
									{unreadCount} new
								</Badge>
								<button
									class="text-[10px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
									onclick={markAllRead}
								>
									Mark all read
								</button>
							{/if}
						</div>
					</div>
					<div class="divide-y divide-border">
						{#each notifications as notif (notif.id)}
							{@const NotifIcon = NOTIF_ICONS[notif.type]}
							<div
								class="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-accent/50"
								class:bg-accent={!notif.read}
							>
								<div
									class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10"
								>
									<NotifIcon class="size-3.5 text-primary" />
								</div>
								<div class="min-w-0 flex-1">
									<p class="text-xs leading-snug text-foreground" class:font-medium={!notif.read}>
										{notif.message}
									</p>
									<p class="mt-0.5 text-[10px] text-muted-foreground">{notif.time}</p>
								</div>
								{#if !notif.read}
									<div class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></div>
								{/if}
							</div>
						{/each}
					</div>
				</Card.Root>
			</div>
		</div>

		<!-- Quick Links — keyed by stable id -->
		<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each quickLinks as link (link.id)}
				<a
					href={resolve(link.href)}
					class="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/30 hover:bg-accent/60 hover:shadow-sm"
				>
					<div class="shrink-0 rounded-lg p-2 {link.color}">
						<link.icon class="size-4" />
					</div>
					<div class="min-w-0">
						<p
							class="text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
						>
							{link.label}
						</p>
						<p class="text-xs text-muted-foreground">{link.desc}</p>
					</div>
					<ChevronRight
						class="ml-auto size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5"
					/>
				</a>
			{/each}
		</div>
	</div>
</div>
