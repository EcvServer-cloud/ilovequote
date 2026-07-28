<script>
	export let label = '';
	export let value = '';
	export let type = 'text';
	export let placeholder = '';
	export let required = false;
	export let hint = '';
	export let id = label ? label.toLowerCase().replace(/\s+/g, '-') : crypto.randomUUID();
	export let step = undefined;
	export let min = undefined;
</script>

<div>
	{#if label}
		<label class="field-label" for={id}>{label}{#if required}<span class="text-heart"> *</span>{/if}</label>
	{/if}
	{#if type === 'textarea'}
		<textarea
			{id}
			class="field-input min-h-[92px] resize-y"
			bind:value
			{placeholder}
			{required}
		/>
	{:else}
		<input
			{id}
			class="field-input"
			{type}
			{step}
			{min}
			bind:value
			{placeholder}
			{required}
		/>
	{/if}
	{#if hint}
		<p class="mt-1 text-xs text-muted">{hint}</p>
	{/if}
</div>
