<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { nominaFlow } from '$lib/docs/rh/recibo-nomina/flow.js';
	import ResumeDraftModal from '$lib/components/ResumeDraftModal.svelte';

	import Patron from '$lib/docs/rh/recibo-nomina/steps/Patron.svelte';
	import Trabajador from '$lib/docs/rh/recibo-nomina/steps/Trabajador.svelte';
	import Periodo from '$lib/docs/rh/recibo-nomina/steps/Periodo.svelte';
	import Percepciones from '$lib/docs/rh/recibo-nomina/steps/Percepciones.svelte';
	import Deducciones from '$lib/docs/rh/recibo-nomina/steps/Deducciones.svelte';
	import FormaPago from '$lib/docs/rh/recibo-nomina/steps/FormaPago.svelte';
	import Firmas from '$lib/docs/rh/recibo-nomina/steps/Firmas.svelte';
	import Preview from '$lib/docs/rh/recibo-nomina/steps/Preview.svelte';
	import Generado from '$lib/docs/rh/recibo-nomina/steps/Generado.svelte';

	const screens = {
		patron: Patron,
		trabajador: Trabajador,
		periodo: Periodo,
		percepciones: Percepciones,
		deducciones: Deducciones,
		formaPago: FormaPago,
		firmas: Firmas,
		preview: Preview,
		generado: Generado
	};

	// draftAvailable/draftChecked are separate stores exposed on the flow
	// object (not part of the document state itself) — bind them to local
	// names so Svelte's $-prefix auto-subscription applies correctly.
	const { draftAvailable, draftChecked } = nominaFlow;

	onMount(() => {
		nominaFlow.checkForDraft();
		nominaFlow.startPersisting();
	});
</script>

<svelte:head>
	<title>Comprobante de pago — Documentos</title>
</svelte:head>

{#if $draftChecked && $draftAvailable}
	<div transition:fade={{ duration: 150 }}>
		<ResumeDraftModal
			on:resume={() => nominaFlow.resumeDraft()}
			on:discard={() => nominaFlow.discardDraft()}
		/>
	</div>
{/if}

{#key $nominaFlow.screen}
	<div in:fade={{ duration: 200 }}>
		<svelte:component this={screens[$nominaFlow.screen]} />
	</div>
{/key}
