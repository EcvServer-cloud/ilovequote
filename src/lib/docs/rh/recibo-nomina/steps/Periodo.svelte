<script>
	import { nominaFlow, STEPS } from '$lib/docs/rh/recibo-nomina/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';

	const periodicidades = ['Semanal', 'Quincenal', 'Mensual', 'Otro'];
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$nominaFlow.screen}
	title="Periodo laboral"
	subtitle="¿Qué periodo cubre este pago?"
	canContinue={true}
	onContinue={() => nominaFlow.next()}
	onBack={() => nominaFlow.back()}
>
	<div class="flex flex-col gap-4">
		<div class="grid grid-cols-2 gap-3">
			<Input label="Fecha inicio" type="date" bind:value={$nominaFlow.periodo.fechaInicio} />
			<Input label="Fecha fin" type="date" bind:value={$nominaFlow.periodo.fechaFin} />
		</div>
		<Input label="Fecha de pago" type="date" bind:value={$nominaFlow.periodo.fechaPago} />
		<div>
			<label class="field-label" for="periodicidad">Periodicidad</label>
			<select id="periodicidad" class="field-input" bind:value={$nominaFlow.periodo.periodicidad}>
				<option value="">Selecciona una opción</option>
				{#each periodicidades as p}
					<option value={p}>{p}</option>
				{/each}
			</select>
		</div>
	</div>
</StepShell>
