<script>
	import { computeTotals, itemTotal, formatCurrency } from '$lib/utils/calculations.js';

	export let state;

	$: ({ business, client, items, discount, tax, meta, type, folio } = state);
	$: isDetailed = type === 'detailed';
	$: totals = computeTotals(items, discount, tax);
	$: visibleItems = items.filter((it) => it.description.trim());
	$: today = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
</script>

<div class="rounded-xl2 border border-border bg-paper p-6 shadow-card">
	<div class="flex items-start justify-between gap-4 border-b border-border pb-4">
		<div class="flex items-center gap-3">
			{#if business.logo}
				<img src={business.logo} alt="" class="h-10 w-10 rounded-lg object-contain" />
			{/if}
			<div>
				<p class="font-display font-bold text-ink">{business.name || 'Tu negocio'}</p>
				{#if business.phone || business.email}
					<p class="text-xs text-muted">{[business.phone, business.email].filter(Boolean).join(' · ')}</p>
				{/if}
			</div>
		</div>
		<div class="text-right">
			<p class="text-xs font-semibold text-heart">{folio || 'FOLIO-PENDIENTE'}</p>
			<p class="text-xs text-muted">{today}</p>
			{#if meta.validity}<p class="text-xs text-muted">Vigencia: {meta.validity}</p>{/if}
		</div>
	</div>

	{#if client.name}
		<div class="mt-4 text-sm">
			<p class="font-medium text-ink">Cliente</p>
			<p class="text-muted">{[client.name, client.phone, client.email].filter(Boolean).join(' · ')}</p>
		</div>
	{/if}

	<div class="mt-4 overflow-hidden rounded-lg border border-border">
		<table class="w-full text-sm">
			<thead class="bg-ink text-white">
				<tr>
					<th class="px-3 py-2 text-left font-medium">Descripción</th>
					<th class="px-3 py-2 text-center font-medium">Cant.</th>
					<th class="px-3 py-2 text-right font-medium">Precio</th>
					<th class="px-3 py-2 text-right font-medium">Total</th>
				</tr>
			</thead>
			<tbody>
				{#each visibleItems as item, i (item.id)}
					<tr class={i % 2 === 1 ? 'bg-surface' : ''}>
						<td class="px-3 py-2 text-ink">{item.description}</td>
						<td class="px-3 py-2 text-center text-muted">{item.qty}</td>
						<td class="px-3 py-2 text-right text-muted">{formatCurrency(item.price)}</td>
						<td class="px-3 py-2 text-right font-medium text-ink">{formatCurrency(itemTotal(item))}</td>
					</tr>
				{:else}
					<tr><td class="px-3 py-4 text-center text-muted" colspan="4">Agrega productos o servicios</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="ml-auto mt-4 w-full max-w-[220px] space-y-1.5 text-sm">
		<div class="flex justify-between text-muted"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
		{#if discount.enabled && totals.discountAmount > 0}
			<div class="flex justify-between text-muted"><span>Descuento</span><span>-{formatCurrency(totals.discountAmount)}</span></div>
		{/if}
		{#if tax.enabled && totals.taxAmount > 0}
			<div class="flex justify-between text-muted"><span>Impuestos ({tax.rate}%)</span><span>{formatCurrency(totals.taxAmount)}</span></div>
		{/if}
		<div class="flex justify-between border-t border-border pt-1.5 font-display text-base font-bold text-ink">
			<span>Total</span><span>{formatCurrency(totals.total)}</span>
		</div>
	</div>

	{#if isDetailed && (meta.paymentMethod || meta.deposit || meta.deliveryTime)}
		<div class="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted">
			{#if meta.paymentMethod}<p><span class="font-medium text-ink">Forma de pago:</span> {meta.paymentMethod}</p>{/if}
			{#if meta.deposit}<p><span class="font-medium text-ink">Anticipo:</span> {meta.deposit}</p>{/if}
			{#if meta.deliveryTime}<p><span class="font-medium text-ink">Tiempo de entrega:</span> {meta.deliveryTime}</p>{/if}
		</div>
	{/if}

	{#if meta.notes}
		<p class="mt-3 border-t border-border pt-3 text-xs italic text-muted">{meta.notes}</p>
	{/if}

	<p class="mt-4 text-center text-[10px] text-border">Creado con i❤️Quote</p>
</div>
