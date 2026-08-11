<script>
	import { computeTotals, itemTotal, formatCurrency } from '$lib/utils/calculations.js';
	import { amountToWords } from '$lib/utils/numberToWords.js';

	export let state;

	$: ({ business, client, items, discount, tax, meta, type, folio } = state);
	$: isDetailed = type === 'detailed';
	$: totals = computeTotals(items, discount, tax);
	$: visibleItems = items.filter((it) => it.description.trim());
	$: today = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
	$: now = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date());

	$: quadrants = [
		['📄', 'Términos', meta.terms],
		['✎', 'Notas', meta.notes],
		['🏦', 'Datos de pago', meta.bankDetails],
		['✓', 'Condiciones', meta.conditions]
	].filter(([, , text]) => text?.trim());
</script>

<div class="overflow-hidden rounded-xl2 border border-border bg-paper shadow-card">
	<!-- Encabezado -->
	<div class="flex items-start justify-between gap-4 p-5">
		<div class="flex items-center gap-3">
			<div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-heart">
				{#if business.logo}
					<img src={business.logo} alt="" class="h-full w-full object-contain p-1" />
				{:else}
					<span class="text-[9px] font-bold text-white">LOGO</span>
				{/if}
			</div>
			<div>
				<p class="font-display text-base font-bold text-ink">{business.name || 'Nombre de tu empresa'}</p>
				<div class="mt-1 space-y-0.5 text-[11px] text-muted">
					{#if business.phone}<p>📞 {business.phone}</p>{/if}
					{#if business.email}<p>✉ {business.email}</p>{/if}
					{#if business.address}<p>📍 {business.address}</p>{/if}
					{#if isDetailed && business.taxId}<p>🪪 RFC: {business.taxId}</p>{/if}
				</div>
			</div>
		</div>
		<div class="shrink-0 text-right">
			<p class="font-display text-xl font-extrabold text-heart">COTIZACIÓN</p>
			<div class="mt-2 rounded-lg bg-heart-light px-3 py-1.5">
				<p class="text-[8px] font-bold uppercase tracking-wide text-heart">Folio</p>
				<p class="text-xs font-bold text-ink">{folio || '—'}</p>
			</div>
			<p class="mt-1.5 text-[9px] text-muted">{today} · {now}</p>
		</div>
	</div>

	<div class="h-[3px] bg-heart"></div>

	<div class="p-5">
		<!-- Cliente / Información -->
		<div class="grid grid-cols-2 gap-3">
			<div class="rounded-lg border border-border bg-surface p-3">
				<p class="text-[10px] font-bold uppercase tracking-wide text-heart">👤 Cliente</p>
				<p class="mt-1.5 text-sm font-semibold text-ink">{client.name || 'Nombre del cliente'}</p>
				<div class="mt-1 space-y-0.5 text-[11px] text-muted">
					{#if client.phone}<p>📞 {client.phone}</p>{/if}
					{#if client.email}<p>✉ {client.email}</p>{/if}
					{#if client.address}<p>📍 {client.address}</p>{/if}
					{#if isDetailed && client.taxId}<p>🪪 RFC: {client.taxId}</p>{/if}
				</div>
			</div>
			<div class="rounded-lg border border-border bg-surface p-3">
				<p class="text-[10px] font-bold uppercase tracking-wide text-heart">📄 Información de la cotización</p>
				<div class="mt-1.5 space-y-1 text-[11px]">
					<div class="flex justify-between"><span class="text-muted">Tipo:</span><span class="font-semibold text-heart">{isDetailed ? 'Detallada' : 'Rápida'}</span></div>
					{#if meta.validity}<div class="flex justify-between"><span class="text-muted">Vigencia:</span><span class="font-medium text-ink">{meta.validity}</span></div>{/if}
					{#if isDetailed && meta.paymentMethod}<div class="flex justify-between"><span class="text-muted">Forma de pago:</span><span class="font-medium text-ink">{meta.paymentMethod}</span></div>{/if}
					{#if isDetailed && meta.deliveryTime}<div class="flex justify-between"><span class="text-muted">Entrega:</span><span class="font-medium text-ink">{meta.deliveryTime}</span></div>{/if}
				</div>
			</div>
		</div>

		<!-- Tabla -->
		<div class="mt-4 overflow-hidden rounded-lg border border-border">
			<table class="w-full text-xs">
				<thead class="bg-heart text-white">
					<tr>
						<th class="px-2 py-2 text-center font-medium">#</th>
						<th class="px-3 py-2 text-left font-medium">Descripción</th>
						<th class="px-2 py-2 text-center font-medium">Cant.</th>
						<th class="px-3 py-2 text-right font-medium">P. Unitario</th>
						<th class="px-3 py-2 text-right font-medium">Importe</th>
					</tr>
				</thead>
				<tbody>
					{#each visibleItems as item, i (item.id)}
						<tr class={i % 2 === 1 ? 'bg-heart-light/40' : ''}>
							<td class="px-2 py-2 text-center font-bold text-heart">{String(i + 1).padStart(2, '0')}</td>
							<td class="px-3 py-2 text-ink">{item.description}</td>
							<td class="px-2 py-2 text-center text-muted">{item.qty}</td>
							<td class="px-3 py-2 text-right text-muted">{formatCurrency(item.price)}</td>
							<td class="px-3 py-2 text-right font-semibold text-ink">{formatCurrency(itemTotal(item))}</td>
						</tr>
					{:else}
						<tr><td class="px-3 py-4 text-center text-muted" colspan="5">Agrega productos o servicios</td></tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Cuadrantes + resumen -->
		<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1.4fr,1fr]">
			{#if quadrants.length}
				<div class="grid grid-cols-2 gap-2">
					{#each quadrants as [icon, title, text]}
						<div class="rounded-lg border border-border bg-surface p-2.5">
							<p class="text-[9px] font-bold text-heart">{icon} {title.toUpperCase()}</p>
							<p class="mt-1 line-clamp-3 text-[10px] text-muted">{text}</p>
						</div>
					{/each}
				</div>
			{:else}
				<div />
			{/if}

			<div>
				<div class="space-y-1 text-xs">
					<div class="flex justify-between text-muted"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
					{#if discount.enabled && totals.discountAmount > 0}
						<div class="flex justify-between text-heart"><span>Descuento</span><span>-{formatCurrency(totals.discountAmount)}</span></div>
					{/if}
					{#if tax.enabled && totals.taxAmount > 0}
						<div class="flex justify-between text-muted"><span>Impuestos ({tax.rate}%)</span><span>{formatCurrency(totals.taxAmount)}</span></div>
					{/if}
				</div>
				<div class="mt-2 flex items-center justify-between rounded-lg bg-heart px-3 py-2">
					<span class="text-xs font-bold text-white">TOTAL</span>
					<span class="font-display text-base font-extrabold text-white">{formatCurrency(totals.total)}</span>
				</div>
				<div class="mt-2 flex items-start gap-1.5">
					<span class="text-heart">$</span>
					<div>
						<p class="text-[8px] font-bold uppercase tracking-wide text-muted">Total con letra</p>
						<p class="text-[9.5px] italic text-ink">{amountToWords(totals.total)}</p>
					</div>
				</div>
			</div>
		</div>

		{#if meta.hasSignature}
			<div class="mt-4 rounded-lg border border-border bg-surface p-3">
				<p class="text-center text-[10px] font-bold text-heart">ACEPTACIÓN DE LA COTIZACIÓN</p>
				<div class="mt-3 grid grid-cols-2 gap-6 text-[10px] text-muted">
					<div>
						<p class="font-semibold text-ink">👤 El cliente</p>
						<p class="mt-3 border-t border-ink pt-1">Nombre</p>
						<p class="mt-2 border-t border-ink pt-1">Fecha</p>
					</div>
					<div>
						<p class="font-semibold text-ink">✎ El emisor</p>
						<p class="mt-3 border-t border-ink pt-1">Nombre</p>
						<p class="mt-2 border-t border-ink pt-1">Fecha</p>
					</div>
				</div>
			</div>
		{/if}

		<p class="mt-4 text-center text-[9px] italic text-muted">
			🛡 Esta cotización representa una propuesta comercial y no constituye por sí misma un comprobante fiscal ni genera obligación de pago.
		</p>
		<p class="mt-3 text-center text-[10px] font-semibold text-heart">HECHO CON YOAMOCOTIZAR.COM</p>
	</div>
</div>
