// Motor de redacción automática de la Constancia Laboral.
// Regla de oro (pedida explícitamente): nunca se arma una oración con un
// dato vacío — cada oración condicional solo se agrega si TODOS los datos
// que necesita están presentes.

import { amountToWords } from '$lib/docs/shared/numberToWords.js';
import { formatCurrency } from '$lib/docs/shared/schema.js';
import { formatDate } from '$lib/docs/shared/pdfKit.js';

const FINALIDAD_LABELS = {
	tramite_bancario: 'trámite bancario',
	solicitud_credito: 'solicitud de crédito',
	arrendamiento: 'trámite de arrendamiento',
	tramite_administrativo: 'trámite administrativo',
	comprobacion_empleo: 'comprobación de empleo',
	comprobacion_ingresos: 'comprobación de ingresos'
};

/** "A QUIEN CORRESPONDA:" o el nombre de la institución específica. */
export function buildDestinatarioLine(destinatario) {
	if (destinatario?.tipo === 'especifico' && destinatario.institucion?.trim()) {
		return `${destinatario.institucion.trim().toUpperCase()}:`;
	}
	return 'A QUIEN CORRESPONDA:';
}

function contratoTexto(relacion) {
	if (!relacion?.tipoContrato) return '';
	if (relacion.tipoContrato === 'No especificar') return '';
	if (relacion.tipoContrato === 'Otro') return relacion.tipoContratoOtro?.trim() || '';
	return relacion.tipoContrato;
}

function periodicidadTexto(salario) {
	if (salario?.periodicidad === 'Otra') return salario.periodicidadOtra?.trim() || '';
	return salario?.periodicidad || '';
}

/**
 * Devuelve los párrafos del cuerpo de la constancia, ya listos para
 * imprimirse uno tras otro. Cada párrafo se omite por completo si le falta
 * información — nunca se genera una oración con un hueco vacío.
 */
export function buildParrafos(state) {
	const { empresa, trabajador, relacion, salario, finalidad } = state;
	const parrafos = [];

	// Párrafo base — siempre presente si hay los datos mínimos.
	if (trabajador?.nombre && empresa?.nombre && relacion?.fechaIngreso && trabajador?.puesto) {
		const areaClause = trabajador.departamento?.trim() ? ` en el área de ${trabajador.departamento.trim()}` : '';
		parrafos.push(
			`Por medio de la presente, se hace constar que el(la) C. ${trabajador.nombre.trim()}, presta sus servicios para ${empresa.nombre.trim()} desde el ${formatDate(new Date(relacion.fechaIngreso + 'T00:00:00'))}, desempeñando actualmente el puesto de ${trabajador.puesto.trim()}${areaClause}.`
		);
	}

	// Salario — solo si está activado y hay monto + periodicidad.
	if (salario?.incluir && Number(salario.monto) > 0) {
		const periodicidad = periodicidadTexto(salario);
		if (periodicidad) {
			parrafos.push(
				`Asimismo, se hace constar que actualmente percibe un salario ${periodicidad.toLowerCase()} bruto de ${formatCurrency(salario.monto)} (${amountToWords(salario.monto)}).`
			);
		}
	}

	// Tipo de contrato.
	const contrato = contratoTexto(relacion);
	if (contrato) {
		parrafos.push(`La relación laboral es de carácter ${contrato.toLowerCase()}.`);
	}

	// Periodo, solo si ya no labora y hay fecha de término.
	if (relacion?.estado === 'terminado' && relacion.fechaTermino) {
		parrafos.push(
			`La relación laboral comprendió el periodo del ${formatDate(new Date(relacion.fechaIngreso + 'T00:00:00'))} al ${formatDate(new Date(relacion.fechaTermino + 'T00:00:00'))}.`
		);
	}

	// Cláusula de cierre según la finalidad.
	const finalidadLabel = finalidad?.tipo === 'otro' ? finalidad.otro?.trim() : FINALIDAD_LABELS[finalidad?.tipo];
	if (finalidadLabel) {
		parrafos.push(`Se expide la presente constancia para fines de ${finalidadLabel.toLowerCase()}.`);
	} else {
		parrafos.push('Se expide la presente constancia a petición del interesado y para los fines que a éste convengan.');
	}

	return parrafos;
}

/** "Reynosa, Tamaulipas, a 11 de agosto de 2026" (o solo la fecha si no hay lugar). */
export function buildLugarFecha(empresa, date = new Date()) {
	const lugar = empresa?.lugar?.trim();
	const fecha = formatDate(date);
	return lugar ? `${lugar}, a ${fecha}` : `A ${fecha}`;
}
