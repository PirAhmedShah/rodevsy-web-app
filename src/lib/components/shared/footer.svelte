<script lang="ts">
	import Twitter from "@lucide/svelte/icons/twitter";
	import Github from "@lucide/svelte/icons/github";
	import Linkedin from "@lucide/svelte/icons/linkedin";
	import { resolve,base } from "$app/paths";

	const currentYear = new Date().getFullYear();
	
	const footerLinks = [
		{
			title: "Product",
			links: [
				{ label: "Marketplace", href: "/marketplace/" },
				{ label: "Talent", href: "/talent/" },
				{ label: "Projects", href: "/projects/" },
			]
		},
		{
			title: "Support",
			links: [
				{ label: "Forum", href: "/forum/" },
				{ label: "Guidelines", href: "/docs/" }
			]
		},
		{
			title: "Legal",
			links: [
				{ label: "Terms", href: "/terms/" },
				{ label: "Privacy", href: "/privacy/" }
			]
		}
	] as const;
</script>

<footer class="border-t w-full border-border bg-background">
	<div class="px-4 py-12 md:py-16">
		<div class="xl:grid xl:grid-cols-3 xl:gap-8">
			<div class="space-y-6">
				<a href={resolve('/')} class="flex items-center space-x-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg">
						<img src="{base}/icons/logo.svg" alt="logo"/>
					</div>
					<span class="font-bold tracking-tighter text-xl uppercase">RODEVSY</span>
				</a>
				<p class="text-sm text-muted-foreground max-w-xs leading-relaxed">
					Securing the Roblox economy with enterprise-grade escrow and gas-free credits.
				</p>
				<div class="flex space-x-4">
					{#each [Twitter, Github, Linkedin] as Icon,i (i)}
						<a href={resolve('/')} class="text-muted-foreground hover:text-primary transition-colors">
							<Icon size={20} />
						</a>
					{/each}
				</div>
			</div>
			
			<div class="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 sm:grid-cols-3">
				{#each footerLinks as group, i (i)}
					<div class="space-y-4">
						<h4 class="text-sm font-semibold uppercase tracking-wider">{group.title}</h4>
						<ul class="space-y-2">
							{#each group.links as link,i (i)}
								<li>
									<a href={resolve(link.href)} class="text-sm text-muted-foreground hover:text-primary transition-colors">
										{link.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
		
		<div class="mt-12 border-t border-border pt-8 text-center md:flex md:items-center md:justify-between">
			<p class="text-xs text-muted-foreground">
				&copy; {currentYear} RoDevsy. All rights reserved.
			</p>
			<a href={resolve('/docs/')} class="text-xs text-muted-foreground mt-4 md:mt-0">
				Cookie Preferences
			</a>
		</div>
	</div>
</footer>