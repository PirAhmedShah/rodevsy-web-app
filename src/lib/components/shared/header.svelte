<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import UserIcon from '@lucide/svelte/icons/user';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
	import WalletIcon from '@lucide/svelte/icons/wallet';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import ShieldAlertIcon from '@lucide/svelte/icons/shield-alert';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import XIcon from '@lucide/svelte/icons/x';
	// resolve() is typed to known literal routes — use base + href for data-driven paths
	import { base, resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authState } from '$lib/state/auth.svelte';
	import { logout } from '$lib/services/auth.service.js';

	// ── Types ──────────────────────────────────────────────────────
	interface NavLink {
		readonly label: string;
		readonly href: string;
	}

	interface TalentCategory {
		readonly label: string;
		readonly href: string;
		readonly desc: string;
	}

	interface MenuItem {
		readonly icon: typeof UserIcon;
		readonly label: string;
		readonly href: string;
	}

	// ── Static data — plain const, not reactive ────────────────────
	const NAV_LINKS: NavLink[] = [
		{ label: 'Marketplace', href: '/marketplace/' },
		{ label: 'Projects', href: '/projects/' },
		{ label: 'Forum', href: '/forum/' }
	];

	const TALENT_CATEGORIES: TalentCategory[] = [
		{
			label: 'Scripters',
			href: '/talent/',
			desc: 'Hire verified Luau programmers for your game logic.'
		},
		{
			label: 'Builders & Modelers',
			href: '/talent/',
			desc: 'Top-tier environment artists and 3D modelers.'
		},
		{
			label: 'UI/UX Designers',
			href: '/talent/',
			desc: 'Create engaging and intuitive player interfaces.'
		},
		{ label: 'Animators', href: '/talent/', desc: 'Bring your characters and assets to life.' }
	];

	const USER_MENU_PRIMARY: MenuItem[] = [
		{ icon: UserIcon, label: 'Dashboard', href: '/dashboard/' },
		{ icon: UserIcon, label: 'Public Profile', href: '/profile/' },
		{ icon: WalletIcon, label: 'Wallet & Credits', href: '/wallet/' },
		{ icon: SettingsIcon, label: 'Settings', href: '/settings/' }
	];

	const USER_MENU_SECONDARY: MenuItem[] = [
		{ icon: BriefcaseIcon, label: 'Active Contracts', href: '/contracts/' },
		{ icon: ShieldAlertIcon, label: 'Dispute Center', href: '/disputes/' }
	];

	// ── Reactive state ─────────────────────────────────────────────
	let mobileOpen = $state(false);
	let talentOpen = $state(false);
	let userMenuOpen = $state(false);

	// ── Derived ────────────────────────────────────────────────────
	const isAuthenticated = $derived(authState.isAuthenticated);
	const currentPath = $derived(page.url.pathname);

	// ── Helpers ────────────────────────────────────────────────────
	function isActive(href: string): boolean {
		return currentPath.startsWith(href);
	}

	function closeMobile() {
		mobileOpen = false;
	}

	async function handleLogout() {
		userMenuOpen = false;
		await logout();
	}

	// Svelte action — must be applied to elements in the main template,
	// NOT inside snippets (snippets are inert markup factories).
	function clickOutside(node: HTMLElement, callback: () => void) {
		function handle(e: MouseEvent) {
			if (!node.contains(e.target as Node)) callback();
		}
		document.addEventListener('click', handle, true);
		return {
			destroy() {
				document.removeEventListener('click', handle, true);
			}
		};
	}
</script>

<!-- ── Snippets (no actions, no resolve() on dynamic hrefs) ─────── -->

{#snippet talentFlyout()}
	<!-- No use: here — the action lives on the wrapper div in the template -->
	<div
		class="absolute top-full left-0 z-50 mt-1 w-130 rounded-xl border border-border bg-card p-4 shadow-lg"
	>
		<p class="mb-3 px-1 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
			Browse by specialty
		</p>
		<ul class="grid grid-cols-2 gap-2">
			{#each TALENT_CATEGORIES as cat (cat.label)}
				<li>
					<!-- base + href avoids the resolve() literal-type constraint -->
					<a
						href={base + cat.href}
						onclick={() => {
							talentOpen = false;
							closeMobile();
						}}
						class="block rounded-lg p-3 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						<p class="text-sm font-medium text-foreground">{cat.label}</p>
						<p class="mt-0.5 text-xs leading-snug text-muted-foreground">{cat.desc}</p>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/snippet}

{#snippet userMenu()}
	<!-- No use: here — the action lives on the wrapper div in the template -->
	<div
		class="absolute top-full right-0 z-50 mt-1 w-64 rounded-xl border border-border bg-card py-1 shadow-lg"
	>
		<div class="border-b border-border px-4 py-3">
			<p class="text-sm font-semibold text-foreground">My Account</p>
			<p class="mt-0.5 text-xs text-muted-foreground">
				Balance: <span class="font-bold text-primary">0 CRD</span>
			</p>
		</div>

		<div class="py-1">
			{#each USER_MENU_PRIMARY as item (item.label)}
				<a
					href={base + item.href}
					onclick={() => (userMenuOpen = false)}
					class="flex items-center gap-3 px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
				>
					<item.icon class="size-4 text-muted-foreground" />
					{item.label}
				</a>
			{/each}
		</div>

		<div class="border-t border-border py-1">
			{#each USER_MENU_SECONDARY as item (item.label)}
				<a
					href={base + item.href}
					onclick={() => (userMenuOpen = false)}
					class="flex items-center gap-3 px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
				>
					<item.icon class="size-4 text-muted-foreground" />
					{item.label}
				</a>
			{/each}
		</div>

		<div class="border-t border-border py-1">
			<button
				onclick={handleLogout}
				class="flex w-full items-center gap-3 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
			>
				<LogOutIcon class="size-4" />
				Log out
			</button>
		</div>
	</div>
{/snippet}

<!-- ── Header ───────────────────────────────────────────────────── -->
<header class="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<!-- Left: Logo + desktop nav -->
		<div class="flex items-center gap-1">
			<a
				href={resolve('/')}
				class="mr-3 flex items-center gap-2 rounded-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			>
				<img src="{base}/icons/logo.svg" alt="RoDevsy Logo" height={28} width={28} />
				<span class="text-xl font-bold tracking-tighter text-primary">RoDevsy</span>
			</a>

			<nav class="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
				{#each NAV_LINKS as link (link.href)}
					<!-- base + href for data-driven paths — resolve() only for inline literals -->
					<a
						href={base + link.href}
						class={cn(
							'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
							isActive(link.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
						)}
					>
						{link.label}
					</a>
				{/each}

				<!-- Talent dropdown — use:clickOutside lives here on the HTML element -->
				<div class="relative" use:clickOutside={() => (talentOpen = false)}>
					<button
						onclick={() => (talentOpen = !talentOpen)}
						aria-expanded={talentOpen}
						aria-haspopup="true"
						class={cn(
							'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
							isActive('/talent/') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
						)}
					>
						Talent
						<!-- style: directive is invalid on components — use inline style string -->
						<span
							style="display:contents; transform:{talentOpen
								? 'rotate(180deg)'
								: 'rotate(0deg)'}; transition:transform 200ms"
						>
							<ChevronDownIcon
								class="size-3.5 transition-transform duration-200 {talentOpen ? 'rotate-180' : ''}"
							/>
						</span>
					</button>

					{#if talentOpen}
						{@render talentFlyout()}
					{/if}
				</div>
			</nav>
		</div>

		<!-- Right: auth + theme + mobile toggle -->
		<div class="flex items-center gap-1.5">
			{#if isAuthenticated === true}
				<!-- use:clickOutside on the HTML wrapper element, not the snippet -->
				<div class="relative" use:clickOutside={() => (userMenuOpen = false)}>
					<button
						onclick={() => (userMenuOpen = !userMenuOpen)}
						aria-expanded={userMenuOpen}
						aria-haspopup="true"
						aria-label="Open user menu"
						class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
					>
						<UserIcon class="size-[1.1rem]" />
					</button>

					{#if userMenuOpen}
						{@render userMenu()}
					{/if}
				</div>
			{:else if isAuthenticated === false}
				<a
					href={resolve('/login/')}
					class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'font-semibold')}
				>
					Login
				</a>
				<a
					href={resolve('/signup/')}
					class={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'font-semibold')}
				>
					Register
				</a>
			{:else}
				<div class="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
			{/if}

			<!-- Theme toggle -->
			<button
				onclick={toggleMode}
				aria-label="Toggle theme"
				class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
			>
				<SunIcon
					class="size-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute size-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
			</button>

			<!-- Mobile hamburger -->
			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-expanded={mobileOpen}
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
				class={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'lg:hidden')}
			>
				{#if mobileOpen}
					<XIcon class="size-5" />
				{:else}
					<MenuIcon class="size-5" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile nav drawer -->
	{#if mobileOpen}
		<nav
			class="border-t border-border bg-background px-4 pt-3 pb-4 lg:hidden"
			aria-label="Mobile navigation"
		>
			<div class="flex flex-col gap-0.5">
				{#each NAV_LINKS as link (link.href)}
					<a
						href={base + link.href}
						onclick={closeMobile}
						class={cn(
							'rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
							isActive(link.href) ? 'bg-accent text-foreground' : 'text-muted-foreground'
						)}
					>
						{link.label}
					</a>
				{/each}

				<!-- Talent sub-list on mobile (no use: needed — tap-away closes mobile drawer entirely) -->
				<div>
					<button
						onclick={() => (talentOpen = !talentOpen)}
						class="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						Talent
						<ChevronDownIcon
							class="size-4 transition-transform duration-200 {talentOpen ? 'rotate-180' : ''}"
						/>
					</button>

					{#if talentOpen}
						<div class="mt-1 ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
							{#each TALENT_CATEGORIES as cat (cat.label)}
								<a
									href={base + cat.href}
									onclick={closeMobile}
									class="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
								>
									{cat.label}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</nav>
	{/if}
</header>
