import {
	createDoc,
	drawBar,
	drawTable,
	drawBrandFooter,
	formatDate,
	formatTime,
	INK,
	MUTED,
	HEART,
	BORDER
} from '$lib/docs/shared/pdfKit.js';
import { sumConceptos, formatCurrency } from '$lib/docs/shared/schema.js';
import { amountToWords } from '$lib/docs/shared/numberToWords.js';

function pad(n) {
	return String(n).padStart(2, '0');
}

/**
 * Folio para Comprobante de pago: RFC-DEL-TRABAJADOR-DDMMYY-HHMM.
 * Si no hay RFC capturado, usamos las iniciales del trabajador como respaldo
 * para que el folio nunca quede vacío.
 */
export function generateNominaFolio(trabajador, date = new Date()) {
	const rfc = (trabajador?.rfc || '').trim().toUpperCase();
	const fallback =
		(trabajador?.nombre || '')
			.trim()
			.split(/\s+/)
			.map((w) => w.charAt(0))
			.join('')
			.toUpperCase() || 'CP';
	const id = rfc || fallback;
	const dd = pad(date.getDate());
	const mm = pad(date.getMonth() + 1);
	const yy = pad(date.getFullYear() % 100);
	const hh = pad(date.getHours());
	const min = pad(date.getMinutes());
	return `${id}-${dd}${mm}${yy}-${hh}${min}`;
}

export async function buildNominaPdf(state) {
	const doc = await createDoc();
	const pageWidth = doc.internal.pageSize.getWidth();
	const marginX = 44;
	const contentWidth = pageWidth - marginX * 2;

	const { patron, trabajador, periodo, percepciones, deducciones, retenciones, formaPago, notas, firmas, folio } =
		state;

	const totalPercepciones = sumConceptos(percepciones);
	const totalDeducciones = sumConceptos(deducciones);
	const retencionesMonto = Number(retenciones) || 0;
	const subtotal = totalPercepciones;
	const total = subtotal - totalDeducciones - retencionesMonto;
	const neto = total;

	let y = 34;

	// --- Franja superior: tipo de documento + folio ---------------------------
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(8.5);
	doc.setTextColor(HEART);
	doc.text('Comprobante de pago digital', marginX, y);
	doc.text(`FOLIO: ${folio}`, pageWidth - marginX, y, { align: 'right' });
	y += 14;

	// --- Banda de encabezado (empresa + fecha/hora) ---------------------------
	const bandTop = y;
	const bandHeight = 78;
	doc.setFillColor(HEART);
	doc.rect(marginX, bandTop, contentWidth, bandHeight, 'F');

	const logoSize = 44;
	const logoX = marginX + 10;
	const logoY = bandTop + (bandHeight - logoSize) / 2;
	doc.setFillColor('#FFFFFF');
	doc.roundedRect(logoX, logoY, logoSize, logoSize, 4, 4, 'F');
	if (patron.logo) {
		try {
			const props = doc.getImageProperties(patron.logo);
			const inner = logoSize - 8;
			let w = inner,
				h = inner;
			if (props.width > props.height) h = (props.height / props.width) * inner;
			else w = (props.width / props.height) * inner;
			doc.addImage(patron.logo, props.fileType, logoX + (logoSize - w) / 2, logoY + (logoSize - h) / 2, w, h);
		} catch {
			// Si el logo no se puede decodificar, seguimos sin romper el PDF.
		}
	} else {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(7.5);
		doc.setTextColor(MUTED);
		doc.text('LOGO', logoX + logoSize / 2, logoY + logoSize / 2 + 2, { align: 'center' });
	}

	const infoX = logoX + logoSize + 14;
	let iy = bandTop + 22;
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(13);
	doc.setTextColor('#FFFFFF');
	doc.text((patron.nombre || 'Nombre de la empresa').toUpperCase(), infoX, iy);
	iy += 13;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8);
	const infoLines = [
		patron.domicilio ? `DIRECCIÓN: ${patron.domicilio.toUpperCase()}` : '',
		patron.rfc ? `RFC: ${patron.rfc.toUpperCase()}` : '',
		[patron.telefono ? `TELÉFONO: ${patron.telefono}` : '', patron.correo ? `CORREO: ${patron.correo.toUpperCase()}` : '']
			.filter(Boolean)
			.join('   ')
	].filter(Boolean);
	for (const line of infoLines) {
		doc.text(line, infoX, iy);
		iy += 11;
	}

	const now = new Date();
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(8);
	doc.setTextColor('#FFFFFF');
	doc.text('FECHA:', pageWidth - marginX - 90, bandTop + 26);
	doc.text('HORA:', pageWidth - marginX - 90, bandTop + 40);
	doc.setFont('helvetica', 'normal');
	doc.text(formatDate(now), pageWidth - marginX - 10, bandTop + 26, { align: 'right' });
	doc.text(formatTime(now), pageWidth - marginX - 10, bandTop + 40, { align: 'right' });

	y = bandTop + bandHeight + 14;

	// --- Caja Trabajador | Periodo ---------------------------------------------
	const boxTop = y;
	const boxHeight = 96;
	const half = contentWidth / 2;
	doc.setDrawColor(INK);
	doc.rect(marginX, boxTop, contentWidth, boxHeight, 'S');
	doc.line(marginX + half, boxTop, marginX + half, boxTop + boxHeight);

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(9.5);
	doc.setTextColor(INK);
	doc.text('TRABAJADOR', marginX + half / 2, boxTop + 16, { align: 'center' });

	let ly = boxTop + 32;
	const trabajadorLines = [
		['NOMBRE', trabajador.nombre],
		['PUESTO', trabajador.puesto],
		['CURP', trabajador.curp],
		['RFC', trabajador.rfc],
		['NSS', trabajador.nss]
	];
	for (const [label, value] of trabajadorLines) {
		if (!value) continue;
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(8);
		doc.setTextColor(INK);
		doc.text(`${label}:`, marginX + 12, ly);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(MUTED);
		doc.text(String(value), marginX + 60, ly);
		ly += 12;
	}

	let ry = boxTop + 22;
	const periodoLines = [
		['EJERCICIO', periodo.ejercicio],
		['PERIODO LABORAL', periodo.fechaInicio && periodo.fechaFin ? `${periodo.fechaInicio} al ${periodo.fechaFin}` : ''],
		['TIPO', periodo.periodicidad],
		['FECHA DE PAGO', periodo.fechaPago]
	];
	for (const [label, value] of periodoLines) {
		if (!value) continue;
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(8);
		doc.setTextColor(INK);
		doc.text(`${label}:`, marginX + half + 12, ry);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(MUTED);
		doc.text(String(value), marginX + half + 100, ry);
		ry += 14;
	}

	y = boxTop + boxHeight + 14;

	// --- Percepciones | Deducciones ---------------------------------------------
	const gap = 10;
	const colWidth = (contentWidth - gap) / 2;
	const leftX = marginX;
	const rightX = marginX + colWidth + gap;

	const barY = drawBar(doc, { x: leftX, y, width: colWidth, text: 'PERCEPCIONES', height: 18, fontSize: 8.5 });
	drawBar(doc, { x: rightX, y, width: colWidth, text: 'DEDUCCIONES', height: 18, fontSize: 8.5 });
	y = barY;

	const percepRows = percepciones
		.filter((c) => c.nombre?.trim())
		.map((c, i) => [String(i + 1), c.nombre, formatCurrency(c.monto)]);
	const dedRows = deducciones
		.filter((c) => c.nombre?.trim())
		.map((c, i) => [String(i + 1), c.nombre, formatCurrency(c.monto)]);

	const percepFinalY = drawTable(doc, {
		startY: y,
		head: ['NO.', 'CONCEPTO', 'TOTAL'],
		body: percepRows,
		x: leftX,
		width: colWidth,
		columnStyles: { 0: { cellWidth: 22, halign: 'center' }, 2: { halign: 'right', cellWidth: 60 } }
	});
	const dedFinalY = drawTable(doc, {
		startY: y,
		head: ['NO.', 'CONCEPTO', 'TOTAL'],
		body: dedRows,
		x: rightX,
		width: colWidth,
		columnStyles: { 0: { cellWidth: 22, halign: 'center' }, 2: { halign: 'right', cellWidth: 60 } }
	});

	y = Math.max(percepFinalY, dedFinalY) + 14;
	doc.setDrawColor(INK);
	doc.line(leftX + colWidth + gap / 2, barY, leftX + colWidth + gap / 2, y - 14);

	// --- Forma de pago + notas (izq.) / resumen (der.) --------------------------
	const bottomTop = y;
	drawBar(doc, {
		x: leftX,
		y: bottomTop,
		width: colWidth,
		height: 18,
		text: `Forma de pago: ${formaPago || '—'}`,
		align: 'left',
		fontSize: 8.5
	});

	const notasTop = bottomTop + 18 + 6;
	const notasHeight = 66;
	doc.setDrawColor(BORDER);
	doc.rect(leftX, notasTop, colWidth, notasHeight, 'S');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(7.5);
	doc.setTextColor(INK);
	doc.text('NOTAS:', leftX + 8, notasTop + 14);
	if (notas) {
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8);
		doc.setTextColor(MUTED);
		const notasLines = doc.splitTextToSize(notas, colWidth - 16);
		doc.text(notasLines, leftX + 8, notasTop + 28);
	}

	const summaryTop = bottomTop;
	const summaryHeight = 18 + 6 + notasHeight;
	doc.setDrawColor(BORDER);
	doc.rect(rightX, summaryTop, colWidth, summaryHeight, 'S');

	let sy = summaryTop + 18;
	const summaryLine = (label, value, opts = {}) => {
		doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
		doc.setFontSize(opts.bold ? 10.5 : 8.5);
		doc.setTextColor(opts.pink ? HEART : opts.bold ? INK : MUTED);
		doc.text(label, rightX + 10, sy);
		doc.text(value, rightX + colWidth - 10, sy, { align: 'right' });
		sy += opts.bold ? 18 : 14;
	};
	summaryLine('Subtotal $', formatCurrency(subtotal));
	summaryLine('Descuentos $', formatCurrency(totalDeducciones));
	summaryLine('Retenciones $', formatCurrency(retencionesMonto));
	doc.setDrawColor(BORDER);
	doc.line(rightX + 10, sy - 4, rightX + colWidth - 10, sy - 4);
	summaryLine('Total $', formatCurrency(total), { bold: true });
	summaryLine('Neto del recibo $', formatCurrency(neto), { bold: true, pink: true });

	y = Math.max(notasTop + notasHeight, summaryTop + summaryHeight) + 16;

	// --- Importe con letra ---------------------------------------------------------
	y = drawBar(doc, { x: marginX, y, width: contentWidth, height: 16, text: 'IMPORTE CON LETRA', fontSize: 8 });
	y += 12;
	doc.setFont('helvetica', 'italic');
	doc.setFontSize(8.5);
	doc.setTextColor(MUTED);
	doc.text(amountToWords(neto).toLowerCase(), marginX, y);
	y += 24;

	// --- Texto legal --------------------------------------------------------------------
	doc.setFont('helvetica', 'italic');
	doc.setFontSize(7.5);
	doc.setTextColor(MUTED);
	const legal = doc.splitTextToSize(
		'Este recibo ampara el pago de las percepciones y deducciones señaladas, correspondientes al periodo laboral indicado.',
		contentWidth
	);
	doc.text(legal, marginX, y);
	y += legal.length * 10 + 40;

	// --- Firmas --------------------------------------------------------------------------
	if (firmas?.incluir) {
		const lineWidth = 200;
		const gapFirmas = contentWidth - lineWidth * 2;
		doc.setDrawColor(INK);
		doc.line(marginX, y, marginX + lineWidth, y);
		doc.line(marginX + lineWidth + gapFirmas, y, marginX + lineWidth * 2 + gapFirmas, y);
		doc.setFont('helvetica', 'italic');
		doc.setFontSize(8);
		doc.setTextColor(MUTED);
		doc.text('FIRMA DEL PATRON', marginX + lineWidth / 2, y + 14, { align: 'center' });
		doc.text('FIRMA DEL EMPLEADO', marginX + lineWidth + gapFirmas + lineWidth / 2, y + 14, { align: 'center' });
	}

	drawBrandFooter(doc);

	const blob = doc.output('blob');
	return { blob, filename: `${folio}.pdf` };
}
