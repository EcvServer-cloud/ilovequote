// Spanish "amount in words" formatter for cotización, e.g.
// 3885.84 -> "TRES MIL OCHOCIENTOS OCHENTA Y CINCO PESOS 84/100 M.N."
//
// This is intentionally a local copy for cotización rather than an import
// from src/lib/docs/shared/numberToWords.js — the two modules stay
// independent by design (see src/lib/docs/NOTES.md).

const UNIDADES = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
const DECENAS = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
const DECENAS_DEC = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
const CENTENAS = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

function chunkToWords(n) {
	if (n === 0) return '';
	if (n === 100) return 'CIEN';

	let words = '';
	const c = Math.floor(n / 100);
	const rest = n % 100;

	if (c > 0) words += CENTENAS[c] + ' ';

	if (rest >= 10 && rest < 20) {
		words += DECENAS[rest - 10];
	} else {
		const d = Math.floor(rest / 10);
		const u = rest % 10;
		if (d > 0) {
			words += DECENAS_DEC[d];
			if (u > 0) words += ' Y ' + UNIDADES[u];
		} else if (u > 0) {
			words += UNIDADES[u];
		}
	}
	return words.trim();
}

function fixVeintis(words) {
	return words.replace(/VEINTE Y (\w+)/g, (_, u) => {
		const map = { UN: 'VEINTIÚN', DOS: 'VEINTIDÓS', TRES: 'VEINTITRÉS', CUATRO: 'VEINTICUATRO', CINCO: 'VEINTICINCO', SEIS: 'VEINTISÉIS', SIETE: 'VEINTISIETE', OCHO: 'VEINTIOCHO', NUEVE: 'VEINTINUEVE' };
		return map[u] || `VEINTE Y ${u}`;
	});
}

function integerToWords(n) {
	if (n === 0) return 'CERO';

	const millones = Math.floor(n / 1_000_000);
	const miles = Math.floor((n % 1_000_000) / 1000);
	const resto = n % 1000;

	let parts = [];
	if (millones > 0) {
		parts.push(millones === 1 ? 'UN MILLÓN' : `${fixVeintis(chunkToWords(millones))} MILLONES`);
	}
	if (miles > 0) {
		parts.push(miles === 1 ? 'MIL' : `${fixVeintis(chunkToWords(miles))} MIL`);
	}
	if (resto > 0) {
		parts.push(fixVeintis(chunkToWords(resto)));
	}
	return parts.join(' ').trim();
}

/**
 * Converts a monetary amount to its written Spanish form.
 * amountToWords(3885.84) -> "TRES MIL OCHOCIENTOS OCHENTA Y CINCO PESOS 84/100 M.N."
 */
export function amountToWords(value, { currencyLabel = 'PESOS', suffix = 'M.N.' } = {}) {
	const n = Math.max(0, Number(value) || 0);
	const whole = Math.floor(n);
	const cents = Math.round((n - whole) * 100);
	const wholeWords = integerToWords(whole);
	const centsStr = String(cents).padStart(2, '0');
	return `${wholeWords} ${currencyLabel} ${centsStr}/100 ${suffix}`.trim();
}
