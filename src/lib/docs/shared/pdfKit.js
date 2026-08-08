// Shared PDF primitives for the /docs ecosystem. Deliberately separate from
// src/lib/utils/pdf.js (cotización) — see NOTES.md for why we're not
// unifying them yet.

export const INK = '#111111';
export const MUTED = '#6B7280';
export const HEART = '#E11D2E';
export const HEART_RGB = [225, 29, 46]; // same as HEART, as an RGB triplet for autoTable fillColor
export const BORDER = '#E7E7EA';

export async function createDoc() {
	const [{ default: jsPDF }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
	return new jsPDF({ unit: 'pt', format: 'letter' });
}

export function formatDate(date = new Date()) {
	return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

export function formatTime(date = new Date()) {
	return new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(date);
}

/**
 * Draws a standard header: logo (optional) on the left, entity name + contact
 * lines right-aligned. Returns the Y position to continue drawing from.
 * (Kept for simpler documents. Comprobante de pago uses its own custom
 * banded header — see rh/recibo-nomina/template.js — but this stays available
 * for future, simpler documents.)
 */
export function drawHeader(doc, { logo, name, contactLines = [], marginX = 48, startY = 56 }) {
	const pageWidth = doc.internal.pageSize.getWidth();
	let y = startY;

	if (logo) {
		try {
			const props = doc.getImageProperties(logo);
			const h = 42;
			const w = (props.width / props.height) * h;
			doc.addImage(logo, props.fileType, marginX, y - 8, w, h);
		} catch {
			// Skip silently if the logo can't be decoded rather than break the PDF.
		}
	}

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(16);
	doc.setTextColor(INK);
	doc.text(name || '', pageWidth - marginX, y + 4, { align: 'right' });

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9.5);
	doc.setTextColor(MUTED);
	let cy = y + 18;
	for (const line of contactLines.filter(Boolean)) {
		doc.text(line, pageWidth - marginX, cy, { align: 'right' });
		cy += 12;
	}

	y = Math.max(y + 46, cy + 6);
	doc.setDrawColor(BORDER);
	doc.line(marginX, y, pageWidth - marginX, y);
	return y + 22;
}

/** Section title, e.g. "Percepciones". Returns the Y to continue from. */
export function drawSectionTitle(doc, text, { marginX = 48, y }) {
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(10.5);
	doc.setTextColor(INK);
	doc.text(text, marginX, y);
	return y + 14;
}

/** A label: value line, e.g. "RFC: XXXX". Returns the Y to continue from. */
export function drawLine(doc, label, value, { marginX = 48, y, muted = true }) {
	if (!value) return y;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9.5);
	doc.setTextColor(muted ? MUTED : INK);
	doc.text(`${label ? label + ': ' : ''}${value}`, marginX, y);
	return y + 13;
}

/**
 * Solid color bar with centered/left/right text — used for the pink section
 * bars ("PERCEPCIONES", "Forma de pago: ...", "IMPORTE CON LETRA", etc).
 * Returns the Y position right below the bar.
 */
export function drawBar(doc, { x, y, width, height = 20, text, align = 'center', bg = HEART, color = '#FFFFFF', fontSize = 9, bold = true }) {
	doc.setFillColor(bg);
	doc.rect(x, y, width, height, 'F');
	doc.setFont('helvetica', bold ? 'bold' : 'normal');
	doc.setFontSize(fontSize);
	doc.setTextColor(color);
	const textY = y + height / 2 + fontSize * 0.35;
	if (align === 'left') {
		doc.text(text, x + 8, textY);
	} else if (align === 'right') {
		doc.text(text, x + width - 8, textY, { align: 'right' });
	} else {
		doc.text(text, x + width / 2, textY, { align: 'center' });
	}
	return y + height;
}

/**
 * Wraps jspdf-autotable with the shared visual style (brand-pink header row).
 * Pass `x`/`width` to constrain the table to part of the page — used to put
 * two tables side by side (e.g. Percepciones | Deducciones).
 * Returns finalY.
 */
export function drawTable(doc, { startY, head, body, marginX = 48, x, width, columnStyles = {} }) {
	const pageWidth = doc.internal.pageSize.getWidth();
	const left = x ?? marginX;
	const right = width != null ? pageWidth - left - width : marginX;

	doc.autoTable({
		startY,
		margin: { left, right },
		tableWidth: width ?? 'auto',
		head: [head],
		body,
		styles: { font: 'helvetica', fontSize: 8.5, textColor: INK, cellPadding: 5 },
		headStyles: { fillColor: HEART_RGB, textColor: [255, 255, 255], fontStyle: 'bold' },
		alternateRowStyles: { fillColor: [250, 245, 246] },
		columnStyles
	});
	return doc.lastAutoTable.finalY;
}

/** Brand footer on every page. */
export function drawBrandFooter(doc, { text = 'Hecho con YoAmoCotizar.com' } = {}) {
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageCount = doc.internal.getNumberOfPages();
	for (let p = 1; p <= pageCount; p++) {
		doc.setPage(p);
		const pageHeight = doc.internal.pageSize.getHeight();
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8);
		doc.setTextColor(HEART);
		doc.text(text, pageWidth / 2, pageHeight - 24, { align: 'center' });
	}
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

export function downloadPdfBlob(blob, filename) {
	downloadBlob(blob, filename);
}
