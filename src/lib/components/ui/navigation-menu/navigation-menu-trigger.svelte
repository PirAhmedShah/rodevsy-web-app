<script lang="ts" module>
	import { cn } from "$lib/utils.js";
	import { tv } from "tailwind-variants";
export const navigationMenuTriggerStyle = tv({
    base: [
        // Layout & Typography
        "group inline-flex h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium outline-none",
        // The Binance Magic: Text transitions to primary on hover
        "text-foreground transition-colors duration-200 ease-out hover:text-primary focus:text-primary",
        // Handle the Chevron icon rotation if you use one
        "data-[state=open]:text-primary",
        // Active/Current Page state
        "data-[active]:text-primary data-[active]:font-semibold",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",
        // Background: Binance uses a extremely subtle ghost hover or none at all
        "hover:bg-transparent" 
    ].join(" "),
});
</script>

<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.TriggerProps = $props();
</script>

<NavigationMenuPrimitive.Trigger
	bind:ref
	data-slot="navigation-menu-trigger"
	class={cn(navigationMenuTriggerStyle(), "group", className)}
	{...restProps}
>
	{@render children?.()}

	<ChevronDownIcon
		class="relative top-[1px] ms-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
		aria-hidden="true"
	/>
</NavigationMenuPrimitive.Trigger>
