<script>
	import { constanciaFlow, STEPS } from '$lib/docs/rh/constancia-laboral/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';

	const tiposContrato = ['Indefinido', 'Temporal', 'Por tiempo determinado', 'Por obra determinada', 'Otro', 'No especificar'];

	$: r = $constanciaFlow.relacion;
	$: canContinue = r.fechaIngreso.trim().length > 0 && (r.estado === 'activo' || (r.estado === 'terminado' && r.fechaTermino.trim().length > 0));
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$constanciaFlow.screen}
	title="Relación laboral"
	subtitle="Ingreso, estado actual y tipo de contrato."
	{canContinue}
	onContinue={() => constanciaFlow.next()}
	onBack={() => constanciaFlow.back()}
>
	<div class="flex flex-col gap-4">
		<Input label="Fecha de ingreso" type="date" bind:value={$constanciaFlow.relacion.fechaIngreso} required />

		<div>
			<p class="field-label">¿Actualmente labora en la empresa?</p>
			<div class="flex gap-3">
				<label class="card flex flex-1 items-center gap-2 !p-3">
					<input type="radio" class="h-4 w-4 accent-heart" value="activo" bind:group={$constanciaFlow.relacion.estado} />
					<span class="text-sm font-medium text-ink">Sí, actualmente labora</span>
				</label>
				<label class="card flex flex-1 items-center gap-2 !p-3">
					<input type="radio" class="h-4 w-4 accent-heart" value="terminado" bind:group={$constanciaFlow.relacion.estado} />
					<span class="text-sm font-medium text-ink">Ya no labora</span>
				</label>
			</div>
		</div>

		{#if $constanciaFlow.relacion.estado === 'terminado'}
			<Input label="Fecha de término" type="date" bind:value={$constanciaFlow.relacion.fechaTermino} required />
		{/if}

		<div>
			<label class="field-label" for="tipo-contrato">Tipo de contrato</label>
			<select id="tipo-contrato" class="field-input" bind:value={$constanciaFlow.relacion.tipoContrato}>
				<option value="">Selecciona una opción</option>
				{#each tiposContrato as t}
					<option value={t}>{t}</option>
				{/each}
			</select>
		</div>

		{#if $constanciaFlow.relacion.tipoContrato === 'Otro'}
			<Input label="Especifica el tipo de contrato" bind:value={$constanciaFlow.relacion.tipoContratoOtro} />
		{/if}
	</div>
</StepShell>
