import { computeTotals, itemTotal, formatCurrency } from './calculations.js';
import { amountToWords } from './numberToWords.js';
import { drawIconBadge } from './pdfIcons.js';

const INK = '#111111';
const MUTED = '#6B7280';
const HEART = '#E11D2E';
const HEART_RGB = [225, 29, 46];
const HEART_LIGHT = '#FCE4E6';
const CARD_BG = '#FDF6F7';
const BORDER = '#E7E7EA';

function formatDate(date = new Date()) {
	return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}
function formatShortDate(date = new Date()) {
	return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}
function formatTime(date = new Date()) {
	return new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
}

/**
 * Builds the quotation PDF and returns a Blob + suggested filename.
 * Only imports jsPDF on demand (client-side), keeping the initial bundle small.
 */
export async function buildQuotePdf(state) {
	const [{ default: jsPDF }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);

	const doc = new jsPDF({ unit: 'pt', format: 'letter' });
	const pageWidth = doc.internal.pageSize.getWidth();
	const marginX = 40;
	const contentWidth = pageWidth - marginX * 2;
	const rightEdge = pageWidth - marginX;

	const { business, client, items, discount, tax, meta, type, folio } = state;
	const totals = computeTotals(items, discount, tax);
	const isDetailed = type === 'detailed';
	const now = new Date();

	// ============================================================
	// HEADER — logo | datos del negocio | "COTIZACIÓN" + folio
	// ============================================================
	const headerTop = 40;
	const logoW = 108;
	const logoH = 88;
	const logoX = marginX;
	const logoY = headerTop;

	// Logo box
	doc.setFillColor(HEART);
	doc.roundedRect(logoX, logoY, logoW, logoH, 10, 10, 'F');
	if (business.logo) {
		try {
			const props = doc.getImageProperties(business.logo);
			const pad = 12;
			const maxW = logoW - pad * 2;
			const maxH = logoH - pad * 2;
			let w = maxW,
				h = maxH;
			if (props.width / props.height > maxW / maxH) h = (props.height / props.width) * maxW;
			else w = (props.width / props.height) * maxH;
			doc.setFillColor('#FFFFFF');
			doc.roundedRect(logoX + (logoW - w) / 2 - 4, logoY + (logoH - h) / 2 - 4, w + 8, h + 8, 6, 6, 'F');
			doc.addImage(business.logo, props.fileType, logoX + (logoW - w) / 2, logoY + (logoH - h) / 2, w, h);
		} catch {
			// keep the plain logo box if the image can't be decoded
		}
	} else {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(11);
		doc.setTextColor('#FFFFFF');
		doc.text('LOGO', logoX + logoW / 2, logoY + logoH / 2 + 4, { align: 'center' });
	}

	// Right block: title + folio card
	const rightW = 168;
	const rightX = rightEdge - rightW;
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(24);
	doc.setTextColor(HEART);
	doc.text('COTIZACIÓN', rightEdge, logoY + 20, { align: 'right' });

	const folioCardTop = logoY + 34;
	const folioCardH = 44;
	doc.setFillColor(HEART_LIGHT);
	doc.roundedRect(rightX, folioCardTop, rightW, folioCardH, 8, 8, 'F');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(7);
	doc.setTextColor(HEART);
	doc.text('FOLIO', rightX + rightW / 2, folioCardTop + 15, { align: 'center' });
	doc.setFontSize(11);
	doc.setTextColor(INK);
	doc.text(folio || '—', rightX + rightW / 2, folioCardTop + 32, { align: 'center' });

	const fyH = folioCardTop + folioCardH + 16;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(7.5);
	doc.setTextColor(MUTED);
	doc.text(`FECHA: ${formatDate(now)}   •   HORA: ${formatTime(now)}`, rightX + rightW / 2, fyH, { align: 'center' });

	// Middle block: business identity, between logo and right block
	const middleX = logoX + logoW + 18;
	const middleW = rightX - 16 - middleX;
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(14);
	doc.setTextColor(INK);
	doc.text(business.name || 'Nombre de tu empresa', middleX, logoY + 16);

	let midY = logoY + 34;
	const iconRow = (icon, text) => {
		if (!text) return;
		drawIconBadge(doc, { x: middleX, y: midY - 10, size: 13, icon });
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8.5);
		doc.setTextColor(INK);
		const lines = doc.splitTextToSize(text, middleW - 20);
		doc.text(lines, middleX + 18, midY);
		midY += 14 * lines.length;
	};
	iconRow('phone', business.phone);
	iconRow('mail', business.email);
	iconRow('pin', business.address);
	if (isDetailed && business.taxId) iconRow('idcard', `RFC: ${business.taxId}`);

	let y = Math.max(logoY + logoH, midY, fyH) + 18;
	doc.setDrawColor(HEART);
	doc.setLineWidth(2);
	doc.line(marginX, y, rightEdge, y);
	doc.setLineWidth(1);
	y += 20;

	// ============================================================
	// CLIENTE  |  INFORMACIÓN DE LA COTIZACIÓN
	// ============================================================
	const colGap = 16;
	const colW = (contentWidth - colGap) / 2;
	const clientColX = marginX;
	const infoColX = marginX + colW + colGap;

	const clientLines = [
		['phone', client.phone],
		['mail', client.email],
		['pin', client.address],
		...(isDetailed && client.taxId ? [['idcard', `RFC: ${client.taxId}`]] : [])
	].filter(([, v]) => v);

	const infoLines = [
		['Tipo de cotización:', isDetailed ? 'Detallada' : 'Rápida'],
		...(meta.validity ? [['Vigencia:', meta.validity]] : []),
		...(isDetailed && meta.paymentMethod ? [['Forma de pago:', meta.paymentMethod]] : []),
		...(isDetailed && meta.deliveryTime ? [['Tiempo de entrega:', meta.deliveryTime]] : [])
	];

	const cardTop = y;
	const clientCardH = 40 + clientLines.length * 15;
	const infoCardH = 30 + infoLines.length * 22;
	const cardH = Math.max(clientCardH, infoCardH, 96);

	function drawCard(x) {
		doc.setFillColor(CARD_BG);
		doc.setDrawColor(BORDER);
		doc.roundedRect(x, cardTop, colW, cardH, 8, 8, 'FD');
	}
	drawCard(clientColX);
	drawCard(infoColX);

	// Cliente card
	drawIconBadge(doc, { x: clientColX + 14, y: cardTop + 14, size: 18, icon: 'person' });
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(9.5);
	doc.setTextColor(HEART);
	doc.text('CLIENTE', clientColX + 40, cardTop + 26);

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(11);
	doc.setTextColor(INK);
	doc.text(client.name || 'Nombre del cliente', clientColX + 14, cardTop + 46);

	let cly = cardTop + 46 + 18;
	for (const [icon, text] of clientLines) {
		drawIconBadge(doc, { x: clientColX + 14, y: cly - 9, size: 12, icon });
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8.5);
		doc.setTextColor(INK);
		doc.text(String(text), clientColX + 32, cly);
		cly += 15;
	}

	// Información de la cotización card
	drawIconBadge(doc, { x: infoColX + 14, y: cardTop + 14, size: 18, icon: 'document' });
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(9.5);
	doc.setTextColor(HEART);
	doc.text('INFORMACIÓN DE LA COTIZACIÓN', infoColX + 40, cardTop + 26);

	let ily = cardTop + 50;
	for (const [label, value] of infoLines) {
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8.5);
		doc.setTextColor(MUTED);
		doc.text(label, infoColX + 14, ily);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(label.startsWith('Tipo') ? HEART : INK);
		doc.text(String(value), infoColX + 130, ily);
		ily += 22;
	}

	y = cardTop + cardH + 20;

	// ============================================================
	// TABLA DE PRODUCTOS / SERVICIOS
	// ============================================================
	const rows = items
		.filter((it) => it.description?.trim())
		.map((it, i) => [String(i + 1).padStart(2, '0'), it.description, String(it.qty), formatCurrency(it.price), formatCurrency(itemTotal(it))]);

	doc.autoTable({
		startY: y,
		margin: { left: marginX, right: marginX },
		head: [['#', 'DESCRIPCIÓN', 'CANT.', 'PRECIO UNITARIO', 'IMPORTE']],
		body: rows,
		styles: { font: 'helvetica', fontSize: 9, textColor: INK, cellPadding: 8 },
		headStyles: { fillColor: HEART_RGB, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
		alternateRowStyles: { fillColor: [253, 246, 247] },
		columnStyles: {
			0: { cellWidth: 32, halign: 'center', textColor: HEART, fontStyle: 'bold' },
			2: { cellWidth: 46, halign: 'center' },
			3: { cellWidth: 100, halign: 'right' },
			4: { cellWidth: 100, halign: 'right', fontStyle: 'bold' }
		}
	});

	y = doc.lastAutoTable.finalY + 20;

	// ============================================================
	// BLOQUE INFERIOR: cuadrantes (detallada) + resumen de totales
	// ============================================================
	const bottomGap = 16;
	const leftW = contentWidth * 0.6;
	const rightW2 = contentWidth - leftW - bottomGap;
	const leftX2 = marginX;
	const rightX2 = marginX + leftW + bottomGap;

	const quadrants = [
		['document', 'TÉRMINOS', meta.terms],
		['pencil', 'NOTAS', meta.notes],
		['bank', 'DATOS DE PAGO', meta.bankDetails],
		['check', 'CONDICIONES', meta.conditions]
	].filter(([, , text]) => text?.trim());

	let bottomBlockBottom = y;

	if (quadrants.length) {
		const cellGap = 12;
		const cellW = (leftW - cellGap) / 2;
		const cellH = 78;
		quadrants.forEach(([icon, title, text], i) => {
			const col = i % 2;
			const row = Math.floor(i / 2);
			const cx = leftX2 + col * (cellW + cellGap);
			const cyTop = y + row * (cellH + cellGap);

			doc.setFillColor(CARD_BG);
			doc.setDrawColor(BORDER);
			doc.roundedRect(cx, cyTop, cellW, cellH, 7, 7, 'FD');

			drawIconBadge(doc, { x: cx + 10, y: cyTop + 10, size: 15, icon });
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(8);
			doc.setTextColor(HEART);
			doc.text(title, cx + 32, cyTop + 20);

			doc.setFont('helvetica', 'normal');
			doc.setFontSize(7.8);
			doc.setTextColor(MUTED);
			const lines = doc.splitTextToSize(text, cellW - 20).slice(0, 5);
			doc.text(lines, cx + 10, cyTop + 34);

			bottomBlockBottom = Math.max(bottomBlockBottom, cyTop + cellH);
		});
	}

	// Resumen de totales (derecha)
	let sy = y + 4;
	const summaryLine = (label, value, opts = {}) => {
		doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
		doc.setFontSize(opts.bold ? 11 : 9);
		doc.setTextColor(opts.negative ? HEART : opts.bold ? INK : MUTED);
		doc.text(label, rightX2, sy);
		doc.text(value, rightX2 + rightW2, sy, { align: 'right' });
		sy += opts.bold ? 20 : 17;
	};
	summaryLine('Subtotal', formatCurrency(totals.subtotal));
	if (discount?.enabled && totals.discountAmount > 0) {
		summaryLine('Descuento', `-${formatCurrency(totals.discountAmount)}`, { negative: true });
	}
	if (tax?.enabled && totals.taxAmount > 0) {
		summaryLine(`Impuestos (${tax.rate}%)`, formatCurrency(totals.taxAmount));
	}

	sy += 4;
	const totalBarH = 30;
	doc.setFillColor(HEART);
	doc.roundedRect(rightX2, sy - 20, rightW2, totalBarH, 6, 6, 'F');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(9);
	doc.setTextColor('#FFFFFF');
	doc.text('TOTAL', rightX2 + 12, sy - 3);
	doc.setFontSize(13);
	doc.text(formatCurrency(totals.total), rightX2 + rightW2 - 12, sy - 3, { align: 'right' });
	sy += totalBarH + 8;

	// Total con letra
	drawIconBadge(doc, { x: rightX2, y: sy - 11, size: 16, icon: 'dollar' });
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(6.5);
	doc.setTextColor(MUTED);
	doc.text('TOTAL CON LETRA', rightX2 + 22, sy - 8);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(7.5);
	doc.setTextColor(INK);
	const wordsLines = doc.splitTextToSize(amountToWords(totals.total), rightW2 - 22);
	doc.text(wordsLines, rightX2 + 22, sy + 4);
	sy += 4 + wordsLines.length * 10;

	bottomBlockBottom = Math.max(bottomBlockBottom, sy);
	y = bottomBlockBottom + 24;

	// ============================================================
	// ACEPTACIÓN DE LA COTIZACIÓN (firmas) — solo si se activó
	// ============================================================
	if (meta.hasSignature) {
		const boxH = 92;
		doc.setFillColor(CARD_BG);
		doc.setDrawColor(BORDER);
		doc.roundedRect(marginX, y, contentWidth, boxH, 8, 8, 'FD');

		doc.setFont('helvetica', 'bold');
		doc.setFontSize(9);
		doc.setTextColor(HEART);
		doc.text('ACEPTACIÓN DE LA COTIZACIÓN', pageWidth / 2, y + 20, { align: 'center' });

		const sigColW = contentWidth / 2;
		const drawSignatureBlock = (x, icon, label) => {
			drawIconBadge(doc, { x: x + 20, y: y + 34, size: 16, icon });
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(8.5);
			doc.setTextColor(INK);
			doc.text(label, x + 42, y + 46);

			doc.setFont('helvetica', 'normal');
			doc.setFontSize(8);
			doc.setTextColor(MUTED);
			doc.text('Nombre:', x + 20, y + 68);
			doc.setDrawColor(BORDER);
			doc.line(x + 60, y + 68, x + sigColW - 24, y + 68);
			doc.text('Fecha:', x + 20, y + 84);
			doc.line(x + 60, y + 84, x + sigColW - 24, y + 84);
		};
		drawSignatureBlock(marginX, 'person', 'EL CLIENTE');
		doc.setDrawColor(BORDER);
		doc.line(marginX + sigColW, y + 14, marginX + sigColW, y + boxH - 14);
		drawSignatureBlock(marginX + sigColW, 'pencil', 'EL EMISOR');

		y += boxH + 20;
	}

	// ============================================================
	// FOOTER — disclaimer + folio/generado + marca
	// ============================================================
	const pageHeight = doc.internal.pageSize.getHeight();
	const footerY = Math.max(y, pageHeight - 70);

	drawIconBadge(doc, { x: marginX, y: footerY - 10, size: 14, icon: 'shield', badgeColor: '#EDEDEE', iconColor: MUTED });
	doc.setFont('helvetica', 'italic');
	doc.setFontSize(7);
	doc.setTextColor(MUTED);
	const disclaimer = doc.splitTextToSize(
		'Esta cotización representa una propuesta comercial y no constituye por sí misma un comprobante fiscal ni genera obligación de pago.',
		contentWidth * 0.62
	);
	doc.text(disclaimer, marginX + 20, footerY - 4);

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(7);
	doc.setTextColor(MUTED);
	doc.text(
		`Folio: ${folio}   |   Generado el ${formatShortDate(now)} a las ${formatTime(now)}`,
		rightEdge,
		footerY - 4,
		{ align: 'right' }
	);

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(7.5);
	doc.setTextColor(HEART);
	doc.text('HECHO CON YOAMOCOTIZAR.COM', pageWidth / 2, pageHeight - 22, { align: 'center' });

	const blob = doc.output('blob');
	return { blob, filename: `${folio}.pdf` };
}
