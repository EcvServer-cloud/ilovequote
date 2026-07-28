<script>
	export let message = '';
	export let show = false;
</script>

{#if show && message}
	<div
		class="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit max-w-[90%] animate-fade-up rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-soft"
		role="status"
	>
		{message}
	</div>
{/if}
