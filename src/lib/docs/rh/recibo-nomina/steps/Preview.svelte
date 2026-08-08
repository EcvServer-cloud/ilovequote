<script>
	import { nominaFlow, STEPS } from '$lib/docs/rh/recibo-nomina/flow.js';
	import { generateNominaFolio } from '$lib/docs/rh/recibo-nomina/template.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import NominaPreview from '$lib/docs/rh/recibo-nomina/NominaPreview.svelte';

	function generate() {
		nominaFlow.update((s) => ({
			...s,
			// El folio ahora se arma con el RFC del trabajador (no del patrón).
			folio: generateNominaFolio(s.trabajador, new Date()),
			generatedAt: new Date().toISOString(),
			screen: 'generado'
		}));
	}
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$nominaFlow.screen}
	title="Vista previa"
	subtitle="Así se verá tu comprobante de pago."
	canContinue={true}
	continueLabel="Generar comprobante"
	onContinue={generate}
	onBack={() => nominaFlow.back()}
>
	<NominaPreview state={$nominaFlow} />
</StepShell>
