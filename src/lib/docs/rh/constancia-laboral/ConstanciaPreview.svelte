<script>
	import { buildParrafos, buildDestinatarioLine, buildLugarFecha } from './redaccion.js';

	export let state;

	$: ({ empresa, trabajador, firmante, sello, folio } = state);
	$: parrafos = buildParrafos(state);
	$: destinatarioLine = buildDestinatarioLine(state.destinatario);
	$: lugarFecha = buildLugarFecha(empresa);
</script>

<!-- Deliberadamente sobrio: sin tarjetas ni iconos, como una carta. -->
<div class="rounded-xl2 border border-border bg-paper p-8 shadow-card">
	<div class="flex items-start justify-between gap-4 border-b border-border pb-4">
		<div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface">
			{#if empresa.logo}
				<img src={empresa.logo} alt="" class="h-full w-full object-contain" />
			{:else}
				<span class="text-[8px] text-muted">LOGO</span>
			{/if}
		</div>
		<div class="text-right">
			<p class="text-sm font-bold text-ink">{empresa.nombre || 'Nombre de la empresa'}</p>
			<p class="text-[10px] text-muted">
				{[empresa.rfc && `RFC: ${empresa.rfc}`, empresa.domicilio, empresa.telefono, empresa.correo].filter(Boolean).join('  ·  ')}
			</p>
		</div>
	</div>

	<p class="mt-6 text-center font-display text-lg font-bold tracking-wide text-heart">CONSTANCIA LABORAL</p>
	<p class="mt-1 text-center text-[10px] text-muted">Folio: {folio || 'PENDIENTE'}</p>

	<p class="mt-6 text-xs text-ink">{lugarFecha}</p>
	<p class="mt-4 text-sm font-bold text-ink">{destinatarioLine}</p>

	<div class="mt-4 space-y-4 text-justify text-[13px] leading-relaxed text-ink">
		{#each parrafos as p}
			<p>{p}</p>
		{/each}
	</div>

	<p class="mt-8 text-sm font-bold text-ink">ATENTAMENTE</p>
	<div class="mt-10 flex items-end justify-between">
		<div class="w-56 border-t border-ink pt-1 text-xs">
			<p class="font-semibold text-ink">{firmante.nombre || 'Nombre del firmante'}</p>
			<p class="text-muted">
				{[firmante.cargo, firmante.tipo === 'Otro' ? firmante.tipoOtro : firmante.tipo].filter(Boolean).join(' · ')}
			</p>
			<p class="text-muted">{empresa.nombre}</p>
		</div>
		{#if sello?.incluir && sello.imagen}
			<img src={sello.imagen} alt="Sello" class="h-14 w-14 object-contain opacity-80" />
		{/if}
	</div>

	<p class="mt-8 text-center text-[9px] italic text-muted">
		La presente constancia se expide a solicitud del interesado y contiene la información proporcionada por la empresa para acreditar la relación laboral indicada.
	</p>
	<p class="mt-3 text-center text-[10px] font-semibold text-heart">HECHO CON YOAMOCOTIZAR.COM</p>
</div>
