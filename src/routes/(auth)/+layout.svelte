<script lang="ts">
    import Typewriter from '$lib/components/shared/typewriter.svelte';
    import { fade } from 'svelte/transition';

    const { children } = $props();

    const brandingTexts = [
        "Secure your game assets.",
        "Hire vetted developers.",
        "Trade with 0% risk.",
        "Build your Roblox empire."
    ];
</script>

<div class="grid min-h-svh lg:grid-cols-2 bg-background">
    <div class="flex flex-col gap-4 p-3 md:p-5">
        <div class="flex justify-center gap-2 md:justify-start">
            <a href="/" class="group flex items-center gap-2 font-medium transition-transform hover:scale-105">
                <img src="/icons/logo.svg" alt="logo" width={40} height={40} class="drop-shadow-sm" />
                <span class="text-primary font-black text-2xl tracking-tighter">Rodevsy</span>
            </a>
        </div>
        
        <div class="flex flex-1 items-center justify-center">
            <div class="w-full max-w-sm" in:fade={{ duration: 400, delay: 200 }}>
                {@render children?.()}
            </div>
        </div>

        <p class="text-center text-xs text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} RoDevsy. The Gold Standard for Roblox Freelancing.
        </p>
    </div>

    <div class="relative hidden lg:flex flex-col items-center justify-center overflow-hidden px-12">
        <div class="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.07)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.07)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div class="absolute -top-[25%] -left-[25%] h-[150%] w-[150%] animate-[pulse_8s_infinite] bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_50%)] from-primary/10 via-transparent to-transparent"></div>

        <div class="relative z-10 w-full max-w-lg space-y-6">
            <div class="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-md">
                <span class="mr-2 flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                Live Marketplace
            </div>

            <h2 class="text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl">
                The Professional <br />
                <span class="text-primary italic">Standard.</span>
            </h2>

            <div class="text-xl text-muted-foreground font-medium min-h-[1.5em]">
                <Typewriter texts={brandingTexts} waitTime={4000} speed={40} />
            </div>

            <div class="mt-12 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-xl shadow-2xl">
                <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg class="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
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
