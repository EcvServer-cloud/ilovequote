<script>
	import { makeConcepto, sumConceptos, formatCurrency } from '$lib/docs/shared/schema.js';

	// `flow` is the store returned by createDocFlow(). We bind directly to
	// $flow[field][i].* in the markup (never to a local alias) so Svelte's
	// store-assignment compilation keeps drafts/persistence/totals in sync —
	// same pattern used for cotización's items (see QuoteItem.svelte notes).
	export let flow;
	export let field; // e.g. 'percepciones' | 'deducciones'
	export let placeholder = 'Concepto';
	export let addLabel = '+ Agregar concepto';
	export let totalLabel = 'Total';
	export let defaultTipo = '';

	$: items = $flow[field] ?? [];

	function add() {
		flow.addToList(field, () => makeConcepto({ tipo: defaultTipo }));
	}
	function remove(id) {
		flow.removeFromList(field, id);
	}
</script>

<div class="flex flex-col gap-3">
	{#each items as item, i (item.id)}
		<div class="card animate-fade-up !p-4">
			<div class="flex items-start gap-3">
				<input
					class="field-input !py-2 font-medium"
					{placeholder}
					bind:value={$flow[field][i].nombre}
				/>
				{#if items.length > 1}
					<button
						class="mt-1 shrink-0 text-lg leading-none text-muted transition hover:text-heart"
						aria-label="Eliminar concepto"
						on:click={() => remove(item.id)}
					>
						✕
					</button>
				{/if}
			</div>
			<div class="mt-3">
				<label class="field-label text-xs" for="monto-{item.id}">Monto</label>
				<input
					id="monto-{item.id}"
					class="field-input !py-2"
					type="number"
					min="0"
					step="0.01"
					bind:value={$flow[field][i].monto}
				/>
			</div>
		</div>
	{/each}

	<button class="btn-secondary w-full" on:click={add}>{addLabel}</button>

	<div class="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
		<span class="text-sm font-medium text-muted">{totalLabel}</span>
		<span class="font-display text-lg font-bold text-ink">{formatCurrency(sumConceptos(items))}</span>
	</div>
</div>
