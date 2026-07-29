<script>
	import { quote, STEPS } from '$lib/stores/quote.js';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
	import QuoteItem from '$lib/components/QuoteItem.svelte';
	import { subtotalOf, formatCurrency } from '$lib/utils/calculations.js';

	$: items = $quote.items;
	$: subtotal = subtotalOf(items);
	$: canContinue = items.some((it) => it.description.trim().length > 0);
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-8">
	<ProgressIndicator steps={STEPS.slice(1, -1)} current={$quote.screen} />

	<div class="mt-6 animate-slide-in">
		<h1 class="font-display text-xl font-bold text-ink">Productos o servicios</h1>
		<p class="mt-1 text-sm text-muted">Agrega los conceptos que quieres cotizar.</p>

		<div class="mt-5 flex flex-col gap-3">
			{#each items as item, i (item.id)}
				<QuoteItem index={i} canDelete={items.length > 1} />
			{/each}
		</div>

		<button class="btn-secondary mt-3 w-full" on:click={() => quote.addItem()}>
			+ Agregar concepto
		</button>

		<div class="mt-5 flex items-center justify-between rounded-xl bg-surface px-4 py-3">
			<span class="text-sm font-medium text-muted">Subtotal</span>
			<span class="font-display text-lg font-bold text-ink">{formatCurrency(subtotal)}</span>
		</div>
	</div>

	<div class="mt-8 flex flex-col gap-3">
		<button class="btn-primary" disabled={!canContinue} on:click={() => quote.next()}>
			Continuar
		</button>
		<button class="btn-ghost mx-auto" on:click={() => quote.back()}>← Volver</button>
	</div>
</div>
