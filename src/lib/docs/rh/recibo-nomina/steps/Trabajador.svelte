<script>
	import { nominaFlow, STEPS } from '$lib/docs/rh/recibo-nomina/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';

	$: canContinue = $nominaFlow.trabajador.nombre.trim().length > 0;
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$nominaFlow.screen}
	title="Datos del trabajador"
	subtitle="¿A quién se le está pagando?"
	{canContinue}
	onContinue={() => nominaFlow.next()}
	onBack={() => nominaFlow.back()}
>
	<div class="flex flex-col gap-4">
		<Input label="Nombre completo" bind:value={$nominaFlow.trabajador.nombre} placeholder="Ej. Ana Torres" required />
		<Input label="Puesto" bind:value={$nominaFlow.trabajador.puesto} placeholder="Ej. Auxiliar administrativo" />
		<Input label="CURP" bind:value={$nominaFlow.trabajador.curp} placeholder="Opcional" />
		<Input label="RFC" bind:value={$nominaFlow.trabajador.rfc} placeholder="Opcional" />
		<Input label="NSS" bind:value={$nominaFlow.trabajador.nss} placeholder="Opcional" />
	</div>
</StepShell>
