/**
 * Builds the initials used in the folio from a business name.
 * "Fletes y Mudanzas Galindo" -> "FYMG"
 * Short connector words are still included on purpose (spec example keeps "y" as "Y"),
 * so we simply take the first letter of every whitespace-separated word.
 */
function initialsFromName(name) {
	const cleaned = (name || '').trim();
	if (!cleaned) return 'ILQ';
	const letters = cleaned
		.split(/\s+/)
		.map((word) => word.replace(/[^\p{L}\p{N}]/gu, '').charAt(0))
		.filter(Boolean)
		.join('')
		.toUpperCase();
	return letters || 'ILQ';
}

function pad(n) {
	return String(n).padStart(2, '0');
}

/**
 * Generates a folio with the format SIGLAS-DDMMYY-HHMM using local device time.
 */
export function generateFolio(businessName, date = new Date()) {
	const siglas = initialsFromName(businessName);
	const dd = pad(date.getDate());
	const mm = pad(date.getMonth() + 1);
	const yy = pad(date.getFullYear() % 100);
	const hh = pad(date.getHours());
	const min = pad(date.getMinutes());
	return `${siglas}-${dd}${mm}${yy}-${hh}${min}`;
}
