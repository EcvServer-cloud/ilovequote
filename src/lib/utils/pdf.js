import { computeTotals, itemTotal, formatCurrency } from './calculations.js';

const INK = '#111111';
const MUTED = '#6B7280';
const HEART = '#E11D2E';
const BORDER = '#E7E7EA';

function formatDate(date = new Date()) {
	return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

/**
 * Builds the quotation PDF and returns a Blob + suggested filename.
 * Only imports jsPDF on demand (client-side), keeping the initial bundle small.
 */
export async function buildQuotePdf(state) {
	const [{ default: jsPDF }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);

	const doc = new jsPDF({ unit: 'pt', format: 'letter' });
	const pageWidth = doc.internal.pageSize.getWidth();
	const marginX = 48;
	let y = 56;

	const { business, client, items, discount, tax, meta, type, folio } = state;
	const totals = computeTotals(items, discount, tax);
	const isDetailed = type === 'detailed';

	// --- Header: logo + business identity --------------------------------
	if (business.logo) {
		try {
			const props = doc.getImageProperties(business.logo);
			const h = 42;
			const w = (props.width / props.height) * h;
			doc.addImage(business.logo, props.fileType, marginX, y - 8, w, h);
		} catch {
			// If the logo can't be decoded, skip it silently rather than break the PDF.
		}
	}

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(18);
	doc.setTextColor(INK);
	doc.text(business.name || 'Cotización', pageWidth - marginX, y + 4, { align: 'right' });

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9.5);
	doc.setTextColor(MUTED);
	const contactLines = [business.phone, business.email, business.address].filter(Boolean);
	let cy = y + 18;
	for (const line of contactLines) {
		doc.text(line, pageWidth - marginX, cy, { align: 'right' });
		cy += 12;
	}
	if (isDetailed && business.taxId) {
		doc.text(`RFC: ${business.taxId}`, pageWidth - marginX, cy, { align: 'right' });
		cy += 12;
	}

	y = Math.max(y + 46, cy + 6);

	doc.setDrawColor(BORDER);
	doc.line(marginX, y, pageWidth - marginX, y);
	y += 22;

	// --- Folio / fecha / vigencia -----------------------------------------
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(11);
	doc.setTextColor(HEART);
	doc.text(`Cotización ${folio}`, marginX, y);

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9.5);
	doc.setTextColor(MUTED);
	const rightMeta = [`Fecha: ${formatDate(new Date())}`];
	if (meta.validity) rightMeta.push(`Vigencia: ${meta.validity}`);
	doc.text(rightMeta.join('   •   '), pageWidth - marginX, y, { align: 'right' });
	y += 24;

	// --- Cliente ------------------------------------------------------------
	if (client.name || client.phone || client.email || client.address) {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(10);
		doc.setTextColor(INK);
		doc.text('Cliente', marginX, y);
		y += 14;
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(9.5);
		doc.setTextColor(MUTED);
		const clientLines = [client.name, client.phone, client.email, client.address].filter(Boolean);
		if (isDetailed && client.taxId) clientLines.push(`RFC: ${client.taxId}`);
		for (const line of clientLines) {
			doc.text(line, marginX, y);
			y += 13;
		}
		y += 10;
	}

	// --- Tabla de productos/servicios --------------------------------------
	const rows = items
		.filter((it) => it.description?.trim())
		.map((it) => [
			it.description,
			String(it.qty),
			formatCurrency(it.price),
			formatCurrency(itemTotal(it))
		]);

	doc.autoTable({
		startY: y,
		margin: { left: marginX, right: marginX },
		head: [['Descripción', 'Cant.', 'Precio unitario', 'Total']],
		body: rows,
		styles: { font: 'helvetica', fontSize: 9.5, textColor: INK, cellPadding: 8 },
		headStyles: { fillColor: [17, 17, 17], textColor: [255, 255, 255], fontStyle: 'bold' },
		alternateRowStyles: { fillColor: [247, 247, 248] },
		columnStyles: {
			1: { halign: 'center', cellWidth: 50 },
			2: { halign: 'right', cellWidth: 100 },
			3: { halign: 'right', cellWidth: 100 }
		}
	});

	y = doc.lastAutoTable.finalY + 18;

	// --- Totales -------------------------------------------------------------
	const totalsX = pageWidth - marginX - 200;
	const line = (label, value, opts = {}) => {
		doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
		doc.setFontSize(opts.bold ? 12 : 9.5);
		doc.setTextColor(opts.bold ? INK : MUTED);
		doc.text(label, totalsX, y);
		doc.text(value, pageWidth - marginX, y, { align: 'right' });
		y += opts.bold ? 20 : 14;
	};

	line('Subtotal', formatCurrency(totals.subtotal));
	if (discount?.enabled && totals.discountAmount > 0) {
		const label =
			discount.type === 'percent' ? `Descuento (${discount.value}%)` : 'Descuento';
		line(label, `-${formatCurrency(totals.discountAmount)}`);
	}
	if (tax?.enabled && totals.taxAmount > 0) {
		line(`Impuestos (${tax.rate}%)`, formatCurrency(totals.taxAmount));
	}
	doc.setDrawColor(BORDER);
	doc.line(totalsX, y - 4, pageWidth - marginX, y - 4);
	y += 8;
	line('Total', formatCurrency(totals.total), { bold: true });
	y += 12;

	// --- Detailed-only sections ------------------------------------------
	if (isDetailed) {
		const detailFields = [
			['Forma de pago', meta.paymentMethod],
			['Anticipo', meta.deposit],
			['Tiempo de entrega', meta.deliveryTime],
			['Condiciones', meta.conditions]
		].filter(([, v]) => v);

		if (detailFields.length) {
			y += 6;
			doc.setDrawColor(BORDER);
			doc.line(marginX, y, pageWidth - marginX, y);
			y += 20;
			for (const [label, value] of detailFields) {
				doc.setFont('helvetica', 'bold');
				doc.setFontSize(9.5);
				doc.setTextColor(INK);
				doc.text(`${label}:`, marginX, y);
				doc.setFont('helvetica', 'normal');
				doc.setTextColor(MUTED);
				doc.text(String(value), marginX + 110, y);
				y += 15;
			}
		}

		if (meta.bankDetails) {
			y += 6;
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(9.5);
			doc.setTextColor(INK);
			doc.text('Datos bancarios', marginX, y);
			y += 13;
			doc.setFont('helvetica', 'normal');
			doc.setTextColor(MUTED);
			const bankLines = doc.splitTextToSize(meta.bankDetails, pageWidth - marginX * 2);
			doc.text(bankLines, marginX, y);
			y += bankLines.length * 12 + 8;
		}

		if (meta.terms) {
			y += 6;
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(9.5);
			doc.setTextColor(INK);
			doc.text('Términos y condiciones', marginX, y);
			y += 13;
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(8.5);
			doc.setTextColor(MUTED);
			const termsLines = doc.splitTextToSize(meta.terms, pageWidth - marginX * 2);
			doc.text(termsLines, marginX, y);
			y += termsLines.length * 11 + 8;
		}

		if (meta.hasSignature) {
			y += 24;
			doc.setDrawColor(INK);
			doc.line(marginX, y, marginX + 200, y);
			doc.setFontSize(8.5);
			doc.setTextColor(MUTED);
			doc.text('Firma', marginX, y + 14);
		}
	}

	if (meta.notes && !isDetailed) {
		y += 10;
		doc.setFont('helvetica', 'italic');
		doc.setFontSize(9);
		doc.setTextColor(MUTED);
		const notesLines = doc.splitTextToSize(meta.notes, pageWidth - marginX * 2);
		doc.text(notesLines, marginX, y);
	} else if (meta.notes && isDetailed) {
		y += 10;
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(9.5);
		doc.setTextColor(INK);
		doc.text('Notas', marginX, y);
		y += 13;
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(9);
		doc.setTextColor(MUTED);
		const notesLines = doc.splitTextToSize(meta.notes, pageWidth - marginX * 2);
		doc.text(notesLines, marginX, y);
	}

	// --- Footer / brand watermark ------------------------------------------
	const pageCount = doc.internal.getNumberOfPages();
	for (let p = 1; p <= pageCount; p++) {
		doc.setPage(p);
		const pageHeight = doc.internal.pageSize.getHeight();
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8);
		doc.setTextColor('#B3B3B6');
		doc.text('Creado con YoAmoCotizar.com', pageWidth / 2, pageHeight - 24, { align: 'center' });
	}

	const blob = doc.output('blob');
	return { blob, filename: `${folio}.pdf` };
}
