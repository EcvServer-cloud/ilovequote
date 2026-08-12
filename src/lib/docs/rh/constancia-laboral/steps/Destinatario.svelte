<script>
	import { constanciaFlow, STEPS } from '$lib/docs/rh/constancia-laboral/flow.js';
	import StepShell from '$lib/docs/shared/components/StepShell.svelte';
	import Input from '$lib/components/Input.svelte';

	const finalidades = [
		['no_especificar', 'No especificar'],
		['tramite_bancario', 'Trámite bancario'],
		['solicitud_credito', 'Solicitud de crédito'],
		['arrendamiento', 'Arrendamiento'],
		['tramite_administrativo', 'Trámite administrativo'],
		['comprobacion_empleo', 'Comprobación de empleo'],
		['comprobacion_ingresos', 'Comprobación de ingresos'],
		['otro', 'Otro']
	];

	$: d = $constanciaFlow.destinatario;
	$: canContinue = d.tipo === 'general' || (d.tipo === 'especifico' && d.institucion.trim().length > 0);
</script>

<StepShell
	steps={STEPS}
	progressSteps={STEPS.slice(0, -1)}
	current={$constanciaFlow.screen}
	title="Destinatario y finalidad"
	subtitle="Ambos son opcionales — por defecto es general."
	{canContinue}
	onContinue={() => constanciaFlow.next()}
	onBack={() => constanciaFlow.back()}
>
	<div class="flex flex-col gap-4">
		<div>
			<p class="field-label">Dirigida a</p>
			<div class="flex flex-col gap-2">
				<label class="card flex items-center gap-2 !p-3">
					<input type="radio" class="h-4 w-4 accent-heart" value="general" bind:group={$constanciaFlow.destinatario.tipo} />
					<span class="text-sm font-medium text-ink">A quien corresponda</span>
				</label>
				<label class="card flex items-center gap-2 !p-3">
					<input type="radio" class="h-4 w-4 accent-heart" value="especifico" bind:group={$constanciaFlow.destinatario.tipo} />
					<span class="text-sm font-medium text-ink">Institución / empresa específica</span>
				</label>
			</div>
		</div>

		{#if $constanciaFlow.destinatario.tipo === 'especifico'}
			<Input label="Nombre de la institución" bind:value={$constanciaFlow.destinatario.institucion} placeholder="Ej. Banco XYZ, S.A." required />
		{/if}

		<div>
			<label class="field-label" for="finalidad">Finalidad</label>
			<select id="finalidad" class="field-input" bind:value={$constanciaFlow.finalidad.tipo}>
				{#each finalidades as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>

		{#if $constanciaFlow.finalidad.tipo === 'otro'}
			<Input label="Especifica la finalidad" bind:value={$constanciaFlow.finalidad.otro} />
		{/if}
	</div>
</StepShell>
