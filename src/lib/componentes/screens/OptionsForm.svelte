<script>
	import { quote, STEPS } from '$lib/stores/quote.js';
	import Input from '$lib/components/Input.svelte';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';

	$: isDetailed = $quote.type === 'detailed';
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-8">
	<ProgressIndicator steps={STEPS.slice(1, -1)} current={$quote.screen} />

	<div class="mt-6 animate-slide-in">
		<h1 class="font-display text-xl font-bold text-ink">Opciones de la cotización</h1>
		<p class="mt-1 text-sm text-muted">Todo aquí es opcional.</p>

		<div class="mt-6 flex flex-col gap-5">
			<Input label="Vigencia" bind:value={$quote.meta.validity} placeholder="Ej. 15 días" />

			<div class="card !p-4">
				<label class="flex items-center justify-between gap-3">
					<span class="text-sm font-medium text-ink">Aplicar impuestos</span>
					<input type="checkbox" class="h-5 w-5 accent-heart" bind:checked={$quote.tax.enabled} />
				</label>
				{#if $quote.tax.enabled}
					<div class="mt-3">
						<Input label="Tasa (%)" type="number" min="0" bind:value={$quote.tax.rate} />
					</div>
				{/if}
			</div>

			{#if isDetailed}
				<div class="card !p-4">
					<label class="flex items-center justify-between gap-3">
						<span class="text-sm font-medium text-ink">Aplicar descuento</span>
						<input type="checkbox" class="h-5 w-5 accent-heart" bind:checked={$quote.discount.enabled} />
					</label>
					{#if $quote.discount.enabled}
						<div class="mt-3 grid grid-cols-2 gap-3">
							<div>
								<label class="field-label text-xs" for="discount-type">Tipo</label>
								<select id="discount-type" class="field-input !py-2" bind:value={$quote.discount.type}>
									<option value="percent">Porcentaje</option>
									<option value="amount">Monto fijo</option>
								</select>
							</div>
							<Input label={$quote.discount.type === 'percent' ? 'Descuento (%)' : 'Descuento ($)'} type="number" min="0" bind:value={$quote.discount.value} />
						</div>
					{/if}
				</div>

				<Input label="Forma de pago" bind:value={$quote.meta.paymentMethod} placeholder="Ej. Transferencia, efectivo" />
				<Input label="Anticipo" bind:value={$quote.meta.deposit} placeholder="Ej. 50% al confirmar" />
				<Input label="Tiempo de entrega" bind:value={$quote.meta.deliveryTime} placeholder="Ej. 10 días hábiles" />
				<Input label="Condiciones" type="textarea" bind:value={$quote.meta.conditions} placeholder="Opcional" />
				<Input label="Términos y condiciones" type="textarea" bind:value={$quote.meta.terms} placeholder="Opcional" />
				<Input label="Datos bancarios" type="textarea" bind:value={$quote.meta.bankDetails} placeholder="Opcional" />

				<label class="card flex items-center justify-between !p-4">
					<span class="text-sm font-medium text-ink">Incluir espacio para firma</span>
					<input type="checkbox" class="h-5 w-5 accent-heart" bind:checked={$quote.meta.hasSignature} />
				</label>
			{/if}

			<Input label="Notas" type="textarea" bind:value={$quote.meta.notes} placeholder="Opcional" />
		</div>
	</div>

	<div class="mt-8 flex flex-col gap-3">
		<button class="btn-primary" on:click={() => quote.next()}>Continuar</button>
		<button class="btn-ghost mx-auto" on:click={() => quote.back()}>← Volver</button>
	</div>
</div>
