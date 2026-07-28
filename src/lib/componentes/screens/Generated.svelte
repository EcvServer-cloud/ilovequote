<script>
	import { quote } from '$lib/stores/quote.js';
	import { downloadPdf, shareToWhatsApp } from '$lib/utils/whatsapp.js';
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
			await downloadPdf($quote);
			notify('PDF descargado');
		} catch {
			notify('No se pudo generar el PDF. Intenta de nuevo.');
		} finally {
			busy = false;
		}
	}

	async function handleShare() {
		busy = true;
		try {
			const result = await shareToWhatsApp($quote);
			if (result.method === 'fallback') {
				notify('PDF descargado — adjúntalo en WhatsApp');
			}
		} catch {
			notify('No se pudo compartir. Intenta descargar el PDF.');
		} finally {
			busy = false;
		}
	}

	function createAnother() {
		quote.reset();
	}
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 py-12 text-center">
	<div class="animate-fade-up">
		<p class="text-4xl">✓</p>
		<h1 class="mt-3 font-display text-2xl font-bold text-ink">¡Cotización lista!</h1>
		<p class="mt-2 font-mono text-sm text-muted">{$quote.folio}</p>

		<div class="mt-8 flex flex-col gap-3">
			<button class="btn-primary" disabled={busy} on:click={handleDownload}>
				📄 Descargar PDF
			</button>
			<button class="btn-secondary" disabled={busy} on:click={handleShare}>
				💬 Compartir por WhatsApp
			</button>
			<button class="btn-ghost mt-2" on:click={createAnother}>+ Crear otra cotización</button>
			<button class="btn-ghost text-xs" on:click={() => quote.go('preview')}>← Volver a editar</button>
		</div>
	</div>
</div>

<Toast message={toastMsg} show={showToast} />
