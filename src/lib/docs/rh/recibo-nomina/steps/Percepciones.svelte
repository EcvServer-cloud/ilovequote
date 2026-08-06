<script>
	import { nominaFlow, STEPS } from '$lib/docs/rh/recibo-nomina/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import ConceptListEditor from '$lib/docs/shared/components/ConceptListEditor.svelte';

	$: canContinue = $nominaFlow.percepciones.some((c) => c.nombre.trim().length > 0);
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$nominaFlow.screen}
	title="Percepciones"
	subtitle="Salario, horas extra, bonos, prestaciones..."
	{canContinue}
	onContinue={() => nominaFlow.next()}
	onBack={() => nominaFlow.back()}
>
	<ConceptListEditor
		flow={nominaFlow}
		field="percepciones"
		placeholder="Ej. Salario, Bono, Horas extra"
		addLabel="+ Agregar percepción"
		totalLabel="Total percepciones"
		defaultTipo="percepcion"
	/>
</StepShell>
