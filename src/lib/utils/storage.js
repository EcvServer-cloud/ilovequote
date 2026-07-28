const DRAFT_KEY = 'ilovequote:draft';

const hasStorage = () => typeof window !== 'undefined' && 'localStorage' in window;

/** Read the saved draft, if any. Never throws. */
export function loadDraft() {
	if (!hasStorage()) return null;
	try {
		const raw = window.localStorage.getItem(DRAFT_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

/** Persist the current draft. Never throws (e.g. storage full / private mode). */
export function saveDraft(state) {
	if (!hasStorage()) return;
	try {
		window.localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
	} catch {
		// Silently ignore — worst case the draft just isn't recovered later.
	}
}

/** Remove the saved draft completely. */
export function clearDraft() {
	if (!hasStorage()) return;
	try {
		window.localStorage.removeItem(DRAFT_KEY);
	} catch {
		// no-op
	}
}
