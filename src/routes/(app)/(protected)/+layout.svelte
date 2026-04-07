<script lang="ts">
	import { authState } from '$lib/state/auth.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { CircularProgress } from '$lib/components/ui/circular-progress';
	import { fade } from 'svelte/transition';
	import { ShieldX } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { goto, preloadData } from '$app/navigation';

	let { children } = $props();

	$effect(() => {
		if (authState.isAuthenticated !== false) return;

		toast.info("You're not logged in.", { description: 'Redirecting to login...' });

		// Kick off preload immediately — data is cached by the time goto() fires
		preloadData(resolve('/login/'));

		const timer = setTimeout(() => {
			goto(resolve('/login/'), { replaceState: true });
		}, 3000);

		return () => clearTimeout(timer);
	});
</script>

<div class="flex min-h-svh flex-col">
	<main class="flex flex-1 flex-col">
		{#if authState.isAuthenticated === true}
			{@render children?.()}
		{:else if authState.isAuthenticated === false}
			<!-- Unauthenticated — countdown redirect state -->
			<div class="flex flex-1 items-center justify-center" in:fade={{ duration: 300 }}>
				<div class="flex flex-col items-center gap-4 text-center">
					<div class="relative flex items-center justify-center">
						<CircularProgress duration={3000} size={80} class="text-destructive" />
						<div
							class="absolute flex size-14 items-center justify-center rounded-full bg-destructive/10"
						>
							<ShieldX class="size-7 text-destructive" />
						</div>
					</div>
					<div class="space-y-1">
						<p class="font-semibold text-foreground">Not authenticated</p>
						<p class="text-sm text-muted-foreground">Redirecting to login...</p>
					</div>
				</div>
			</div>
		{:else}
			<!-- null — session check in flight -->
			<div class="flex flex-1 items-center justify-center">
				<Spinner message="Securing session" />
			</div>
		{/if}
	</main>
</div>
