<script>
	export let size = 'md'; // 'sm' | 'md' | 'lg'
	export let animated = false;

	const sizes = {
		sm: 'text-xl',
		md: 'text-3xl',
		lg: 'text-5xl'
	};
</script>

<span class="inline-flex select-none items-center font-display font-extrabold tracking-tight {sizes[size]}">
	<span class="text-ink">i</span>
	<span
		class="mx-0.5 text-heart {animated ? 'animate-heartbeat' : ''}"
		style="display:inline-block; transform-origin:center;"
		aria-hidden="true"
	>
		❤
	</span>
	<span class="text-ink">Quote</span>
</span>
