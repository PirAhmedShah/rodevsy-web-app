<script lang="ts">
	import { cn } from '$lib/utils.js';

	interface Props {
		size?: 'sm' | 'md' | 'lg';
		label?: string;
		message?: string;
		class?: string;
	}

	let { size = 'md', label, message, class: className }: Props = $props();

	const sizeMap = {
		sm: { outer: 'size-8', inner: 'size-5', dot: 'size-1.5', glow: 'size-8' },
		md: { outer: 'size-16', inner: 'size-10', dot: 'size-2', glow: 'size-16' },
		lg: { outer: 'size-24', inner: 'size-16', dot: 'size-3', glow: 'size-24' }
	} as const;

	const scale = $derived(sizeMap[size]);
</script>

<div
	role="status"
	aria-label={label ?? 'Loading'}
	class={cn('flex flex-col items-center gap-6', className)}
>
	<!-- Rings -->
	<div class="spinner-rings relative flex items-center justify-center">
		<!-- Ambient glow behind the rings -->
		<div class={cn('absolute rounded-full bg-primary/10 blur-xl', scale.glow)}></div>

		<!-- Outer ring -->
		<div
			class={cn(
				'animate-spin rounded-full border-2 border-border border-t-primary [animation-duration:3s]',
				scale.outer
			)}
		></div>

		<!-- Inner counter-rotating ring -->
		<div
			class={cn(
				'absolute animate-spin rounded-full border-2 border-transparent border-b-primary/50 [animation-duration:1.5s] direction-reverse',
				scale.inner
			)}
		></div>

		<!-- Center dot -->
		<div
			class={cn(
				'absolute animate-pulse rounded-full bg-primary shadow-[0_0_8px_2px] shadow-primary/50',
				scale.dot
			)}
		></div>
	</div>

	<!-- Text -->
	{#if label || message}
		<div class="spinner-text flex flex-col items-center gap-1.5">
			{#if label}
				<p class="animate-pulse text-sm font-medium tracking-widest text-foreground uppercase">
					{label}
				</p>
			{/if}
			{#if message}
				<p class="text-xs text-muted-foreground">
					{message}<span class="dots">...</span>
				</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* ── Entrance animations ──────────────────────────────────── */
	.spinner-rings {
		animation: rings-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	.spinner-text {
		animation: text-in 0.5s ease both;
		animation-delay: 0.25s;
	}

	@keyframes rings-in {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes text-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── Ellipsis animation ───────────────────────────────────── */
	.dots {
		display: inline-block;
		animation: ellipsis 2s steps(4, end) infinite;
		width: 1.2em;
		overflow: hidden;
		vertical-align: bottom;
	}

	@keyframes ellipsis {
		0% {
			width: 0;
		}
		100% {
			width: 1.2em;
		}
	}
</style>
