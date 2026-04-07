<script lang="ts">
	import { onMount } from 'svelte';

	let { duration = 2000, size = 80, strokeWidth = 3, class: className = 'text-primary' } = $props();

	let progress = $state(0);

	const radius = $derived((size - strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const offset = $derived(circumference * (1 - progress));

	onMount(() => {
		const start = performance.now();
		let frame: number;

		const tick = (now: number) => {
			progress = Math.min((now - start) / duration, 1);
			if (progress < 1) frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});
</script>

<svg width={size} height={size} class="-rotate-90">
	<circle
		cx={size / 2}
		cy={size / 2}
		r={radius}
		fill="none"
		stroke="currentColor"
		stroke-width={strokeWidth}
		class="text-border"
	/>
	<circle
		cx={size / 2}
		cy={size / 2}
		r={radius}
		fill="none"
		stroke="currentColor"
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-dasharray={circumference}
		stroke-dashoffset={offset}
		class={className}
	/>
</svg>
