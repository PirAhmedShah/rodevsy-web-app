<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { base, resolve } from '$app/paths';
	import Typewriter from '$lib/components/shared/typewriter.svelte';
	import { authState } from '$lib/state/auth.svelte';
	import { fade } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { ShieldCheck } from '@lucide/svelte';
	import { CircularProgress } from '$lib/components/ui/circular-progress';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	const { children } = $props();

	const brandingTexts = [
		'Secure your game assets.',
		'Hire vetted developers.',
		'Trade with 0% risk.',
		'Build your Roblox empire.'
	];

	const redirectMessage = $derived(
		history.length > 2
			? 'Taking you back where you came from...'
			: 'Taking you to your dashboard...'
	);

	$effect(() => {
		if (authState.isAuthenticated !== true) return;

		toast.info("You're already logged in.", {
			description: redirectMessage
		});

		if (history.length > 2) {
			preloadData(resolve('/dashboard/'));
		}

		const timer = setTimeout(() => {
			if (history.length > 2) {
				history.back();
			} else {
				goto(resolve('/dashboard/'), { replaceState: true });
			}
		}, 3000);

		return () => clearTimeout(timer);
	});
</script>

<div class="grid min-h-svh bg-background lg:grid-cols-2">
	<div class="flex flex-col gap-4 p-3 md:p-5">
		<div class="flex justify-center gap-2 md:justify-start">
			<a
				href={resolve('/')}
				class="group flex items-center gap-2 font-medium transition-transform hover:scale-105"
			>
				<img src="{base}/icons/logo.svg" alt="logo" width={40} height={40} class="drop-shadow-sm" />
				<span class="text-2xl font-black tracking-tighter text-primary">Rodevsy</span>
			</a>
		</div>

		<div class="flex flex-1 items-center justify-center">
			{#if authState.isAuthenticated === true}
				<div class="flex flex-col items-center gap-4 text-center" in:fade={{ duration: 300 }}>
					<div class="relative flex items-center justify-center">
						<CircularProgress duration={3000} size={80} />
						<div
							class="absolute flex size-14 items-center justify-center rounded-full bg-primary/10"
						>
							<ShieldCheck class="size-7 text-primary" />
						</div>
					</div>
					<div class="space-y-1">
						<p class="font-semibold text-foreground">Already authenticated</p>
						<p class="text-sm text-muted-foreground">{redirectMessage}</p>
					</div>
				</div>
			{:else if authState.isAuthenticated === false}
				<div class="w-full max-w-sm" in:fade={{ duration: 400, delay: 200 }}>
					{@render children?.()}
				</div>
			{:else}
				<Spinner message="Securing session" />
			{/if}
		</div>

		<p class="text-center text-xs text-muted-foreground md:text-left">
			&copy; {new Date().getFullYear()} RoDevsy. The Gold Standard for Roblox Freelancing.
		</p>
	</div>

	<div class="relative hidden flex-col items-center justify-center overflow-hidden px-12 lg:flex">
		<div
			class="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.07)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.07)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[40px_40px]"
		></div>

		<div
			class="absolute -top-[25%] -left-[25%] h-[150%] w-[150%] animate-[pulse_8s_infinite] bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_50%)] from-primary/10 via-transparent to-transparent"
		></div>

		<div class="relative z-10 w-full max-w-lg space-y-6">
			<div
				class="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-md"
			>
				<span class="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-primary"></span>
				Live Marketplace
			</div>

			<h2 class="text-4xl leading-tight font-bold tracking-tight text-foreground lg:text-5xl">
				The Professional <br />
				<span class="text-primary italic">Standard.</span>
			</h2>

			<div class="min-h-[1.5em] text-xl font-medium text-muted-foreground">
				<Typewriter texts={brandingTexts} waitTime={4000} speed={40} />
			</div>

			<div
				class="mt-12 rounded-2xl border border-border bg-card/50 p-6 shadow-2xl backdrop-blur-xl"
			>
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
						<svg
							class="h-6 w-6 text-primary"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						</svg>
					</div>
					<div>
						<p class="text-sm font-bold text-foreground">Escrow System Active</p>
						<p class="text-xs text-muted-foreground">Securing over R$ 1.2M+ in monthly trades.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
