<script>
	import { base } from '$app/paths';
	import Logo from '$lib/components/Logo.svelte';
	import CategoryCard from '$lib/docs/shared/components/CategoryCard.svelte';

	const categories = [
		{
			icon: '🧾',
			title: 'Recursos Humanos',
			description: 'Recibos de nómina, constancias, finiquitos y más.',
			badge: 'Próximamente',
			disabled: true
		},
		{
			icon: '💼',
			title: 'Ventas',
			description: 'Documentos comerciales para tu negocio.',
			badge: 'Próximamente',
			disabled: true
		},
		{
			icon: '🗂️',
			title: 'Administrativo',
			description: 'Documentos internos y de operación.',
			badge: 'Próximamente',
			disabled: true
		}
	];
</script>

<svelte:head>
	<title>Documentos — Yo Amo Cotizar</title>
</svelte:head>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-12">
	<div class="animate-fade-up text-center">
		<Logo size="md" />
		<h1 class="mt-6 font-display text-2xl font-bold text-ink">Documentos</h1>
		<p class="mt-2 text-sm text-muted">
			Elige el tipo de documento que quieres generar. Mismo lugar, mismos pasos sencillos.
		</p>
	</div>

	<div class="mt-8 flex flex-col gap-4">
		{#each categories as cat}
			<CategoryCard
				icon={cat.icon}
				title={cat.title}
				description={cat.description}
				badge={cat.badge}
				disabled={cat.disabled}
			/>
		{/each}
	</div>

	<a href="{base}/" class="btn-ghost mx-auto mt-10 text-xs">← Volver a iLoveQuote</a>
</div>
