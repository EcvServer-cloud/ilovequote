<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Logo from '$lib/components/Logo.svelte';
	import DocumentCard from '$lib/docs/shared/components/DocumentCard.svelte';

	const documentos = [
		{
			title: 'Comprobante de pago',
			description: 'Percepciones, deducciones y neto a pagar.',
			href: `${base}/docs/rh/recibo-nomina`,
			disabled: false
		},
		{
			title: 'Constancia laboral',
			description: 'Redacción automática, folio y firma.',
			href: `${base}/docs/rh/constancia-laboral`,
			disabled: false
		},
		{ title: 'Aguinaldo', description: 'Próximamente', disabled: true },
		{ title: 'Vacaciones', description: 'Próximamente', disabled: true },
		{ title: 'Finiquito', description: 'Próximamente', disabled: true },
		{ title: 'Liquidación', description: 'Próximamente', disabled: true }
	];

	function open(doc) {
		if (doc.disabled) return;
		goto(doc.href);
	}
</script>

<svelte:head>
	<title>Recursos Humanos — Documentos</title>
</svelte:head>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-12">
	<div class="animate-fade-up text-center">
		<Logo size="md" />
		<h1 class="mt-6 font-display text-2xl font-bold text-ink">Recursos Humanos</h1>
		<p class="mt-2 text-sm text-muted">Elige el documento que quieres generar.</p>
	</div>

	<div class="mt-8 flex flex-col gap-3">
		{#each documentos as doc}
			<DocumentCard
				title={doc.title}
				description={doc.description}
				disabled={doc.disabled}
				on:click={() => open(doc)}
			/>
		{/each}
	</div>

	<a href="{base}/docs" class="btn-ghost mx-auto mt-10 text-xs">← Volver a Documentos</a>
</div>
