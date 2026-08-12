<script>
	import { constanciaFlow, STEPS } from '$lib/docs/rh/constancia-laboral/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';
	import { amountToWords } from '$lib/docs/shared/numberToWords.js';

	const periodicidades = ['Diario', 'Semanal', 'Quincenal', 'Mensual', 'Otra'];

	$: s = $constanciaFlow.salario;
	$: canContinue = !s.incluir || (Number(s.monto) > 0 && s.periodicidad.trim().length > 0);
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$constanciaFlow.screen}
	title="Información salarial"
	subtitle="Completamente opcional."
	{canContinue}
	onContinue={() => constanciaFlow.next()}
	onBack={() => constanciaFlow.back()}
>
	<label class="card flex items-center justify-between !p-4">
		<span class="text-sm font-medium text-ink">¿Desea incluir información salarial?</span>
		<input type="checkbox" class="h-5 w-5 accent-heart" bind:checked={$constanciaFlow.salario.incluir} />
	</label>

	{#if $constanciaFlow.salario.incluir}
		<div class="mt-4 flex flex-col gap-4">
			<Input label="Salario" type="number" min="0" step="0.01" bind:value={$constanciaFlow.salario.monto} required />

			<div>
				<label class="field-label" for="periodicidad">Periodicidad</label>
				<select id="periodicidad" class="field-input" bind:value={$constanciaFlow.salario.periodicidad}>
					<option value="">Selecciona una opción</option>
					{#each periodicidades as p}
						<option value={p}>{p}</option>
					{/each}
				</select>
			</div>

			{#if $constanciaFlow.salario.periodicidad === 'Otra'}
				<Input label="Especifica la periodicidad" bind:value={$constanciaFlow.salario.periodicidadOtra} />
			{/if}

			{#if Number($constanciaFlow.salario.monto) > 0}
				<div class="rounded-xl bg-surface px-4 py-3 text-xs text-muted">
					<span class="font-medium text-ink">Con letra:</span>
					{amountToWords($constanciaFlow.salario.monto)}
				</div>
			{/if}
		</div>
	{/if}
</StepShell>
