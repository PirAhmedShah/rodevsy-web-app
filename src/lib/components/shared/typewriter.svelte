<script lang="ts">
	import typewriter from '$lib/transitions/typewriter.js';

	let {
		texts = [],
		waitTime = 3000,
		speed = 50
	} = $props<{
		texts: string[];
		waitTime?: number;
		speed?: number;
	}>();

	let i = $state(0);

	$effect(() => {
		if (texts.length === 0) return;
		const interval = setInterval(() => {
			i = (i + 1) % texts.length;
		}, waitTime);
		return () => clearInterval(interval);
	});
</script>

{#if texts.length > 0}
	{#key i}
		<span
			in:typewriter={{ speed }}
			class="inline-block min-h-[1.2em] after:ml-0.5 after:animate-[pulse_1s_infinite] after:text-primary after:content-['|']"
		>
			{texts[i]}
		</span>
	{/key}
{/if}
