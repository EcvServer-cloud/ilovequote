<script>
	export let steps = []; // array of step keys, in order
	export let current = ''; // current step key

	$: currentIndex = steps.indexOf(current);
</script>

<div class="flex items-center justify-center gap-2" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin="1" aria-valuemax={steps.length}>
	{#each steps as step, i}
		<span
			class="text-sm transition-all duration-300 {i <= currentIndex ? 'text-heart scale-110' : 'text-border'}"
			aria-hidden="true"
		>
			{i <= currentIndex ? '❤' : '♡'}
		</span>
	{/each}
</div>
