<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import {
		quote,
		draftAvailable,
		draftChecked,
		checkForDraft,
		resumeDraft,
		discardDraft,
		startPersisting
	} from '$lib/stores/quote.js';

	import ResumeDraftModal from '$lib/components/ResumeDraftModal.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import QuotePreview from '$lib/components/QuotePreview.svelte';

	import Home from '$lib/components/screens/Home.svelte';
	import QuoteType from '$lib/components/screens/QuoteType.svelte';
	import BusinessForm from '$lib/components/screens/BusinessForm.svelte';
	import ClientForm from '$lib/components/screens/ClientForm.svelte';
	import ItemsForm from '$lib/components/screens/ItemsForm.svelte';
	import OptionsForm from '$lib/components/screens/OptionsForm.svelte';
	import Preview from '$lib/components/screens/Preview.svelte';
	import Generated from '$lib/components/screens/Generated.svelte';

	const screens = {
		home: Home,
		quoteType: QuoteType,
		business: BusinessForm,
		client: ClientForm,
		items: ItemsForm,
		options: OptionsForm,
		preview: Preview,
		generated: Generated
	};

	// Screens where showing a live preview alongside the form makes sense on desktop.
	const splitViewScreens = new Set(['business', 'client', 'items', 'options']);

	onMount(() => {
		checkForDraft();
		startPersisting();
	});

	function onResume() {
		resumeDraft();
	}
	function onDiscard() {
		discardDraft();
	}

	$: showSplit = splitViewScreens.has($quote.screen);
</script>

<svelte:head>
	<title>iLoveQuote — Crea cotizaciones profesionales en minutos</title>
</svelte:head>

{#if $draftChecked && $draftAvailable}
	<div transition:fade={{ duration: 150 }}>
		<ResumeDraftModal on:resume={onResume} on:discard={onDiscard} />
	</div>
{/if}

{#if showSplit}
	<div class="mx-auto grid min-h-[100dvh] max-w-6xl grid-cols-1 lg:grid-cols-[1fr,420px]">
		<div>
			{#key $quote.screen}
				<div in:fly={{ x: 24, duration: 220 }}>
					<svelte:component this={screens[$quote.screen]} />
				</div>
			{/key}
		</div>
		<div class="hidden border-l border-border bg-surface px-8 py-10 lg:block">
			<div class="sticky top-10">
				<div class="mb-4 flex items-center justify-between">
					<Logo size="sm" />
					<span class="text-xs font-medium uppercase tracking-wide text-muted">Vista previa</span>
				</div>
				<QuotePreview state={$quote} />
			</div>
		</div>
	</div>
{:else}
	{#key $quote.screen}
		<div in:fade={{ duration: 200 }}>
			<svelte:component this={screens[$quote.screen]} />
		</div>
	{/key}
{/if}
