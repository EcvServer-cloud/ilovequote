<script>
	import { nominaFlow, STEPS } from '$lib/docs/rh/recibo-nomina/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$nominaFlow.screen}
	title="Firmas"
	subtitle="¿Quieres incluir espacio para firmas en el PDF?"
	canContinue={true}
	onContinue={() => nominaFlow.next()}
	onBack={() => nominaFlow.back()}
>
	<label class="card flex items-center justify-between !p-4">
		<span class="text-sm font-medium text-ink">Incluir firma del patrón y del trabajador</span>
		<input type="checkbox" class="h-5 w-5 accent-heart" bind:checked={$nominaFlow.firmas.incluir} />
	</label>
</StepShell>
