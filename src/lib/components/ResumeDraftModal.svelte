<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center" role="dialog" aria-modal="true">
	<div class="w-full max-w-sm animate-fade-up rounded-xl2 bg-paper p-6 text-center shadow-soft">
		<p class="text-2xl">👋</p>
		<p class="mt-2 font-display text-lg font-semibold text-ink">
			Encontramos una cotización en progreso.
		</p>
		<p class="mt-1 text-sm text-muted">¿Qué te gustaría hacer?</p>
		<div class="mt-5 flex flex-col gap-2.5">
			<button class="btn-primary" on:click={() => dispatch('resume')}>
				Continuar donde lo dejaste
			</button>
			<button class="btn-secondary" on:click={() => dispatch('discard')}>
				Empezar una nueva
			</button>
		</div>
	</div>
</div>
