<script lang="ts">
	import './layout.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import { initializeApp } from '$lib/services/auth.service.js';
	let { children } = $props();

	initializeApp();
</script>

<ModeWatcher />
<Toaster />

{@render children?.()}
