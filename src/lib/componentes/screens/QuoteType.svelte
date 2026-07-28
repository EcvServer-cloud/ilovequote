<script>
	import { quote } from '$lib/stores/quote.js';

	function choose(type) {
		quote.setType(type);
		quote.next();
	}
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-12">
	<div class="animate-fade-up text-center">
		<h1 class="font-display text-2xl font-bold text-ink">¿Qué tipo de cotización necesitas?</h1>
		<p class="mt-2 text-sm text-muted">Ambas opciones son gratuitas. Puedes cambiar después.</p>
	</div>

	<div class="mt-8 flex flex-col gap-4">
		<button
			class="card flex items-start gap-4 text-left transition hover:border-quick hover:shadow-soft active:scale-[0.99]"
			on:click={() => choose('quick')}
		>
			<span class="text-2xl">🟢</span>
			<span>
				<span class="block font-display font-semibold text-ink">Cotización rápida</span>
				<span class="mt-1 block text-sm text-muted">
					Crea y comparte una cotización en pocos pasos.
				</span>
			</span>
		</button>

		<button
			class="card flex items-start gap-4 text-left transition hover:border-detailed hover:shadow-soft active:scale-[0.99]"
			on:click={() => choose('detailed')}
		>
			<span class="text-2xl">🟡</span>
			<span>
				<span class="block font-display font-semibold text-ink">Cotización detallada</span>
				<span class="mt-1 block text-sm text-muted">
					Incluye información adicional para presentar una propuesta completa.
				</span>
			</span>
		</button>
	</div>

	<button class="btn-ghost mx-auto mt-8" on:click={() => quote.back()}> ← Volver </button>
</div>
