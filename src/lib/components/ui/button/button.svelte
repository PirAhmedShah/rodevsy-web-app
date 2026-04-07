<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: [
			// layout
			'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
			// typography
			'text-sm font-medium tracking-wide',
			// shape
			'rounded-md',
			// transitions
			'transition-all duration-200 ease-out',
			// focus
			'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring',
			// disabled
			'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
			// invalid
			'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
			// svg
			"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		],
		variants: {
			variant: {
				// Gold — your primary brand button
				default: [
					'bg-primary text-primary-foreground',
					'shadow-[0_1px_12px] shadow-primary/25',
					'hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_4px_20px] hover:shadow-primary/40',
					'active:translate-y-0 active:shadow-sm'
				],

				// Destructive — red, serious
				destructive: [
					'bg-destructive text-white',
					'shadow-xs',
					'hover:bg-destructive/90 hover:-translate-y-px',
					'active:translate-y-0',
					'focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
					'dark:bg-destructive/60'
				],

				// Outline — bordered, background-aware
				outline: [
					'border border-border bg-background text-foreground',
					'shadow-xs',
					'hover:border-primary/50 hover:bg-accent hover:text-accent-foreground hover:-translate-y-px',
					'active:translate-y-0',
					'dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
				],

				// Secondary — muted, supporting action
				secondary: [
					'bg-secondary text-secondary-foreground',
					'shadow-xs',
					'hover:bg-secondary/70 hover:-translate-y-px',
					'active:translate-y-0'
				],

				// Ghost — no background, subtle hover
				ghost: [
					'text-foreground bg-transparent',
					'hover:bg-accent hover:text-accent-foreground',
					'dark:hover:bg-accent',
					'active:bg-accent/70'
				],

				// Link — inline text action
				link: ['text-primary underline-offset-4', 'hover:underline hover:text-primary/80'],

				// Gold outline — branded but lighter weight
				'outline-primary': [
					'border border-primary/50 bg-transparent text-primary',
					'hover:bg-primary/10 hover:border-primary hover:-translate-y-px',
					'active:translate-y-0',
					'shadow-[0_1px_8px] shadow-primary/10'
				]
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 gap-1.5 rounded-md px-3 text-xs has-[>svg]:px-2.5',
				lg: 'h-11 rounded-md px-7 text-base has-[>svg]:px-5',
				xl: 'h-12 rounded-lg px-8 text-base has-[>svg]:px-6',
				icon: 'size-9',
				'icon-sm': 'size-8',
				'icon-lg': 'size-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
