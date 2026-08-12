<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { constanciaFlow } from '$lib/docs/rh/constancia-laboral/flow.js';
	import ResumeDraftModal from '$lib/components/ResumeDraftModal.svelte';

	import Empresa from '$lib/docs/rh/constancia-laboral/steps/Empresa.svelte';
	import Trabajador from '$lib/docs/rh/constancia-laboral/steps/Trabajador.svelte';
	import RelacionLaboral from '$lib/docs/rh/constancia-laboral/steps/RelacionLaboral.svelte';
	import Salario from '$lib/docs/rh/constancia-laboral/steps/Salario.svelte';
	import Destinatario from '$lib/docs/rh/constancia-laboral/steps/Destinatario.svelte';
	import Firmante from '$lib/docs/rh/constancia-laboral/steps/Firmante.svelte';
	import Preview from '$lib/docs/rh/constancia-laboral/steps/Preview.svelte';
	import Generado from '$lib/docs/rh/constancia-laboral/steps/Generado.svelte';

	const screens = {
		empresa: Empresa,
		trabajador: Trabajador,
		relacion: RelacionLaboral,
		salario: Salario,
		destinatario: Destinatario,
		firmante: Firmante,
		preview: Preview,
		generado: Generado
	};

	const { draftAvailable, draftChecked } = constanciaFlow;

	onMount(() => {
		constanciaFlow.checkForDraft();
		constanciaFlow.startPersisting();
	});
</script>

<svelte:head>
	<title>Constancia laboral — Documentos</title>
</svelte:head>

{#if $draftChecked && $draftAvailable}
	<div transition:fade={{ duration: 150 }}>
		<ResumeDraftModal
			on:resume={() => constanciaFlow.resumeDraft()}
			on:discard={() => constanciaFlow.discardDraft()}
		/>
	</div>
{/if}

{#key $constanciaFlow.screen}
	<div in:fade={{ duration: 200 }}>
		<svelte:component this={screens[$constanciaFlow.screen]} />
	</div>
{/key}
