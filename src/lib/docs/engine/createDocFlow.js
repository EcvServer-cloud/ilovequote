import { writable, get } from 'svelte/store';
import { draftKeyFor, loadDraft, saveDraft, clearDraft } from './draftStorage.js';

/**
 * Creates a self-contained step-flow store for one document type.
 *
 * A document only needs to provide:
 *  - id:         unique slug, e.g. 'recibo-nomina'  (used for the storage key)
 *  - steps:      ordered array of screen keys, e.g. ['select','empresa','trabajador',...,'generado']
 *  - emptyState: () => initial state object. Must include a `screen` field
 *                that starts as steps[0].
 *
 * Everything else (back/next navigation, draft save/resume, list-field
 * helpers for dynamic concept rows, reset) is generic and shared by every
 * document built on top of the engine.
 *
 * This mirrors the pattern already proven in src/lib/stores/quote.js, but
 * generalized — quote.js itself is untouched.
 */
export function createDocFlow({ id, steps, emptyState }) {
	if (!id) throw new Error('createDocFlow: "id" is required');
	if (!steps?.length) throw new Error('createDocFlow: "steps" must be a non-empty array');

	const draftKey = draftKeyFor(id);
	const firstStep = steps[0];
	const lastStep = steps[steps.length - 1];

	const { subscribe, set, update } = writable(emptyState());

	const draftAvailable = writable(false);
	const draftChecked = writable(false);

	const flow = {
		subscribe,
		set,
		update,

		steps,
		firstStep,
		lastStep,

		go(screen) {
			update((s) => ({ ...s, screen }));
		},
		next() {
			update((s) => {
				const i = steps.indexOf(s.screen);
				return { ...s, screen: steps[Math.min(i + 1, steps.length - 1)] };
			});
		},
		back() {
			update((s) => {
				const i = steps.indexOf(s.screen);
				return { ...s, screen: steps[Math.max(i - 1, 0)] };
			});
		},

		/** Appends an item to an array field, e.g. flow.addToList('percepciones', makeConcepto) */
		addToList(field, factory) {
			update((s) => ({ ...s, [field]: [...(s[field] ?? []), factory()] }));
		},
		/** Removes an item (matched by .id) from an array field, unless it's the last one. */
		removeFromList(field, itemId, { keepAtLeastOne = true } = {}) {
			update((s) => {
				const list = s[field] ?? [];
				if (keepAtLeastOne && list.length <= 1) return s;
				return { ...s, [field]: list.filter((item) => item.id !== itemId) };
			});
		},

		reset() {
			clearDraft(draftKey);
			set(emptyState());
		},

		getState() {
			return get({ subscribe });
		}
	};

	function checkForDraft() {
		const draft = loadDraft(draftKey);
		const inProgress = draft && draft.screen && draft.screen !== firstStep && draft.screen !== lastStep;
		draftAvailable.set(Boolean(inProgress));
		draftChecked.set(true);
	}

	function resumeDraft() {
		const draft = loadDraft(draftKey);
		if (draft) set(draft);
		draftAvailable.set(false);
	}

	function discardDraft() {
		clearDraft(draftKey);
		set(emptyState());
		draftAvailable.set(false);
	}

	let persistenceStarted = false;
	/** Call once, client-side, after the initial draft prompt has been resolved. */
	function startPersisting() {
		if (persistenceStarted) return;
		persistenceStarted = true;
		subscribe((state) => {
			// Never persist the landing screen or a finished/generated document as
			// "in progress" — those shouldn't trigger a resume prompt later.
			if (state.screen === firstStep || state.screen === lastStep) return;
			saveDraft(draftKey, state);
		});
	}

	return {
		...flow,
		draftAvailable,
		draftChecked,
		checkForDraft,
		resumeDraft,
		discardDraft,
		startPersisting
	};
}
