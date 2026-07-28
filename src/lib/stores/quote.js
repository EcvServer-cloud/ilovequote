import { writable, get } from 'svelte/store';
import { loadDraft, saveDraft, clearDraft } from '$lib/utils/storage.js';

// Order matters — used for back/forward + progress indicator.
export const STEPS = ['home', 'quoteType', 'business', 'client', 'items', 'options', 'preview', 'generated'];

export function emptyState() {
	return {
		screen: 'home',
		type: 'quick', // 'quick' | 'detailed'
		business: {
			name: '',
			logo: '', // data URL
			phone: '',
			email: '',
			address: '',
			taxId: '' // detailed only
		},
		client: {
			name: '',
			phone: '',
			email: '',
			address: '',
			taxId: '' // detailed only
		},
		items: [{ id: crypto.randomUUID(), description: '', qty: 1, price: 0 }],
		discount: { enabled: false, type: 'percent', value: 0 },
		tax: { enabled: false, rate: 16 },
		meta: {
			validity: '', // e.g. "15 días"
			notes: '',
			paymentMethod: '',
			deposit: '',
			deliveryTime: '',
			conditions: '',
			terms: '',
			bankDetails: '',
			hasSignature: false
		},
		folio: '',
		generatedAt: null
	};
}

function createQuoteStore() {
	const { subscribe, set, update } = writable(emptyState());

	return {
		subscribe,
		set,
		update,
		go(screen) {
			update((s) => ({ ...s, screen }));
		},
		next() {
			update((s) => {
				const i = STEPS.indexOf(s.screen);
				return { ...s, screen: STEPS[Math.min(i + 1, STEPS.length - 1)] };
			});
		},
		back() {
			update((s) => {
				const i = STEPS.indexOf(s.screen);
				return { ...s, screen: STEPS[Math.max(i - 1, 0)] };
			});
		},
		setType(type) {
			update((s) => ({ ...s, type }));
		},
		addItem() {
			update((s) => ({
				...s,
				items: [...s.items, { id: crypto.randomUUID(), description: '', qty: 1, price: 0 }]
			}));
		},
		removeItem(id) {
			update((s) => ({
				...s,
				items: s.items.length > 1 ? s.items.filter((it) => it.id !== id) : s.items
			}));
		},
		reset() {
			clearDraft();
			set(emptyState());
		}
	};
}

export const quote = createQuoteStore();

// --- Draft persistence -----------------------------------------------------
// UI state so the layout can offer "continue where you left off".
export const draftAvailable = writable(false);
export const draftChecked = writable(false);

export function checkForDraft() {
	const draft = loadDraft();
	if (draft && draft.screen && draft.screen !== 'home' && draft.screen !== 'generated') {
		draftAvailable.set(true);
	}
	draftChecked.set(true);
}

export function resumeDraft() {
	const draft = loadDraft();
	if (draft) quote.set(draft);
	draftAvailable.set(false);
}

export function discardDraft() {
	clearDraft();
	quote.set(emptyState());
	draftAvailable.set(false);
}

let persistenceStarted = false;
/** Call once, from the browser, after the initial draft prompt has been resolved. */
export function startPersisting() {
	if (persistenceStarted) return;
	persistenceStarted = true;
	quote.subscribe((state) => {
		// Never persist a finished quote as a "draft in progress".
		if (state.screen === 'home' || state.screen === 'generated') return;
		saveDraft(state);
	});
}

export function getQuote() {
	return get(quote);
}
