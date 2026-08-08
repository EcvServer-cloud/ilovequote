<script>
	import { sumConceptos, formatCurrency } from '$lib/docs/shared/schema.js';
	import { amountToWords } from '$lib/docs/shared/numberToWords.js';

	export let state;

	$: ({ patron, trabajador, periodo, percepciones, deducciones, retenciones, formaPago, notas, firmas, folio } = state);
	$: visiblePercepciones = percepciones.filter((c) => c.nombre?.trim());
	$: visibleDeducciones = deducciones.filter((c) => c.nombre?.trim());
	$: totalPercepciones = sumConceptos(percepciones);
	$: totalDeducciones = sumConceptos(deducciones);
	$: retencionesMonto = Number(retenciones) || 0;
	$: subtotal = totalPercepciones;
	$: total = subtotal - totalDeducciones - retencionesMonto;
	$: neto = total;
	$: today = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
</script>

<div class="overflow-hidden rounded-xl2 border border-border bg-paper shadow-card">
	<!-- Encabezado tipo comprobante -->
	<div class="flex items-center justify-between px-4 pt-3 text-[10px] font-semibold text-heart">
		<span>Comprobante de pago digital</span>
		<span>FOLIO: {folio || 'PENDIENTE'}</span>
	</div>

	<div class="mt-2 flex items-center gap-3 bg-heart px-4 py-3">
		<div class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
			{#if patron.logo}
				<img src={patron.logo} alt="" class="h-full w-full object-contain" />
			{:else}
				<span class="text-[9px] font-bold text-muted">LOGO</span>
			{/if}
		</div>
		<div class="flex-1 text-white">
			<p class="font-display text-sm font-bold uppercase">{patron.nombre || 'Nombre de la empresa'}</p>
			<p class="text-[10px] opacity-90">
				{[patron.rfc && `RFC: ${patron.rfc}`, patron.telefono, patron.correo].filter(Boolean).join('  ·  ')}
			</p>
		</div>
		<div class="shrink-0 text-right text-[10px] text-white">
			<p>FECHA: {today}</p>
		</div>
	</div>

	<div class="p-4">
		<div class="grid grid-cols-2 gap-4 rounded-lg border border-border p-3 text-xs">
			<div>
				<p class="mb-1 text-center font-display text-[11px] font-bold text-ink">TRABAJADOR</p>
				<p class="text-ink">{trabajador.nombre || '—'}</p>
				{#if trabajador.puesto}<p class="text-muted">{trabajador.puesto}</p>{/if}
				{#if trabajador.curp}<p class="text-muted">CURP: {trabajador.curp}</p>{/if}
				{#if trabajador.rfc}<p class="text-muted">RFC: {trabajador.rfc}</p>{/if}
				{#if trabajador.nss}<p class="text-muted">NSS: {trabajador.nss}</p>{/if}
			</div>
			<div class="border-l border-border pl-4">
				{#if periodo.ejercicio}<p class="text-muted"><span class="font-medium text-ink">Ejercicio:</span> {periodo.ejercicio}</p>{/if}
				{#if periodo.fechaInicio && periodo.fechaFin}
					<p class="text-muted"><span class="font-medium text-ink">Periodo:</span> {periodo.fechaInicio} al {periodo.fechaFin}</p>
				{/if}
				{#if periodo.periodicidad}<p class="text-muted"><span class="font-medium text-ink">Tipo:</span> {periodo.periodicidad}</p>{/if}
				{#if periodo.fechaPago}<p class="text-muted"><span class="font-medium text-ink">Fecha de pago:</span> {periodo.fechaPago}</p>{/if}
			</div>
		</div>

		<div class="mt-4 grid grid-cols-2 gap-3">
			<div>
				<p class="rounded-t-md bg-heart px-2 py-1 text-center text-[10px] font-bold text-white">PERCEPCIONES</p>
				<div class="space-y-1 rounded-b-md border border-t-0 border-border p-2 text-xs">
					{#each visiblePercepciones as c (c.id)}
						<div class="flex justify-between"><span class="text-ink">{c.nombre}</span><span class="text-muted">{formatCurrency(c.monto)}</span></div>
					{:else}
						<p class="text-[11px] text-muted">Agrega al menos una percepción</p>
					{/each}
				</div>
			</div>
			<div>
				<p class="rounded-t-md bg-heart px-2 py-1 text-center text-[10px] font-bold text-white">DEDUCCIONES</p>
				<div class="space-y-1 rounded-b-md border border-t-0 border-border p-2 text-xs">
					{#each visibleDeducciones as c (c.id)}
						<div class="flex justify-between"><span class="text-ink">{c.nombre}</span><span class="text-muted">{formatCurrency(c.monto)}</span></div>
					{:else}
						<p class="text-[11px] text-muted">Sin deducciones</p>
					{/each}
				</div>
			</div>
		</div>

		<div class="mt-4 grid grid-cols-2 gap-3">
			<div class="rounded-lg border border-border p-3 text-xs">
				<p class="font-medium text-ink">Forma de pago: {formaPago || '—'}</p>
				{#if notas}
					<p class="mt-2 text-[11px] text-muted"><span class="font-medium text-ink">Notas:</span> {notas}</p>
				{/if}
			</div>
			<div class="space-y-1 rounded-lg border border-border p-3 text-xs">
				<div class="flex justify-between text-muted"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
				<div class="flex justify-between text-muted"><span>Descuentos</span><span>{formatCurrency(totalDeducciones)}</span></div>
				<div class="flex justify-between text-muted"><span>Retenciones</span><span>{formatCurrency(retencionesMonto)}</span></div>
				<div class="flex justify-between border-t border-border pt-1 font-medium text-ink"><span>Total</span><span>{formatCurrency(total)}</span></div>
				<div class="flex justify-between font-display font-bold text-heart"><span>Neto del recibo</span><span>{formatCurrency(neto)}</span></div>
			</div>
		</div>

		<div class="mt-3 rounded-md bg-heart-light px-3 py-2 text-center text-[11px] italic text-heart-dark">
			{amountToWords(neto).toLowerCase()}
		</div>

		{#if firmas?.incluir}
			<div class="mt-6 flex justify-between gap-6 text-center text-[10px] text-muted">
				<div class="flex-1 border-t border-ink pt-1">Firma del patrón</div>
				<div class="flex-1 border-t border-ink pt-1">Firma del empleado</div>
			</div>
		{/if}

		<p class="mt-4 text-center text-[10px] text-border">Hecho con YoAmoCotizar.com</p>
	</div>
</div>
