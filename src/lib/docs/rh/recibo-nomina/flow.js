import { createDocFlow } from '$lib/docs/engine/createDocFlow.js';
import { makeEmpresa, makePersona, makePeriodo, makeConcepto } from '$lib/docs/shared/schema.js';

// Internamente seguimos llamando a la carpeta/ruta "recibo-nomina" (ver
// NOTES.md), pero el documento ahora se presenta al usuario como
// "Comprobante de pago".
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
		percepciones: [makeConcepto({ tipo: 'percepcion', nombre: 'Salario' })],
		deducciones: [makeConcepto({ tipo: 'deduccion', nombre: '' })],
		retenciones: 0, // monto único, aparte de la tabla de deducciones
		formaPago: '',
		notas: '',
		firmas: { incluir: true },
		folio: '',
		generatedAt: null
	};
}

// Nota: cambiamos el id a 'comprobante-pago' (antes 'recibo-nomina'), lo que
// mueve la clave de borrador en localStorage a docs:draft:comprobante-pago.
// Cualquier borrador viejo bajo el id anterior simplemente queda huérfano —
// no rompe nada, solo ya no se recupera (aceptable, la función es nueva).
export const nominaFlow = createDocFlow({
	id: 'comprobante-pago',
	steps: STEPS,
	emptyState
});
