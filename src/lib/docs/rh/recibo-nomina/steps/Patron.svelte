<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { nominaFlow, STEPS } from '$lib/docs/rh/recibo-nomina/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';

	$: canContinue = $nominaFlow.patron.nombre.trim().length > 0;

	function handleLogo(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			nominaFlow.update((s) => ({ ...s, patron: { ...s.patron, logo: reader.result } }));
		};
		reader.readAsDataURL(file);
	}
	function removeLogo() {
		nominaFlow.update((s) => ({ ...s, patron: { ...s.patron, logo: '' } }));
	}
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$nominaFlow.screen}
	title="Datos del patrón"
	subtitle="La empresa o persona que emite el recibo."
	{canContinue}
	onContinue={() => nominaFlow.next()}
	onBack={() => goto(`${base}/docs/rh`)}
>
	<div class="mb-5 flex items-center gap-4">
		<div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface">
			{#if $nominaFlow.patron.logo}
				<img src={$nominaFlow.patron.logo} alt="Logo del patrón" class="h-full w-full object-contain" />
			{:else}
				<span class="text-xl">🏢</span>
			{/if}
		</div>
		<div class="flex flex-col gap-1.5">
			<label class="btn-secondary cursor-pointer !px-4 !py-2 text-sm">
				{$nominaFlow.patron.logo ? 'Cambiar logo' : 'Subir logo'}
				<input type="file" accept="image/*" class="hidden" on:change={handleLogo} />
			</label>
			{#if $nominaFlow.patron.logo}
				<button class="btn-ghost text-xs" on:click={removeLogo}>Quitar logo</button>
			{/if}
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<Input label="Nombre / razón social" bind:value={$nominaFlow.patron.nombre} placeholder="Ej. Fletes y Mudanzas Galindo" required />
		<Input label="RFC" bind:value={$nominaFlow.patron.rfc} placeholder="Opcional" />
		<Input label="Domicilio" bind:value={$nominaFlow.patron.domicilio} placeholder="Opcional" />
		<Input label="Teléfono" type="tel" bind:value={$nominaFlow.patron.telefono} placeholder="Opcional" />
		<Input label="Correo" type="email" bind:value={$nominaFlow.patron.correo} placeholder="Opcional" />
	</div>
</StepShell>
