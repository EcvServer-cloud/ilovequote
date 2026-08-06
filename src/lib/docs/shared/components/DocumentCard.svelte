<script>
	export let title = '';
	export let description = '';
	export let disabled = false;
	export let badge = ''; // e.g. "Próximamente"
</script>

<button
	class="card flex w-full items-center justify-between gap-3 text-left transition {disabled
		? 'cursor-not-allowed opacity-60'
		: 'hover:border-heart hover:shadow-soft active:scale-[0.99]'}"
	{disabled}
	on:click
>
	<span>
		<span class="block text-sm font-semibold text-ink">{title}</span>
		{#if description}
			<span class="mt-0.5 block text-xs text-muted">{description}</span>
		{/if}
	</span>
	{#if badge}
		<span class="shrink-0 rounded-full bg-surface px-2 py-1 text-[11px] font-medium text-muted">
			{badge}
		</span>
	{:else}
		<span class="shrink-0 text-muted" aria-hidden="true">→</span>
	{/if}
</button>
