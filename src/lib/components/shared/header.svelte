<script lang="ts">
    import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
    import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
    import { cn } from '$lib/utils.js';
    import { toggleMode } from 'mode-watcher';
    import type { HTMLAttributes } from 'svelte/elements';
    import SunIcon from '@lucide/svelte/icons/sun';
    import MoonIcon from '@lucide/svelte/icons/moon';
    import User from '@lucide/svelte/icons/user';
    import { resolve } from '$app/paths';
    import { authState } from '$lib/state/auth.svelte';
	import { logout } from '$lib/services/auth.service.js';

	const talentCategories = [
        {
            title: 'Scripters',
            href: '/talent',
            content: 'Hire verified Luau programmers for your game logic.'
        },
        {
            title: 'Builders & Modelers',
            href: '/talent',
            content: 'Top-tier environment artists and 3D modelers.'
        },
        {
            title: 'UI/UX Designers',
            href: '/talent',
            content: 'Create engaging and intuitive player interfaces.'
        },
        {
            title: 'Animators',
            href: '/talent',
            content: 'Bring your characters and assets to life.'
        }
    ] as const;

    type TalentPaths = (typeof talentCategories)[number]['href'];

    interface TalentCategory extends HTMLAttributes<HTMLAnchorElement> {
        title: string;
        content: string;
        href: TalentPaths ; 
    }
</script>

{#snippet ListItem({ title, content, href, class: className, ...restProps }: TalentCategory)}
    <li>
        <NavigationMenu.Link {href}>
            {#snippet child({ props })}
                <a
                    {...restProps}
                    {...props}
                    href={resolve(href)}
                    class={cn(
                        'block space-y-1 rounded-md p-3 leading-none no-underline transition-all outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                >
                    <div class="text-sm leading-none font-medium">{title}</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {content}
                    </p>
                </a>
            {/snippet}
        </NavigationMenu.Link>
    </li>
{/snippet}
<header class="sticky top-0 z-50 w-full border border-b bg-background">
	<div class=" mx-4 flex h-16 items-center justify-between">
		<div class="flex items-center">
			<a href={resolve("/")} class="flex items-center gap-2 pr-2 transition-opacity hover:opacity-90">
				<img src="/icons/logo.svg" alt="RoDevsy Logo" height={32} width={32} />
				<span class="text-xl font-bold tracking-tighter text-primary">RoDevsy</span>
			</a>

			<div class="hidden lg:block">
				<NavigationMenu.Root>
					<NavigationMenu.List class="gap-1">
						<NavigationMenu.Item>
							<NavigationMenu.Link href="/marketplace" class={navigationMenuTriggerStyle()}>
								Marketplace
							</NavigationMenu.Link>
						</NavigationMenu.Item>

						<NavigationMenu.Item openOnHover>
							<NavigationMenu.Trigger>Talent</NavigationMenu.Trigger>
							<NavigationMenu.Content>
								<ul class="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg:w-150">
									{#each talentCategories as category,i (i)}
    									{@render ListItem(category)}
									{/each}u
								</ul>
							</NavigationMenu.Content>
						</NavigationMenu.Item>

						<NavigationMenu.Item>
							<NavigationMenu.Link href="/projects" class={navigationMenuTriggerStyle()}>
								Projects
							</NavigationMenu.Link>
						</NavigationMenu.Item>

						<NavigationMenu.Item>
							<NavigationMenu.Link href="/forum" class={navigationMenuTriggerStyle()}>
								Forum
							</NavigationMenu.Link>
						</NavigationMenu.Item>
					</NavigationMenu.List>
				</NavigationMenu.Root>
			</div>
		</div>

		<div class="flex items-center gap-2 border-border">
			{#if authState.isAuthenticated}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="ghost" size="icon">
								<User class="size-[1.2rem]" />
								<span class="sr-only">Open user menu</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>

					<DropdownMenu.Content class="w-64" align="end">
						<DropdownMenu.Label class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm leading-none font-medium">Test</p>
								<p class="text-xs leading-none text-muted-foreground">
									Balance: <span class="font-bold text-primary">0 CRD</span>
								</p>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />

						<DropdownMenu.Group>
							<DropdownMenu.Item>
								Dashboard
								<!-- <DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut> -->
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								Public Profile
								<!-- <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut> -->
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								Wallet & Credits
								<!-- <DropdownMenu.Shortcut>⌘W</DropdownMenu.Shortcut> -->
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								Settings
								<!-- <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut> -->
							</DropdownMenu.Item>
						</DropdownMenu.Group>

						<DropdownMenu.Separator />

						<DropdownMenu.Group>
							<DropdownMenu.Item>Active Contracts (Escrow)</DropdownMenu.Item>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>My Workspace</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Item>Purchased Assets</DropdownMenu.Item>
									<DropdownMenu.Item>Marketplace Listings</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item>Forum Threads</DropdownMenu.Item>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
							<DropdownMenu.Item>
								Dispute Center
								<!-- <DropdownMenu.Shortcut>⌘!</DropdownMenu.Shortcut> -->
							</DropdownMenu.Item>
						</DropdownMenu.Group>

						<DropdownMenu.Separator />

						<DropdownMenu.Item>Support & Mediation</DropdownMenu.Item>
						<DropdownMenu.Item>Developer Docs</DropdownMenu.Item>
						<DropdownMenu.Item disabled>API Access</DropdownMenu.Item>

						<DropdownMenu.Separator />

						<DropdownMenu.Item class="text-red-500 focus:bg-red-500/10 focus:text-red-500" onclick={async()=>logout()}>
							Log out
							<!-- <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut> -->
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<a
					href={resolve("/login")}
					class={cn(
						buttonVariants({ variant: 'ghost' }),
						'rounded-md px-6 font-bold shadow-sm transition-transform hover:scale-105 active:scale-95'
					)}
				>
					Login
				</a>
				<a
					href={resolve("/signup")}
					class={cn(
						buttonVariants({ variant: 'default' }),
						'rounded-md px-6 font-bold shadow-sm transition-transform hover:scale-105 active:scale-95'
					)}
				>
					Register
				</a>
			{/if}

			<Button onclick={toggleMode} variant="link" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>
</header>
