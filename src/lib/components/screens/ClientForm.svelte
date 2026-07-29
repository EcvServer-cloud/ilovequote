<script>
	import { quote, STEPS } from '$lib/stores/quote.js';
	import Input from '$lib/components/Input.svelte';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';

	$: isDetailed = $quote.type === 'detailed';
	$: canContinue = $quote.client.name.trim().length > 0;
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-8">
	<ProgressIndicator steps={STEPS.slice(1, -1)} current={$quote.screen} />

	<div class="mt-6 animate-slide-in">
		<h1 class="font-display text-xl font-bold text-ink">Datos del cliente</h1>
		<p class="mt-1 text-sm text-muted">¿Para quién es esta cotización?</p>

		<div class="mt-6 flex flex-col gap-4">
			<Input label="Nombre del cliente" bind:value={$quote.client.name} placeholder="Ej. María López" required />
			<Input label="Teléfono" type="tel" bind:value={$quote.client.phone} placeholder="Opcional" />
			<Input label="Correo" type="email" bind:value={$quote.client.email} placeholder="Opcional" />
			<Input label="Dirección" bind:value={$quote.client.address} placeholder="Opcional" />
			{#if isDetailed}
				<Input label="RFC / datos fiscales del cliente" bind:value={$quote.client.taxId} placeholder="Opcional" />
			{/if}
		</div>
	</div>

	<div class="mt-8 flex flex-col gap-3">
		<button class="btn-primary" disabled={!canContinue} on:click={() => quote.next()}>
			Continuar
		</button>
		<button class="btn-ghost mx-auto" on:click={() => quote.back()}>← Volver</button>
	</div>
</div>
