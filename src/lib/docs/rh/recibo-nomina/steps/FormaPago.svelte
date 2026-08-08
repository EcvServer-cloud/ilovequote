<script>
	import { nominaFlow, STEPS } from '$lib/docs/rh/recibo-nomina/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';
	import { sumConceptos, formatCurrency } from '$lib/docs/shared/schema.js';

	const opciones = ['Transferencia', 'Efectivo', 'Cheque', 'Depósito', 'Otro'];

	$: neto =
		sumConceptos($nominaFlow.percepciones) -
		sumConceptos($nominaFlow.deducciones) -
		(Number($nominaFlow.retenciones) || 0);
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$nominaFlow.screen}
	title="Forma de pago"
	subtitle="¿Cómo se realizó el pago?"
	canContinue={true}
	onContinue={() => nominaFlow.next()}
	onBack={() => nominaFlow.back()}
>
	<div class="mb-5 flex items-center justify-between rounded-xl bg-surface px-4 py-3">
		<span class="text-sm font-medium text-muted">Neto a pagar</span>
		<span class="font-display text-lg font-bold text-ink">{formatCurrency(neto)}</span>
	</div>

	<div class="flex flex-col gap-3">
		{#each opciones as op}
			<label class="card flex items-center gap-3 !p-4">
				<input type="radio" class="h-4 w-4 accent-heart" value={op} bind:group={$nominaFlow.formaPago} />
				<span class="text-sm font-medium text-ink">{op}</span>
			</label>
		{/each}
	</div>

	<div class="mt-5">
		<Input label="Notas" type="textarea" bind:value={$nominaFlow.notas} placeholder="Opcional" />
	</div>
</StepShell>
