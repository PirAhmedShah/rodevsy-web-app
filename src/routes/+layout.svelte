<script lang="ts">
	import './layout.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { initializeApp } from '$lib/services/auth.service';

	let { children } = $props();

	onMount(() => {
		void initializeApp();
	});
</script>

<ModeWatcher />
<Toaster />
{@render children()}
