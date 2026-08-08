<script>
	import { nominaFlow, STEPS } from '$lib/docs/rh/recibo-nomina/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import ConceptListEditor from '$lib/docs/shared/components/ConceptListEditor.svelte';
	import Input from '$lib/components/Input.svelte';
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$nominaFlow.screen}
	title="Deducciones"
	subtitle="ISR, IMSS, anticipos... Déjalo vacío si no aplica."
	canContinue={true}
	onContinue={() => nominaFlow.next()}
	onBack={() => nominaFlow.back()}
>
	<ConceptListEditor
		flow={nominaFlow}
		field="deducciones"
		placeholder="Ej. ISR, IMSS, Anticipo"
		addLabel="+ Agregar deducción"
		totalLabel="Total deducciones"
		defaultTipo="deduccion"
	/>

	<div class="mt-5">
		<Input
			label="Retenciones"
			type="number"
			min="0"
			step="0.01"
			bind:value={$nominaFlow.retenciones}
			hint="Monto adicional a las deducciones de arriba (opcional). Aparece por separado en el resumen del PDF."
		/>
	</div>
</StepShell>
