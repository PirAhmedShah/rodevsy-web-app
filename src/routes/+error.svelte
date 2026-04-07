<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ArrowLeft, House } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	const statusMessages: Record<number, { title: string; subtitle: string }> = {
		404: {
			title: 'Page Not Found',
			subtitle: "The page you're looking for has vanished into the void."
		},
		403: {
			title: 'Access Forbidden',
			subtitle: "You don't have permission to view this resource."
		},
		500: { title: 'Server Error', subtitle: "Something broke on our end. We're already on it." },
		503: {
			title: 'Service Unavailable',
			subtitle: "We're down for maintenance. Please check back shortly."
		}
	};

	let status = $derived($page.status ?? 500);
	let message = $derived(
		statusMessages[status] ?? {
			title: 'Unexpected Error',
			subtitle: $page.error?.message ?? 'An unknown error occurred.'
		}
	);
</script>

<!-- Orb 1 -->
<div
	class="pointer-events-none fixed -top-1/4 -right-1/4 z-0 size-[55vmax] animate-pulse rounded-full bg-primary/20 blur-[110px]"
	aria-hidden="true"
></div>
<!-- Orb 2 -->
<div
	class="pointer-events-none fixed -bottom-1/4 -left-1/4 z-0 size-[40vmax] animate-pulse rounded-full bg-secondary/20 blur-[110px] [animation-delay:2s]"
	aria-hidden="true"
></div>
<!-- Grain -->
<div
	class="grain pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-overlay"
	aria-hidden="true"
></div>
<!-- Grid -->
<div class="grid-overlay pointer-events-none fixed inset-0 z-0 opacity-40" aria-hidden="true"></div>

<main
	class="relative z-10 flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center"
>
	<!-- Status code -->
	<div class="animate-rise relative inline-block [--delay:0s]">
		<span class="status-code relative z-10 block font-serif leading-none tracking-tighter"
			>{status}</span
		>
		<div
			class="absolute inset-0 animate-pulse font-serif leading-none tracking-tighter text-primary opacity-40 blur-[52px] select-none"
			aria-hidden="true"
		>
			{status}
		</div>
	</div>

	<!-- Divider -->
	<div class="animate-rise flex w-72 items-center gap-3 [--delay:0.08s]">
		<span class="h-px flex-1 bg-linear-to-r from-transparent via-primary/50 to-transparent"></span>
		<span class="size-1.5 shrink-0 rotate-45 animate-pulse bg-primary"></span>
		<span class="h-px flex-1 bg-linear-to-r from-transparent via-primary/50 to-transparent"></span>
	</div>

	<!-- Text -->
	<div class="animate-rise flex flex-col gap-2 [--delay:0.16s]">
		<h1
			class="font-serif text-2xl font-normal tracking-widest text-foreground uppercase sm:text-3xl"
		>
			{message.title}
		</h1>
		<p class="max-w-[36ch] text-sm leading-relaxed text-muted-foreground italic">
			{message.subtitle}
		</p>
	</div>

	<!-- Actions -->
	<div class="animate-rise flex flex-wrap items-center justify-center gap-3 pt-2 [--delay:0.24s]">
		<Button onclick={() => history.back()} variant="outline">
			<ArrowLeft size={16} />
			Back
		</Button>

		<Button onclick={() => goto(resolve('/'))}>
			<House size={16} />
			Home
		</Button>
	</div>
</main>

<style>
	/* Gradient text — needs -webkit-text-fill-color, no Tailwind equivalent */
	.status-code {
		font-size: clamp(7rem, 22vw, 15rem);
		background: linear-gradient(
			135deg,
			var(--accent) 0%,
			var(--primary) 45%,
			var(--secondary) 100%
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* SVG noise grain */
	.grain {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-size: 180px 180px;
	}

	/* Double background-image grid + radial mask */
	.grid-overlay {
		background-image:
			linear-gradient(to right, var(--border) 1px, transparent 1px),
			linear-gradient(to bottom, var(--border) 1px, transparent 1px);
		background-size: 72px 72px;
		mask-image: radial-gradient(ellipse 65% 65% at 50% 50%, black 0%, transparent 100%);
	}

	/* Staggered entrance */
	.animate-rise {
		animation: rise 0.8s var(--delay, 0s) cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(28px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
