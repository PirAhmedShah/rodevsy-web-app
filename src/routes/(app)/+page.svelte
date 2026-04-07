<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Typewriter from '$lib/components/shared/typewriter.svelte';

	import {
		Briefcase,
		ShieldCheck,
		Zap,
		ChevronRight,
		CircleCheck,
		Lock,
		Coins,
		CircleX,
		MessageSquare,
		Code,
		Users,
		LayoutGrid,
		Hammer,
		Scale,
		Star,
		HelpCircle
	} from '@lucide/svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { resolve } from '$app/paths';

	const isMobile = new IsMobile();

	const typewriterTexts = [
		'Robux Earnings',
		'Development Time',
		'Game Assets',
		'Studio Reputation',
		'Hard Work'
	];

	const platformStats = [
		{ label: 'Registered Users', value: '1' },
		{ label: 'Projects Secured', value: '$0' },
		{ label: 'Assets Listed', value: '0' },
		{ label: 'Dispute Rate', value: '0%' }
	];

	const ecosystemFeatures = [
		{
			icon: Briefcase,
			title: 'Projects',
			desc: 'Post your game requirements. Developers bid, you select the best fit, and we secure the funds until completion.',
			href: '/projects/',
			linkText: 'Post a Project'
		},
		{
			icon: Users,
			title: 'Talent Directory',
			desc: 'Browse vetted profiles of scripters, builders, and UI designers. Check their real completion rate and verified reviews.',
			href: '/talent/',
			linkText: 'Hire Developers'
		},
		{
			icon: LayoutGrid,
			title: 'Marketplace',
			desc: 'Buy and sell ready-made scripts, maps, and models instantly. Auto-delivery using your in-platform Credits.',
			href: '/marketplace/',
			linkText: 'Browse Assets'
		},
		{
			icon: MessageSquare,
			title: 'Community Forum',
			desc: "Engage in discussions, ask technical questions, share dev-logs, and build your studio's reputation publicly.",
			href: '/forum/',
			linkText: 'Join Discussion'
		}
	] as const;

	const discordCons = [
		'Paying 50% upfront to a stranger',
		'Developers ghosting after receiving files',
		'Chargebacks on PayPal weeks later',
		'No moderation or dispute resolution',
		'Fake portfolios and stolen assets'
	];

	const rodevsyPros = [
		'Funds locked in Smart Escrow safely',
		'Milestone-based automated payouts',
		'Irreversible internal Credit Ledger',
		'Fair Mediation & Dispute Resolution Team',
		'Verified Robux/DevEx Portfolios'
	];

	const howItWorksSteps = [
		{
			step: '01',
			title: 'Agree on Terms',
			desc: 'Client and developer define milestones, deliverables, and price.'
		},
		{
			step: '02',
			title: 'Funds Escrowed',
			desc: 'Client deposits credits. Funds are locked securely in our smart contract.'
		},
		{
			step: '03',
			title: 'Build & Deliver',
			desc: 'Developer completes the work and submits assets through our secure portal.'
		},
		{
			step: '04',
			title: 'Instant Payout',
			desc: 'Client approves the work, and funds are instantly released to the developer.'
		}
	];

	const testimonials = [
		{
			name: 'KyroDev',
			role: 'Lead Scripter',
			quote:
				"I used to lose 20% of my income to chargebacks and scammers. Since moving my commissions here, I haven't lost a single cent."
		},
		{
			name: 'BloxStudio',
			role: 'Game Studio',
			quote:
				'Hiring is finally stress-free. Seeing verified completion rates before I hire a builder has saved us thousands of dollars.'
		},
		{
			name: 'SarahUGC',
			role: '3D Modeler',
			quote:
				'The marketplace auto-delivery is flawless. I upload my assets once and wake up to credits in my ledger every morning.'
		}
	];

	const faqs = [
		{
			q: 'What are the platform fees?',
			a: 'We charge a flat 5% fee on completed projects and marketplace sales to maintain our escrow infrastructure and moderation team.'
		},
		{
			q: 'How do I withdraw my credits?',
			a: 'Credits can be withdrawn to Crypto (USDT/USDC) or converted directly to Robux via our verified DevEx partners.'
		},
		{
			q: 'What happens if there is a dispute?',
			a: 'Funds are frozen. Our trained arbitration team reviews the integrated chat logs and asset deliveries to make a fair, binding ruling.'
		},
		{
			q: 'Do I need an ID to join?',
			a: 'Basic browsing is free. To withdraw funds or accept high-value projects, standard KYC verification is required to prevent fraud.'
		}
	];
</script>

{#snippet checkItem(text: string, isNegative: boolean = false)}
	<li class="flex items-start gap-3 text-sm font-medium text-muted-foreground sm:text-base">
		{#if isNegative}
			<CircleX class="mt-0.5 size-5 shrink-0 text-destructive/80" />
		{:else}
			<CircleCheck class="mt-0.5 size-5 shrink-0 text-primary" />
		{/if}
		<span>{text}</span>
	</li>
{/snippet}

<main class="min-h-screen w-full bg-background text-foreground selection:bg-primary/30">
	<section class="relative flex min-h-[90vh] items-center pt-20 pb-16">
		<div
			class="absolute inset-0 z-0 animate-pulse bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] duration-5000"
		></div>
		<div
			class="absolute inset-x-0 top-0 -z-10 mx-auto size-125 rounded-full bg-primary/20 opacity-50 blur-[100px]"
		></div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
				<div class="flex-1 space-y-8 text-center lg:text-left">
					<div
						class="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/5 py-1 pr-4 pl-2 text-sm font-medium text-destructive backdrop-blur-sm"
					>
						<span
							class="mr-3 flex size-6 items-center justify-center rounded-full bg-destructive/20"
						>
							<Hammer class="size-3.5" />
						</span>
						Platform under Development
					</div>

					<h1 class="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
						Stop Risking Your <br class="hidden lg:block" />
						<span class="mt-2 block min-h-[1.2em] text-primary">
							<Typewriter texts={typewriterTexts} waitTime={3000} />
						</span>
					</h1>

					<p
						class="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0"
					>
						Join the first ecosystem for Roblox. Post projects, hire verified talent, trade assets,
						and collaborate securely.
					</p>

					<div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
						<Button
							href={resolve('/signup/')}
							size="lg"
							class="h-14 w-full px-8 text-base shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] sm:w-auto"
						>
							Start Earning Safely
						</Button>
						<Button
							href={resolve('/marketplace/')}
							variant="secondary"
							size="lg"
							class="h-14 w-full px-8 text-base sm:w-auto"
						>
							Explore Marketplace
						</Button>
					</div>
				</div>

				{#if !isMobile.current}
					<div class="relative mt-16 w-full max-w-lg flex-1 lg:mt-0">
						<div class="relative mx-auto aspect-square w-full sm:w-112.5">
							<div class="absolute inset-10 rounded-full bg-primary/20 blur-[80px]"></div>
							<div
								class="absolute inset-0 animate-[spin_60s_linear_infinite] rounded-full border border-dashed border-primary/30"
							></div>
							<div
								class="absolute inset-8 animate-[spin_40s_linear_infinite_reverse] rounded-full border-2 border-dotted border-muted-foreground/30"
							></div>
							<div
								class="absolute inset-16 animate-[pulse_4s_ease-in-out_infinite] rounded-full border border-primary/20 bg-primary/5"
							></div>

							<div
								class="absolute inset-0 z-20 m-auto flex size-48 flex-col items-center justify-center overflow-hidden rounded-full border border-primary/40 bg-card/80 shadow-[0_0_60px_-15px_rgba(var(--primary),0.5)] backdrop-blur-xl"
							>
								<div class="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent"></div>
								<div class="relative z-10 flex flex-col items-center">
									<Lock
										class="mb-3 size-14 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]"
									/>
									<span
										class="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
										>Network</span
									>
									<span class="font-mono text-xl font-extrabold text-foreground">Secured</span>
								</div>
								<div
									class="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),1)]"
								></div>
							</div>

							<div
								class="absolute top-12 -right-2 z-30 animate-[bounce_5s_infinite] cursor-default rounded-2xl border border-border/50 bg-card/95 p-4 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105 sm:-right-8"
							>
								<div class="flex items-center gap-4">
									<div
										class="flex size-10 shrink-0 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10"
									>
										<CircleCheck class="size-5 text-green-500" />
									</div>
									<div>
										<p class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
											Milestone 1
										</p>
										<p class="text-sm font-bold text-foreground">Funds Released</p>
									</div>
								</div>
							</div>

							<div
								class="absolute bottom-20 -left-2 z-30 animate-[bounce_6s_infinite] cursor-default rounded-2xl border border-border/50 bg-card/95 p-4 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105 sm:-left-8"
							>
								<div class="flex items-center gap-4">
									<div
										class="flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10"
									>
										<Coins class="size-5 text-amber-500" />
									</div>
									<div>
										<p class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
											USDT Deposit
										</p>
										<p class="text-sm font-bold text-foreground">+500 Credits</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<section class="border-y border-border bg-muted/30 py-8 backdrop-blur-sm">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-2 gap-8 divide-x divide-border/50 md:grid-cols-4">
				{#each platformStats as stat, i (i)}
					<div class="flex flex-col items-center justify-center px-4 text-center">
						<span class="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
						<span class="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-background py-24">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mb-16 max-w-3xl">
				<h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
					The Complete Developer Ecosystem
				</h2>
				<p class="text-lg text-muted-foreground">
					Everything you need to build, hire, and sell in the Roblox ecosystem, all under one highly
					secured roof.
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each ecosystemFeatures as feature, i (i)}
					<div
						class="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
					>
						<div
							class="absolute -top-12 -right-12 z-0 size-32 rounded-full bg-primary/5 blur-3xl transition-colors group-hover:bg-primary/10"
						></div>
						<div class="relative z-10">
							<div
								class="mb-6 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
							>
								<feature.icon class="size-7" />
							</div>
							<h3 class="mb-3 text-2xl font-bold tracking-tight">{feature.title}</h3>
							<p class="mb-8 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
						</div>
						<a
							href={resolve(feature.href)}
							class="relative z-10 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
						>
							{feature.linkText}
							<ChevronRight class="ml-1 size-4 transition-transform group-hover:translate-x-1" />
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-muted/10 py-24">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">How RoDevsy Escrow Works</h2>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Four simple steps to guarantee you get what you paid for, or get paid for what you built.
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				{#each howItWorksSteps as step (step.step)}
					<div class="relative rounded-2xl border border-border bg-background p-8 shadow-sm">
						<span class="absolute -top-5 -right-2 text-6xl font-black text-muted/30"
							>{step.step}</span
						>
						<h3 class="mb-3 text-xl font-bold text-foreground">{step.title}</h3>
						<p class="text-sm text-muted-foreground">{step.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-muted/20 py-24">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
					Why Move Away from Discord?
				</h2>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Unregulated platforms cost developers and clients thousands of dollars every week. See the
					difference.
				</p>
			</div>

			<div
				class="mx-auto max-w-5xl overflow-hidden rounded-4xl border border-border bg-background shadow-2xl"
			>
				<div class="grid grid-cols-1 md:grid-cols-2">
					<div
						class="border-b border-border bg-linear-to-b from-destructive/5 to-transparent p-10 sm:p-14 md:border-r md:border-b-0"
					>
						<div
							class="mb-8 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
						>
							<Zap class="size-6 rotate-180" />
						</div>
						<h3 class="mb-6 text-2xl font-bold text-foreground">The "Discord" Way</h3>
						<ul class="space-y-5">
							{#each discordCons as con, i (i)}
								{@render checkItem(con, true)}
							{/each}
						</ul>
					</div>

					<div class="relative bg-linear-to-b from-primary/5 to-transparent p-10 sm:p-14">
						<ShieldCheck class="absolute top-6 right-6 size-32 opacity-10" />
						<div
							class="mb-8 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
						>
							<ShieldCheck class="size-6" />
						</div>
						<h3 class="mb-6 text-2xl font-bold text-foreground">The RoDevsy Way</h3>
						<ul class="space-y-5">
							{#each rodevsyPros as pro, i (i)}
								{@render checkItem(pro)}
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-background py-24">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
				<div class="space-y-8">
					<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
						Institutional-Grade Security for Independent Devs
					</h2>
					<p class="text-lg text-muted-foreground">
						We treat your project funds with the same security as a modern fintech application.
						Built on a strictly appended transaction log.
					</p>

					<div class="space-y-6 pt-4">
						<div class="flex gap-4">
							<div
								class="mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
							>
								<Code class="size-5" />
							</div>
							<div>
								<h4 class="text-xl font-bold">Strict Escrow Protocol</h4>
								<p class="mt-2 text-muted-foreground">
									Balances are never directly modified. Every action creates an auditable receipt.
									"Check balance >= 0" database constraints prevent double-spending.
								</p>
							</div>
						</div>
						<div class="flex gap-4">
							<div
								class="mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
							>
								<Scale class="size-5" />
							</div>
							<div>
								<h4 class="text-xl font-bold">Fair Dispute Mediation</h4>
								<p class="mt-2 text-muted-foreground">
									If a project goes south, funds freeze. Our impartial arbitration team reviews the
									chat logs and asset deliveries to make a final, binding decision.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="relative flex justify-center lg:justify-end">
					<div class="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
						<div class="mb-4 flex items-center justify-between border-b border-border pb-4">
							<span class="font-semibold">Recent Ledger Activity</span>
							<span class="flex size-2 animate-pulse rounded-full bg-green-500"></span>
						</div>
						<div class="space-y-4 font-mono text-sm">
							<div class="flex items-center justify-between opacity-50">
								<span>Tx_992a • Deposit</span>
								<span class="text-green-500">+150.00 CRD</span>
							</div>
							<div class="flex items-center justify-between opacity-70">
								<span>Tx_992b • Escrow Lock</span>
								<span class="text-amber-500">-100.00 CRD</span>
							</div>
							<div class="flex items-center justify-between">
								<span>Tx_992c • Payout (Map Design)</span>
								<span class="text-green-500">+100.00 CRD</span>
							</div>
						</div>
						<Button variant="outline" class="mt-6 w-full">View Full Architecture</Button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="border-t border-border bg-muted/10 py-24">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Top Creators</h2>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Don't just take our word for it. Here is what the community is saying.
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-3">
				{#each testimonials as review, i (i)}
					<div class="rounded-2xl border border-border bg-background p-8 shadow-sm">
						<div class="mb-4 flex text-amber-500">
							{#each Array(5)}
								<Star class="size-4 fill-current" />
							{/each}
						</div>
						<p class="mb-6 text-sm text-muted-foreground italic">"{review.quote}"</p>
						<div>
							<p class="font-bold text-foreground">{review.name}</p>
							<p class="text-xs text-muted-foreground">{review.role}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-background py-24">
		<div class="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
			<div class="mb-12 flex flex-col items-center text-center">
				<HelpCircle class="mb-4 size-10 text-primary" />
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				{#each faqs as faq, i (i)}
					<div class="rounded-xl border border-border bg-muted/20 p-6">
						<h4 class="mb-2 font-bold text-foreground">{faq.q}</h4>
						<p class="text-sm text-muted-foreground">{faq.a}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="relative flex h-dvh items-center bg-primary">
		<div class="absolute inset-0 bg-[url('/images/cubes.png')] opacity-25 dark:invert"></div>
		<div class="relative z-10 container mx-auto px-4 text-center sm:px-6 lg:px-8">
			<h2 class="mb-6 text-3xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
				Ready to professionalize your studio?
			</h2>
			<p class="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80">
				Join thousands of Roblox creators who have stopped relying on trust and started relying on
				RoDevsy's escrow infrastructure.
			</p>

			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button
					href={resolve('/signup/')}
					size="lg"
					class="h-14 bg-primary-foreground px-8 text-lg font-semibold text-primary hover:bg-primary-foreground/70"
				>
					Create Free Account
				</Button>
				<Button
					href={resolve('/docs/')}
					size="lg"
					class="h-14 border-transparent px-8 text-lg font-semibold text-primary-foreground hover:bg-transparent hover:text-primary-foreground/70"
				>
					Read Documentation
				</Button>
			</div>
		</div>
	</section>
</main>
