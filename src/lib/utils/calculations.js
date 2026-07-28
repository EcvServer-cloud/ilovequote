/** Total for a single line item. */
export function itemTotal(item) {
	const qty = Number(item?.qty) || 0;
	const price = Number(item?.price) || 0;
	return qty * price;
}

/** Sum of every line item's total. */
export function subtotalOf(items = []) {
	return items.reduce((sum, item) => sum + itemTotal(item), 0);
}

/**
 * Computes the full breakdown for a quote: subtotal, discount, tax and final total.
 * discount: { enabled, type: 'percent' | 'amount', value }
 * tax: { enabled, rate } — rate as a percentage, e.g. 16 for 16%
 */
export function computeTotals(items = [], discount = {}, tax = {}) {
	const subtotal = subtotalOf(items);

	let discountAmount = 0;
	if (discount?.enabled && Number(discount.value) > 0) {
		discountAmount =
			discount.type === 'percent'
				? subtotal * (Number(discount.value) / 100)
				: Number(discount.value);
	}
	discountAmount = Math.min(discountAmount, subtotal);

	const taxableBase = subtotal - discountAmount;

	let taxAmount = 0;
	if (tax?.enabled && Number(tax.rate) > 0) {
		taxAmount = taxableBase * (Number(tax.rate) / 100);
	}

	const total = taxableBase + taxAmount;

	return { subtotal, discountAmount, taxAmount, total };
}

/** Formats a number as MXN currency (adjust locale/currency if needed). */
export function formatCurrency(value, currency = 'MXN') {
	const n = Number(value) || 0;
	return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(n);
}
