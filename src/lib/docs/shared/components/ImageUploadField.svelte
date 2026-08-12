<script>
	// Reusable image-to-dataURL uploader — same FileReader pattern already
	// used inline for logos in cotización (BusinessForm.svelte) and
	// recibo-nomina (Patron.svelte). Extracted here because
	// constancia-laboral needs it twice (logo + sello); those two existing
	// screens are left untouched.
	export let value = ''; // data URL
	export let label = 'Imagen';
	export let uploadLabel = 'Subir imagen';
	export let changeLabel = 'Cambiar imagen';
	export let removeLabel = 'Quitar';
	export let placeholderIcon = '🖼️';
	export let hint = '';

	function handleFile(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => (value = reader.result);
		reader.readAsDataURL(file);
	}
	function remove() {
		value = '';
	}
</script>

<div>
	{#if label}
		<p class="field-label">{label}</p>
	{/if}
	<div class="flex items-center gap-4">
		<div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface">
			{#if value}
				<img src={value} alt={label} class="h-full w-full object-contain" />
			{:else}
				<span class="text-xl">{placeholderIcon}</span>
			{/if}
		</div>
		<div class="flex flex-col gap-1.5">
			<label class="btn-secondary cursor-pointer !px-4 !py-2 text-sm">
				{value ? changeLabel : uploadLabel}
				<input type="file" accept="image/*" class="hidden" on:change={handleFile} />
			</label>
			{#if value}
				<button class="btn-ghost text-xs" on:click={remove}>{removeLabel}</button>
			{/if}
		</div>
	</div>
	{#if hint}
		<p class="mt-1.5 text-xs text-muted">{hint}</p>
	{/if}
</div>
