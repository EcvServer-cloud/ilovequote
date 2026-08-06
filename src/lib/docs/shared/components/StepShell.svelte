<script>
	// Reuses the exact same visual language as cotización by *importing* its
	// components — nothing here is copied or forked. See NOTES.md for the
	// observation that these two are good future shared-component candidates.
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';

	export let steps = []; // full step array for this document flow
	export let current = ''; // current step key
	export let title = '';
	export let subtitle = '';
	export let canContinue = true;
	export let continueLabel = 'Continuar';
	export let onContinue = () => {};
	export let onBack = () => {};
	export let showProgress = true;
	// Steps to exclude from the dots (e.g. the landing/select screen and the final "generado" screen)
	export let progressSteps = steps;
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-8">
	{#if showProgress}
		<ProgressIndicator steps={progressSteps} current={current} />
	{/if}

	<div class="mt-6 animate-slide-in">
		{#if title}
			<h1 class="font-display text-xl font-bold text-ink">{title}</h1>
		{/if}
		{#if subtitle}
			<p class="mt-1 text-sm text-muted">{subtitle}</p>
		{/if}

		<div class="mt-6">
			<slot />
		</div>
	</div>

	<div class="mt-8 flex flex-col gap-3">
		<button class="btn-primary" disabled={!canContinue} on:click={onContinue}>
			{continueLabel}
		</button>
		<button class="btn-ghost mx-auto" on:click={onBack}>← Volver</button>
	</div>
</div>
