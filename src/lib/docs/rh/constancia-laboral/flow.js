import { createDocFlow } from '$lib/docs/engine/createDocFlow.js';
import { makeEmpresa, makePersona } from '$lib/docs/shared/schema.js';

export const STEPS = ['empresa', 'trabajador', 'relacion', 'salario', 'destinatario', 'firmante', 'preview', 'generado'];

function emptyState() {
	return {
		screen: STEPS[0],

		// Empresa: reutilizamos el builder genérico (nombre, RFC, domicilio,
		// teléfono, correo, logo). Igual que en recibo-nomina, solo exponemos
		// "nombre" en el formulario como el campo "Nombre / razón social".
		// "lugar" es nuevo: ciudad y estado para la línea de fecha de emisión
		// (no existía un campo de ubicación reutilizable en el motor).
		empresa: { ...makeEmpresa(), lugar: '' },

		// Trabajador: reutilizamos el builder genérico (incluye "nss", que a
		// propósito nunca se muestra en el formulario ni en el PDF de este
		// documento) y le agregamos número de empleado y departamento.
		trabajador: { ...makePersona(), numeroEmpleado: '', departamento: '' },

		relacion: {
			fechaIngreso: '',
			estado: 'activo', // 'activo' | 'terminado'
			fechaTermino: '',
			tipoContrato: '', // '' = no especificado
			tipoContratoOtro: ''
		},

		salario: {
			incluir: false,
			monto: 0,
			periodicidad: '',
			periodicidadOtra: ''
		},

		destinatario: {
			tipo: 'general', // 'general' | 'especifico'
			institucion: ''
		},

		finalidad: {
			tipo: 'no_especificar',
			otro: ''
		},

		firmante: {
			nombre: '',
			cargo: '',
			tipo: '',
			tipoOtro: '',
			incluirFirma: true
		},

		sello: {
			incluir: false,
			imagen: ''
		},

		folio: '',
		generatedAt: null
	};
}

export const constanciaFlow = createDocFlow({
	id: 'constancia-laboral',
	steps: STEPS,
	emptyState
});
