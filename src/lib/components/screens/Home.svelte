<script>
	import { base } from '$app/paths';
	import Logo from '$lib/components/Logo.svelte';
	import { quote } from '$lib/stores/quote.js';
</script>
<div class="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-12 text-center">
	<div class="animate-fade-up">
		<Logo size="lg" animated />
		<h1 class="mx-auto mt-6 max-w-xs font-display text-2xl font-bold leading-snug text-ink sm:max-w-sm sm:text-3xl">
			Crea cotizaciones profesionales en minutos.
		</h1>
		<p class="mx-auto mt-3 max-w-xs text-muted sm:max-w-sm">
			Gratis, sin registro y directamente desde tu navegador.
		</p>
		<div class="mx-auto mt-8 flex flex-col items-center gap-3">
			<button class="btn-primary px-10" on:click={() => quote.go('quoteType')}>
				<span class="text-lg leading-none">+</span> Crear cotización
			</button>
			<a href="{base}/docs/rh" class="btn-secondary px-10">
				📄 Otros documentos
			</a>
		</div>
		<p class="mx-auto mt-8 max-w-xs text-xs leading-relaxed text-muted/80 sm:max-w-sm">
			🔒 Tus datos permanecen en tu dispositivo. YO❤️COTIZAR no almacena tus cotizaciones.
		</p>
	</div>
</div>
