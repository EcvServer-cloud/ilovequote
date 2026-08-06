import {
	createDoc,
	drawHeader,
	drawSectionTitle,
	drawLine,
	drawTable,
	drawBrandFooter,
	formatDate,
	MUTED,
	INK,
	BORDER
} from '$lib/docs/shared/pdfKit.js';
import { sumConceptos, formatCurrency } from '$lib/docs/shared/schema.js';
import { amountToWords } from '$lib/docs/shared/numberToWords.js';
import { generateFolio } from '$lib/utils/folio.js'; // generic utility, reused by import (see NOTES.md)

export async function buildNominaPdf(state) {
	const doc = await createDoc();
	const marginX = 48;
	const pageWidth = doc.internal.pageSize.getWidth();

	const { patron, trabajador, periodo, percepciones, deducciones, formaPago, firmas, folio } = state;
	const totalPercepciones = sumConceptos(percepciones);
	const totalDeducciones = sumConceptos(deducciones);
	const neto = totalPercepciones - totalDeducciones;

	let y = drawHeader(doc, {
		logo: patron.logo,
		name: patron.nombre || 'Recibo de nómina',
		contactLines: [patron.telefono, patron.correo, patron.domicilio, patron.rfc ? `RFC: ${patron.rfc}` : ''],
		marginX
	});

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(11);
	doc.setTextColor(HEART_COLOR());
	doc.text(`Recibo de nómina ${folio}`, marginX, y);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9.5);
	doc.setTextColor(MUTED);
	doc.text(`Fecha de emisión: ${formatDate(new Date())}`, pageWidth - marginX, y, { align: 'right' });
	y += 22;

	// --- Trabajador ---------------------------------------------------------
	y = drawSectionTitle(doc, 'Trabajador', { marginX, y });
	y = drawLine(doc, 'Nombre', trabajador.nombre, { marginX, y });
	y = drawLine(doc, 'Puesto', trabajador.puesto, { marginX, y });
	y = drawLine(doc, 'CURP', trabajador.curp, { marginX, y });
	y = drawLine(doc, 'RFC', trabajador.rfc, { marginX, y });
	y = drawLine(doc, 'NSS', trabajador.nss, { marginX, y });
	y += 6;

	// --- Periodo -------------------------------------------------------------
	y = drawSectionTitle(doc, 'Periodo laboral', { marginX, y });
	const periodoParts = [
		periodo.fechaInicio && periodo.fechaFin ? `${periodo.fechaInicio} al ${periodo.fechaFin}` : '',
		periodo.periodicidad,
		periodo.fechaPago ? `Fecha de pago: ${periodo.fechaPago}` : ''
	].filter(Boolean);
	y = drawLine(doc, '', periodoParts.join('   •   '), { marginX, y });
	y += 10;

	// --- Percepciones ---------------------------------------------------------
	const percepRows = percepciones
		.filter((c) => c.nombre?.trim())
		.map((c) => [c.nombre, formatCurrency(c.monto)]);
	y = drawSectionTitle(doc, 'Percepciones', { marginX, y });
	y =
		drawTable(doc, {
			startY: y,
			head: ['Concepto', 'Monto'],
			body: percepRows,
			marginX,
			columnStyles: { 1: { halign: 'right', cellWidth: 120 } }
		}) + 18;

	// --- Deducciones ---------------------------------------------------------
	const dedRows = deducciones
		.filter((c) => c.nombre?.trim())
		.map((c) => [c.nombre, formatCurrency(c.monto)]);
	if (dedRows.length) {
		y = drawSectionTitle(doc, 'Deducciones', { marginX, y });
		y =
			drawTable(doc, {
				startY: y,
				head: ['Concepto', 'Monto'],
				body: dedRows,
				marginX,
				columnStyles: { 1: { halign: 'right', cellWidth: 120 } }
			}) + 18;
	}

	// --- Totales ---------------------------------------------------------------
	const totalsX = pageWidth - marginX - 200;
	const totalLine = (label, value, opts = {}) => {
		doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
		doc.setFontSize(opts.bold ? 12 : 9.5);
		doc.setTextColor(opts.bold ? INK : MUTED);
		doc.text(label, totalsX, y);
		doc.text(value, pageWidth - marginX, y, { align: 'right' });
		y += opts.bold ? 20 : 14;
	};
	totalLine('Total percepciones', formatCurrency(totalPercepciones));
	if (totalDeducciones > 0) totalLine('Total deducciones', `-${formatCurrency(totalDeducciones)}`);
	doc.setDrawColor(BORDER);
	doc.line(totalsX, y - 4, pageWidth - marginX, y - 4);
	y += 8;
	totalLine('Neto pagado', formatCurrency(neto), { bold: true });
	y += 10;

	doc.setFont('helvetica', 'italic');
	doc.setFontSize(8.5);
	doc.setTextColor(MUTED);
	const wordsLines = doc.splitTextToSize(amountToWords(neto), pageWidth - marginX * 2);
	doc.text(wordsLines, marginX, y);
	y += wordsLines.length * 11 + 10;

	// --- Forma de pago ---------------------------------------------------------
	if (formaPago) {
		y = drawLine(doc, 'Forma de pago', formaPago, { marginX, y, muted: false });
		y += 8;
	}

	doc.setFont('helvetica', 'italic');
	doc.setFontSize(7.5);
	doc.setTextColor(MUTED);
	const legal = doc.splitTextToSize(
		'Este recibo ampara el pago de las percepciones y deducciones señaladas, correspondientes al periodo laboral indicado.',
		pageWidth - marginX * 2
	);
	doc.text(legal, marginX, y);
	y += legal.length * 10 + 20;

	// --- Firmas ---------------------------------------------------------------
	if (firmas?.incluir) {
		const lineWidth = 200;
		const gap = pageWidth - marginX * 2 - lineWidth * 2;
		doc.setDrawColor(INK);
		doc.line(marginX, y, marginX + lineWidth, y);
		doc.line(marginX + lineWidth + gap, y, marginX + lineWidth * 2 + gap, y);
		doc.setFontSize(8.5);
		doc.setTextColor(MUTED);
		doc.text('Firma del patrón', marginX, y + 14);
		doc.text('Firma del trabajador', marginX + lineWidth + gap, y + 14);
	}

	drawBrandFooter(doc);

	const blob = doc.output('blob');
	return { blob, filename: `${folio}.pdf` };

	// local helper kept at bottom to avoid a top-level import collision with
	// pdfKit's own HEART export name
	function HEART_COLOR() {
		return '#E11D2E';
	}
}

/** Generates the folio for this document, reusing the generic folio utility. */
export function generateNominaFolio(patronNombre, date = new Date()) {
	return generateFolio(patronNombre, date);
}
