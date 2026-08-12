<script>
	import { constanciaFlow, STEPS } from '$lib/docs/rh/constancia-laboral/flow.js';
	import { generateConstanciaFolio } from '$lib/docs/rh/constancia-laboral/template.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import ConstanciaPreview from '$lib/docs/rh/constancia-laboral/ConstanciaPreview.svelte';

	function generate() {
		constanciaFlow.update((s) => ({
			...s,
			folio: generateConstanciaFolio(new Date()),
			generatedAt: new Date().toISOString(),
			screen: 'generado'
		}));
	}
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$constanciaFlow.screen}
	title="Vista previa"
	subtitle="Así se verá tu constancia laboral."
	canContinue={true}
	continueLabel="Generar constancia"
	onContinue={generate}
	onBack={() => constanciaFlow.back()}
>
	<ConstanciaPreview state={$constanciaFlow} />
</StepShell>
