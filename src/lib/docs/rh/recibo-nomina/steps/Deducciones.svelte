<script>
	import { nominaFlow, STEPS } from '$lib/docs/rh/recibo-nomina/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import ConceptListEditor from '$lib/docs/shared/components/ConceptListEditor.svelte';
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
</StepShell>
