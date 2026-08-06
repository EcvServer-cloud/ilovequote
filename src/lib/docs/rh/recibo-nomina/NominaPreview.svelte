<script>
	import { sumConceptos, formatCurrency } from '$lib/docs/shared/schema.js';
	import { amountToWords } from '$lib/docs/shared/numberToWords.js';

	export let state;

	$: ({ patron, trabajador, periodo, percepciones, deducciones, formaPago, firmas, folio } = state);
	$: visiblePercepciones = percepciones.filter((c) => c.nombre?.trim());
	$: visibleDeducciones = deducciones.filter((c) => c.nombre?.trim());
	$: totalPercepciones = sumConceptos(percepciones);
	$: totalDeducciones = sumConceptos(deducciones);
	$: neto = totalPercepciones - totalDeducciones;
	$: today = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
</script>

<div class="rounded-xl2 border border-border bg-paper p-6 shadow-card">
	<div class="flex items-start justify-between gap-4 border-b border-border pb-4">
		<div class="flex items-center gap-3">
			{#if patron.logo}
				<img src={patron.logo} alt="" class="h-10 w-10 rounded-lg object-contain" />
			{/if}
			<div>
				<p class="font-display font-bold text-ink">{patron.nombre || 'Tu negocio'}</p>
				{#if patron.telefono || patron.correo}
					<p class="text-xs text-muted">{[patron.telefono, patron.correo].filter(Boolean).join(' · ')}</p>
				{/if}
			</div>
		</div>
		<div class="text-right">
			<p class="text-xs font-semibold text-heart">{folio || 'FOLIO-PENDIENTE'}</p>
			<p class="text-xs text-muted">{today}</p>
		</div>
	</div>

	{#if trabajador.nombre}
		<div class="mt-4 text-sm">
			<p class="font-medium text-ink">Trabajador</p>
			<p class="text-muted">{[trabajador.nombre, trabajador.puesto].filter(Boolean).join(' · ')}</p>
		</div>
	{/if}

	{#if periodo.fechaInicio || periodo.fechaFin || periodo.periodicidad}
		<p class="mt-2 text-xs text-muted">
			{[periodo.fechaInicio && periodo.fechaFin ? `${periodo.fechaInicio} al ${periodo.fechaFin}` : '', periodo.periodicidad]
				.filter(Boolean)
				.join(' · ')}
		</p>
	{/if}

	<div class="mt-4">
		<p class="text-xs font-semibold uppercase tracking-wide text-muted">Percepciones</p>
		<div class="mt-1 space-y-1 text-sm">
			{#each visiblePercepciones as c (c.id)}
				<div class="flex justify-between"><span class="text-ink">{c.nombre}</span><span class="text-muted">{formatCurrency(c.monto)}</span></div>
			{:else}
				<p class="text-xs text-muted">Agrega al menos una percepción</p>
			{/each}
		</div>
	</div>

	{#if visibleDeducciones.length}
		<div class="mt-3">
			<p class="text-xs font-semibold uppercase tracking-wide text-muted">Deducciones</p>
			<div class="mt-1 space-y-1 text-sm">
				{#each visibleDeducciones as c (c.id)}
					<div class="flex justify-between"><span class="text-ink">{c.nombre}</span><span class="text-muted">-{formatCurrency(c.monto)}</span></div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="ml-auto mt-4 w-full max-w-[240px] space-y-1.5 text-sm">
		<div class="flex justify-between text-muted"><span>Total percepciones</span><span>{formatCurrency(totalPercepciones)}</span></div>
		{#if totalDeducciones > 0}
			<div class="flex justify-between text-muted"><span>Total deducciones</span><span>-{formatCurrency(totalDeducciones)}</span></div>
		{/if}
		<div class="flex justify-between border-t border-border pt-1.5 font-display text-base font-bold text-ink">
			<span>Neto pagado</span><span>{formatCurrency(neto)}</span>
		</div>
	</div>

	<p class="mt-2 text-right text-[11px] italic text-muted">{amountToWords(neto)}</p>

	{#if formaPago}
		<p class="mt-3 border-t border-border pt-3 text-xs text-muted"><span class="font-medium text-ink">Forma de pago:</span> {formaPago}</p>
	{/if}

	{#if firmas?.incluir}
		<div class="mt-6 flex justify-between gap-6 text-center text-[10px] text-muted">
			<div class="flex-1 border-t border-ink pt-1">Firma del patrón</div>
			<div class="flex-1 border-t border-ink pt-1">Firma del trabajador</div>
		</div>
	{/if}

	<p class="mt-4 text-center text-[10px] text-border">Creado con i❤️Quote</p>
</div>
