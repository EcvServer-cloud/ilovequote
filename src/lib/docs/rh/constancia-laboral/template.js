import { createDoc, drawBrandFooter, formatDate, formatTime, INK, MUTED, HEART, BORDER } from '$lib/docs/shared/pdfKit.js';
import { generateFolio } from '$lib/utils/folio.js'; // motor genérico reutilizado por import (ver NOTES.md)
import { buildParrafos, buildDestinatarioLine, buildLugarFecha } from './redaccion.js';

/**
 * Folio de la Constancia Laboral: reutiliza el mismo generador que el resto
 * del sistema (SIGLAS-DDMMYY-HHMM), llamado con "Constancia Laboral" como
 * nombre — así las siglas siempre salen "CL", igual que en el ejemplo
 * (CL-110826-2057), sin inventar un sistema de folios nuevo.
 */
export function generateConstanciaFolio(date = new Date()) {
	return generateFolio('Constancia Laboral', date);
}

export async function buildConstanciaPdf(state) {
	const doc = await createDoc();
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const marginX = 64;
	const contentWidth = pageWidth - marginX * 2;

	const { empresa, trabajador, destinatario, firmante, sello, folio } = state;
	const now = new Date();

	let y = 56;

	// --- Membrete: logo + datos de la empresa (discreto, sin bandas de color) ---
	if (empresa.logo) {
		try {
			const props = doc.getImageProperties(empresa.logo);
			const h = 40;
			const w = (props.width / props.height) * h;
			doc.addImage(empresa.logo, props.fileType, marginX, y - 6, w, h);
		} catch {
			// sin logo si no se puede decodificar
		}
	}

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(12.5);
	doc.setTextColor(INK);
	doc.text(empresa.nombre || 'Nombre de la empresa', pageWidth - marginX, y, { align: 'right' });

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8.5);
	doc.setTextColor(MUTED);
	let hy = y + 13;
	const headerLines = [
		empresa.rfc ? `RFC: ${empresa.rfc}` : '',
		empresa.domicilio,
		[empresa.telefono, empresa.correo].filter(Boolean).join('   ·   ')
	].filter(Boolean);
	for (const line of headerLines) {
		doc.text(line, pageWidth - marginX, hy, { align: 'right' });
		hy += 11;
	}

	y = Math.max(y + 40, hy) + 16;
	doc.setDrawColor(BORDER);
	doc.line(marginX, y, pageWidth - marginX, y);
	y += 34;

	// --- Título ------------------------------------------------------------------
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(17);
	doc.setTextColor(HEART);
	doc.text('CONSTANCIA LABORAL', pageWidth / 2, y, { align: 'center', charSpace: 0.6 });

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(7.5);
	doc.setTextColor(MUTED);
	doc.text(`Folio: ${folio}   ·   Fecha: ${formatDate(now)}`, pageWidth / 2, y + 15, { align: 'center' });
	y += 42;

	// --- Lugar y fecha de emisión --------------------------------------------------
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9.5);
	doc.setTextColor(INK);
	doc.text(buildLugarFecha(empresa, now), marginX, y);
	y += 30;

	// --- Destinatario -------------------------------------------------------------
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(10.5);
	doc.setTextColor(INK);
	doc.text(buildDestinatarioLine(destinatario), marginX, y);
	y += 26;

	// --- Cuerpo: redacción automática, justificada -------------------------------
	const parrafos = buildParrafos(state);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10.5);
	doc.setTextColor(INK);
	for (const parrafo of parrafos) {
		const lines = doc.splitTextToSize(parrafo, contentWidth);
		doc.text(lines, marginX, y, { align: 'justify', maxWidth: contentWidth, lineHeightFactor: 1.55 });
		y += lines.length * 16 + 14;
	}

	y += 20;

	// --- Cierre: ATENTAMENTE + firma + sello --------------------------------------
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(10.5);
	doc.setTextColor(INK);
	doc.text('ATENTAMENTE', marginX, y);
	y += 56;

	const sigWidth = 220;
	doc.setDrawColor(INK);
	if (firmante?.incluirFirma !== false) {
		doc.line(marginX, y, marginX + sigWidth, y);
	}

	if (sello?.incluir && sello.imagen) {
		try {
			const props = doc.getImageProperties(sello.imagen);
			const sh = 60;
			const sw = (props.width / props.height) * sh;
			doc.addImage(sello.imagen, props.fileType, marginX + sigWidth + 30, y - sh + 12, sw, sh);
		} catch {
			// sin sello si no se puede decodificar
		}
	}

	y += 14;
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(9.5);
	doc.setTextColor(INK);
	doc.text(firmante?.nombre || '', marginX, y);
	y += 12;

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8.5);
	doc.setTextColor(MUTED);
	const cargoLine = [firmante?.cargo, firmante?.tipo === 'Otro' ? firmante?.tipoOtro : firmante?.tipo].filter(Boolean).join(' · ');
	if (cargoLine) {
		doc.text(cargoLine, marginX, y);
		y += 11;
	}
	if (empresa.nombre) {
		doc.text(empresa.nombre, marginX, y);
	}

	// --- Pie: leyenda + folio/generado + marca (mismo tratamiento que los demás) ---
	const footerY = Math.max(y + 50, pageHeight - 74);
	doc.setFont('helvetica', 'italic');
	doc.setFontSize(7);
	doc.setTextColor(MUTED);
	const legend = doc.splitTextToSize(
		'La presente constancia se expide a solicitud del interesado y contiene la información proporcionada por la empresa para acreditar la relación laboral indicada.',
		contentWidth * 0.68
	);
	doc.text(legend, marginX, footerY);

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(7);
	doc.setTextColor(MUTED);
	doc.text(`Folio: ${folio}   |   Generado el ${formatDate(now)} a las ${formatTime(now)}`, pageWidth - marginX, footerY, {
		align: 'right'
	});

	drawBrandFooter(doc);

	const blob = doc.output('blob');
	return { blob, filename: `${folio}.pdf` };
}
