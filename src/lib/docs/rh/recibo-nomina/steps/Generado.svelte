<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { nominaFlow } from '$lib/docs/rh/recibo-nomina/flow.js';
	import { buildNominaPdf } from '$lib/docs/rh/recibo-nomina/template.js';
	import { downloadPdfBlob } from '$lib/docs/shared/pdfKit.js';
	import Toast from '$lib/components/Toast.svelte';

	let busy = false;
	let toastMsg = '';
	let showToast = false;

	function notify(msg) {
		toastMsg = msg;
		showToast = true;
		setTimeout(() => (showToast = false), 2600);
	}

	async function handleDownload() {
		busy = true;
		try {
			const { blob, filename } = await buildNominaPdf($nominaFlow);
			downloadPdfBlob(blob, filename);
			notify('PDF descargado');
		} catch {
			notify('No se pudo generar el PDF. Intenta de nuevo.');
		} finally {
			busy = false;
		}
	}

	function createAnother() {
		nominaFlow.reset();
	}

	function goToHub() {
		nominaFlow.reset();
		goto(`${base}/docs/rh`);
	}
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 py-12 text-center">
	<div class="animate-fade-up">
		<p class="text-4xl">✓</p>
		<h1 class="mt-3 font-display text-2xl font-bold text-ink">¡Recibo listo!</h1>
		<p class="mt-2 font-mono text-sm text-muted">{$nominaFlow.folio}</p>

		<div class="mt-8 flex flex-col gap-3">
			<button class="btn-primary" disabled={busy} on:click={handleDownload}>
				📄 Descargar PDF
			</button>
			<button class="btn-ghost mt-2" on:click={createAnother}>+ Crear otro recibo</button>
			<button class="btn-ghost text-xs" on:click={() => nominaFlow.go('preview')}>← Volver a editar</button>
			<button class="btn-ghost text-xs" on:click={goToHub}>Ir a Documentos</button>
		</div>
	</div>
</div>

<Toast message={toastMsg} show={showToast} />
