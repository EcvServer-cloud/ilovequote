import { computeTotals, formatCurrency } from './calculations.js';
import { buildQuotePdf } from './pdf.js';

export function buildMessage(state) {
	const totals = computeTotals(state.items, state.discount, state.tax);
	const clientName = state.client?.name?.trim() || 'estimado cliente';
	return `Hola ${clientName}, te comparto la cotización ${state.folio}. El total es de ${formatCurrency(
		totals.total
	)}. Gracias por tu preferencia.`;
}

function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Best-effort share to WhatsApp:
 * 1. Web Share API with file support -> native share sheet with the PDF attached.
 * 2. Fallback: download the PDF, then open WhatsApp with the message pre-filled
 *    so the user can attach the file manually.
 */
export async function shareToWhatsApp(state) {
	const { blob, filename } = await buildQuotePdf(state);
	const message = buildMessage(state);
	const file = new File([blob], filename, { type: 'application/pdf' });

	if (navigator.canShare && navigator.canShare({ files: [file] })) {
		try {
			await navigator.share({ files: [file], text: message, title: filename });
			return { method: 'share' };
		} catch (err) {
			if (err?.name === 'AbortError') return { method: 'cancelled' };
			// Fall through to the manual fallback below.
		}
	}

	downloadBlob(blob, filename);
	const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
	window.open(waUrl, '_blank', 'noopener');
	return { method: 'fallback' };
}

export async function downloadPdf(state) {
	const { blob, filename } = await buildQuotePdf(state);
	downloadBlob(blob, filename);
	return filename;
}
