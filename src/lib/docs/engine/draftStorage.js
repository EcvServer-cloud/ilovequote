// Persistence for the /docs ecosystem. Fully separate from cotización's
// localStorage key (see src/lib/utils/storage.js, which is untouched).
// Each document type gets its own key: docs:draft:<documentId>
// so a draft recibo-de-nomina never collides with a draft constancia-laboral, etc.

const hasStorage = () => typeof window !== 'undefined' && 'localStorage' in window;

export function draftKeyFor(documentId) {
	return `docs:draft:${documentId}`;
}

export function loadDraft(key) {
	if (!hasStorage()) return null;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function saveDraft(key, state) {
	if (!hasStorage()) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(state));
	} catch {
		// Storage full / private mode — worst case the draft isn't recovered later.
	}
}

export function clearDraft(key) {
	if (!hasStorage()) return;
	try {
		window.localStorage.removeItem(key);
	} catch {
		// no-op
	}
}
