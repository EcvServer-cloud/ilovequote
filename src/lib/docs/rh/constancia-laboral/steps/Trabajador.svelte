<script>
	import { constanciaFlow, STEPS } from '$lib/docs/rh/constancia-laboral/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';

	$: t = $constanciaFlow.trabajador;
	$: canContinue = t.nombre.trim().length > 0 && t.puesto.trim().length > 0;
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$constanciaFlow.screen}
	title="Datos del trabajador"
	subtitle="¿A quién se le expide la constancia?"
	{canContinue}
	onContinue={() => constanciaFlow.next()}
	onBack={() => constanciaFlow.back()}
>
	<div class="flex flex-col gap-4">
		<Input label="Nombre completo" bind:value={$constanciaFlow.trabajador.nombre} placeholder="Ej. Ana Torres" required />
		<Input label="Puesto actual" bind:value={$constanciaFlow.trabajador.puesto} placeholder="Ej. Auxiliar administrativo" required />
		<Input label="Departamento / área" bind:value={$constanciaFlow.trabajador.departamento} placeholder="Opcional" />
		<Input label="Número de empleado" bind:value={$constanciaFlow.trabajador.numeroEmpleado} placeholder="Opcional" />
		<Input label="CURP" bind:value={$constanciaFlow.trabajador.curp} placeholder="Opcional" />
		<Input label="RFC" bind:value={$constanciaFlow.trabajador.rfc} placeholder="Opcional" />
	</div>
</StepShell>
