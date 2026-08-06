import { createDocFlow } from '$lib/docs/engine/createDocFlow.js';
import { makeEmpresa, makePersona, makePeriodo, makeConcepto } from '$lib/docs/shared/schema.js';

export const STEPS = [
	'patron',
	'trabajador',
	'periodo',
	'percepciones',
	'deducciones',
	'formaPago',
	'firmas',
	'preview',
	'generado'
];

function emptyState() {
	return {
		screen: STEPS[0],
		patron: makeEmpresa(),
		trabajador: makePersona(),
		periodo: makePeriodo(),
		percepciones: [makeConcepto({ tipo: 'salario', nombre: 'Salario' })],
		deducciones: [makeConcepto({ tipo: 'otros', nombre: '' })],
		formaPago: '',
		firmas: { incluir: true },
		folio: '',
		generatedAt: null
	};
}

// A single flow instance is enough — this app has no accounts, so there's
// only ever one "current" recibo de nómina in progress per browser.
export const nominaFlow = createDocFlow({
	id: 'recibo-nomina',
	steps: STEPS,
	emptyState
});
