<script>
	export let icon = '📄';
	export let title = '';
	export let description = '';
	export let disabled = false;
	export let badge = ''; // e.g. "Próximamente"
</script>

<button
	class="card flex w-full items-start gap-4 text-left transition {disabled
		? 'cursor-not-allowed opacity-60'
		: 'hover:border-heart hover:shadow-soft active:scale-[0.99]'}"
	{disabled}
	on:click
>
	<span class="text-2xl">{icon}</span>
	<span class="flex-1">
		<span class="flex items-center gap-2">
			<span class="block font-display font-semibold text-ink">{title}</span>
			{#if badge}
				<span class="rounded-full bg-heart-light px-2 py-0.5 text-[11px] font-medium text-heart-dark">
					{badge}
				</span>
			{/if}
		</span>
		{#if description}
			<span class="mt-1 block text-sm text-muted">{description}</span>
		{/if}
	</span>
</button>
