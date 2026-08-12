<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { constanciaFlow, STEPS } from '$lib/docs/rh/constancia-laboral/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';
	import ImageUploadField from '$lib/docs/shared/components/ImageUploadField.svelte';

	$: canContinue = $constanciaFlow.empresa.nombre.trim().length > 0;
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$constanciaFlow.screen}
	title="Datos de la empresa"
	subtitle="La empresa que expide la constancia."
	{canContinue}
	onContinue={() => constanciaFlow.next()}
	onBack={() => goto(`${base}/docs/rh`)}
>
	<div class="mb-5">
		<ImageUploadField bind:value={$constanciaFlow.empresa.logo} label="Logo" />
	</div>

	<div class="flex flex-col gap-4">
		<Input label="Nombre / razón social" bind:value={$constanciaFlow.empresa.nombre} placeholder="Ej. Yo Amo Cotizar SA de CV" required />
		<Input label="RFC" bind:value={$constanciaFlow.empresa.rfc} placeholder="Opcional" />
		<Input label="Dirección" bind:value={$constanciaFlow.empresa.domicilio} placeholder="Opcional" />
		<Input label="Teléfono" type="tel" bind:value={$constanciaFlow.empresa.telefono} placeholder="Opcional" />
		<Input label="Correo" type="email" bind:value={$constanciaFlow.empresa.correo} placeholder="Opcional" />
		<Input
			label="Ciudad, Estado"
			bind:value={$constanciaFlow.empresa.lugar}
			placeholder="Ej. Reynosa, Tamaulipas"
			hint="Se usa para la línea de lugar y fecha de expedición. Si lo dejas vacío, solo se muestra la fecha."
		/>
	</div>
</StepShell>
