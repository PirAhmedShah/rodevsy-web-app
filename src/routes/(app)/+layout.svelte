<script lang="ts">
	import Header from '$lib/components/shared/header.svelte';
	import Footer from '$lib/components/shared/footer.svelte';
	const { children } = $props();
</script>

<Header />
{@render children?.()}
<Footer />
