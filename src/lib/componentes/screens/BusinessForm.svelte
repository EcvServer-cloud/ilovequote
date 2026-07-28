<script>
	import { quote, STEPS } from '$lib/stores/quote.js';
	import Input from '$lib/components/Input.svelte';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';

	$: isDetailed = $quote.type === 'detailed';
	$: canContinue = $quote.business.name.trim().length > 0;

	function handleLogo(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			quote.update((s) => ({ ...s, business: { ...s.business, logo: reader.result } }));
		};
		reader.readAsDataURL(file);
	}

	function removeLogo() {
		quote.update((s) => ({ ...s, business: { ...s.business, logo: '' } }));
	}
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-8">
	<ProgressIndicator steps={STEPS.slice(1, -1)} current={$quote.screen} />

	<div class="mt-6 animate-slide-in">
		<h1 class="font-display text-xl font-bold text-ink">Datos de tu negocio</h1>
		<p class="mt-1 text-sm text-muted">Así aparecerás ante tus clientes.</p>

		<div class="mt-6 flex items-center gap-4">
			<div
				class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface"
			>
				{#if $quote.business.logo}
					<img src={$quote.business.logo} alt="Logo del negocio" class="h-full w-full object-contain" />
				{:else}
					<span class="text-xl">🏢</span>
				{/if}
			</div>
			<div class="flex flex-col gap-1.5">
				<label class="btn-secondary cursor-pointer !px-4 !py-2 text-sm">
					{$quote.business.logo ? 'Cambiar logo' : 'Subir logo'}
					<input type="file" accept="image/*" class="hidden" on:change={handleLogo} />
				</label>
				{#if $quote.business.logo}
					<button class="btn-ghost text-xs" on:click={removeLogo}>Quitar logo</button>
				{/if}
			</div>
		</div>

		<div class="mt-6 flex flex-col gap-4">
			<Input label="Empresa / nombre comercial" bind:value={$quote.business.name} placeholder="Ej. Fletes y Mudanzas Galindo" required />
			<Input label="Teléfono" type="tel" bind:value={$quote.business.phone} placeholder="Ej. 33 1234 5678" />
			<Input label="Correo" type="email" bind:value={$quote.business.email} placeholder="contacto@negocio.com" />
			<Input label="Dirección" bind:value={$quote.business.address} placeholder="Opcional" />
			{#if isDetailed}
				<Input label="RFC / datos fiscales" bind:value={$quote.business.taxId} placeholder="Opcional" />
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
