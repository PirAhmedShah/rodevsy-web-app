<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import UserIcon from '@lucide/svelte/icons/user';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import ShieldAlertIcon from '@lucide/svelte/icons/shield-alert';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import XIcon from '@lucide/svelte/icons/x';
	import { base, resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authState } from '$lib/state/auth.svelte';
	import { userState } from '$lib/state/user.svelte';
	import { logout } from '$lib/services/auth.service.js';

	// ── Static data — plain const, not reactive ────────────────────
	const NAV_LINKS = [{ label: 'Projects', href: '/projects/' }] as const;

	const USER_MENU_PRIMARY = [
		{ icon: UserIcon, label: 'Dashboard', href: '/dashboard/' },
		{ icon: UserIcon, label: 'Public Profile', href: '/profile/' },
		{ icon: SettingsIcon, label: 'Settings', href: '/settings/' }
	] as const;

	const USER_MENU_SECONDARY = [
		{ icon: BriefcaseIcon, label: 'Active Contracts', href: '/contracts/' },
		{ icon: ShieldAlertIcon, label: 'Dispute Center', href: '/disputes/' }
	] as const;

	// ── Reactive state ─────────────────────────────────────────────
	let mobileOpen = $state(false);
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

{#snippet userMenu()}
	<!-- No use: here — the action lives on the wrapper div in the template -->
	<div
		class="absolute top-full right-0 z-50 mt-1 w-64 rounded-xl border border-border bg-card py-1 shadow-lg"
	>
		<div class="border-b border-border px-4 py-3">
			<p class="text-sm font-semibold text-foreground">My Account</p>
			<p class="mt-0.5 text-xs text-muted-foreground">
				Balance:
				<span class="font-bold text-primary"
					>{userState.profile?.balance.toLocaleString() ?? 0} CRD</span
				>
			</p>
		</div>

		<div class="py-1">
			{#each USER_MENU_PRIMARY as item (item.label)}
				<a
					href={resolve(item.href)}
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
					href={resolve(item.href)}
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
					<a
						href={resolve(link.href)}
						class={cn(
							'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
							isActive(link.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
						)}
					>
						{link.label}
					</a>
				{/each}
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
						href={resolve(link.href)}
						onclick={closeMobile}
						class={cn(
							'rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
							isActive(link.href) ? 'bg-accent text-foreground' : 'text-muted-foreground'
						)}
					>
						{link.label}
					</a>
				{/each}
			</div>
		</nav>
	{/if}
</header>
