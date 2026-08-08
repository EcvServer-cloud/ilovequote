// Reusable building blocks for document data models. A specific document
// (e.g. Recibo de Nómina) composes its emptyState() out of these — it does
// not need to redefine "what an Empresa looks like" from scratch.

function uid() {
	return crypto.randomUUID();
}

export function makeEmpresa(overrides = {}) {
	return {
		nombre: '',
		razonSocial: '',
		rfc: '',
		domicilio: '',
		telefono: '',
		correo: '',
		logo: '', // data URL, same pattern as business.logo in cotización
		...overrides
	};
}

export function makePersona(overrides = {}) {
	return {
		nombre: '',
		curp: '',
		rfc: '',
		nss: '',
		puesto: '',
		...overrides
	};
}

export function makePeriodo(overrides = {}) {
	return {
		fechaInicio: '',
		fechaFin: '',
		fechaPago: '',
		periodicidad: '', // 'semanal' | 'quincenal' | 'mensual' | ...
		ejercicio: '', // año fiscal, ej. "2026"
		...overrides
	};
}

/**
 * A single line item used in any concept list (percepciones, deducciones,
 * and future equivalents in other document categories).
 */
export function makeConcepto(overrides = {}) {
	return {
		id: uid(),
		tipo: overrides.tipo ?? '', // e.g. 'salario', 'isr' — free-form per document
		nombre: '',
		monto: 0,
		...overrides
	};
}

export function sumConceptos(list = []) {
	return (list ?? []).reduce((sum, c) => sum + (Number(c.monto) || 0), 0);
}

export function formatCurrency(value, currency = 'MXN') {
	const n = Number(value) || 0;
	return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(n);
}
