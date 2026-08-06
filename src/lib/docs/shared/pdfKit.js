// Shared PDF primitives for the /docs ecosystem. Deliberately separate from
// src/lib/utils/pdf.js (cotización) — see NOTES.md for why we're not
// unifying them yet.

export const INK = '#111111';
export const MUTED = '#6B7280';
export const HEART = '#E11D2E';
export const BORDER = '#E7E7EA';

export async function createDoc() {
	const [{ default: jsPDF }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
	return new jsPDF({ unit: 'pt', format: 'letter' });
}

export function formatDate(date = new Date()) {
	return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

/**
 * Draws a standard header: logo (optional) on the left, entity name + contact
 * lines right-aligned. Returns the Y position to continue drawing from.
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

/** Wraps jspdf-autotable with the shared visual style. Returns finalY. */
export function drawTable(doc, { startY, head, body, marginX = 48, columnStyles = {} }) {
	doc.autoTable({
		startY,
		margin: { left: marginX, right: marginX },
		head: [head],
		body,
		styles: { font: 'helvetica', fontSize: 9.5, textColor: INK, cellPadding: 8 },
		headStyles: { fillColor: [17, 17, 17], textColor: [255, 255, 255], fontStyle: 'bold' },
		alternateRowStyles: { fillColor: [247, 247, 248] },
		columnStyles
	});
	return doc.lastAutoTable.finalY;
}

/** Brand footer on every page, matching cotización's "Creado con i❤️Quote". */
export function drawBrandFooter(doc) {
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageCount = doc.internal.getNumberOfPages();
	for (let p = 1; p <= pageCount; p++) {
		doc.setPage(p);
		const pageHeight = doc.internal.pageSize.getHeight();
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8);
		doc.setTextColor('#B3B3B6');
		doc.text('Creado con i❤️Quote', pageWidth / 2, pageHeight - 24, { align: 'center' });
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
