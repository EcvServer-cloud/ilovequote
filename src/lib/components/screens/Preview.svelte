<script>
	import { quote, STEPS } from '$lib/stores/quote.js';
	import { generateFolio } from '$lib/utils/folio.js';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
	import QuotePreview from '$lib/components/QuotePreview.svelte';

	function generate() {
		quote.update((s) => ({
			...s,
			folio: generateFolio(s.business.name, new Date()),
			generatedAt: new Date().toISOString(),
			screen: 'generated'
		}));
	}
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-8">
	<ProgressIndicator steps={STEPS.slice(1, -1)} current={$quote.screen} />

	<div class="mt-6 animate-slide-in">
		<h1 class="font-display text-xl font-bold text-ink">Vista previa</h1>
		<p class="mt-1 text-sm text-muted">Así se verá tu cotización.</p>

		<div class="mt-5">
			<QuotePreview state={$quote} />
		</div>
	</div>

	<div class="mt-8 flex flex-col gap-3">
		<button class="btn-primary" on:click={generate}>Generar cotización</button>
		<button class="btn-ghost mx-auto" on:click={() => quote.back()}>← Volver a editar</button>
	</div>
</div>
