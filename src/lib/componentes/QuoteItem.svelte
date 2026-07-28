<script>
	import { itemTotal, formatCurrency } from '$lib/utils/calculations.js';
	import { quote } from '$lib/stores/quote.js';

	// We bind directly to $quote.items[index].* in the markup (not to a local
	// alias) so Svelte's store-assignment magic keeps localStorage persistence
	// and every other reactive computation ($ totals, preview, etc.) in sync.
	export let index;
	export let canDelete = true;

	$: item = $quote.items[index];
</script>

<div class="card animate-fade-up !p-4">
	<div class="flex items-start justify-between gap-3">
		<input
			class="field-input !py-2 font-medium"
			placeholder="Descripción (ej. Diseño de página web)"
			bind:value={$quote.items[index].description}
		/>
		{#if canDelete}
			<button
				class="mt-1 shrink-0 text-lg leading-none text-muted transition hover:text-heart"
				aria-label="Eliminar concepto"
				on:click={() => quote.removeItem(item.id)}
			>
				✕
			</button>
		{/if}
	</div>

	<div class="mt-3 grid grid-cols-2 gap-3">
		<div>
			<label class="field-label text-xs">Cantidad</label>
			<input class="field-input !py-2" type="number" min="0" step="1" bind:value={$quote.items[index].qty} />
		</div>
		<div>
			<label class="field-label text-xs">Precio unitario</label>
			<input class="field-input !py-2" type="number" min="0" step="0.01" bind:value={$quote.items[index].price} />
		</div>
	</div>

	<p class="mt-3 text-right text-sm font-semibold text-ink">
		{formatCurrency(itemTotal(item))}
	</p>
</div>
