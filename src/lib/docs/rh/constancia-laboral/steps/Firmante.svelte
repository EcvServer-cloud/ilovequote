<script>
	import { constanciaFlow, STEPS } from '$lib/docs/rh/constancia-laboral/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';
	import ImageUploadField from '$lib/docs/shared/components/ImageUploadField.svelte';

	const tiposFirmante = ['Recursos Humanos', 'Representante legal', 'Gerente', 'Propietario', 'Administrador', 'Otro'];

	$: f = $constanciaFlow.firmante;
	$: canContinue = f.nombre.trim().length > 0 && f.cargo.trim().length > 0;
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$constanciaFlow.screen}
	title="Firmante"
	subtitle="¿Quién autoriza esta constancia?"
	{canContinue}
	onContinue={() => constanciaFlow.next()}
	onBack={() => constanciaFlow.back()}
>
	<div class="flex flex-col gap-4">
		<Input label="Nombre del firmante" bind:value={$constanciaFlow.firmante.nombre} placeholder="Ej. Laura Méndez" required />
		<Input label="Cargo" bind:value={$constanciaFlow.firmante.cargo} placeholder="Ej. Gerente de Recursos Humanos" required />

		<div>
			<label class="field-label" for="tipo-firmante">Tipo de firmante</label>
			<select id="tipo-firmante" class="field-input" bind:value={$constanciaFlow.firmante.tipo}>
				<option value="">Selecciona una opción (opcional)</option>
				{#each tiposFirmante as t}
					<option value={t}>{t}</option>
				{/each}
			</select>
		</div>
		{#if $constanciaFlow.firmante.tipo === 'Otro'}
			<Input label="Especifica" bind:value={$constanciaFlow.firmante.tipoOtro} />
		{/if}

		<label class="card flex items-center justify-between !p-4">
			<span class="text-sm font-medium text-ink">Incluir espacio para firma</span>
			<input type="checkbox" class="h-5 w-5 accent-heart" bind:checked={$constanciaFlow.firmante.incluirFirma} />
		</label>

		<label class="card flex items-center justify-between !p-4">
			<span class="text-sm font-medium text-ink">¿Incluir sello?</span>
			<input type="checkbox" class="h-5 w-5 accent-heart" bind:checked={$constanciaFlow.sello.incluir} />
		</label>

		{#if $constanciaFlow.sello.incluir}
			<ImageUploadField
				bind:value={$constanciaFlow.sello.imagen}
				label="Imagen del sello"
				uploadLabel="Subir sello"
				changeLabel="Cambiar sello"
				placeholderIcon="🔖"
			/>
		{/if}
	</div>
</StepShell>
