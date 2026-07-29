<script>
  export let id = '';
  export let label = '';
  export let type = 'text';
  export let value = '';
  export let placeholder = '';
  export let required = false;
  export let step = undefined;
  export let min = undefined;
  export let max = undefined;
  export let disabled = false;
</script>

<div class="field">
  {#if label}
    <label for={id} class="field-label">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  {#if type === 'number'}
    <input
      {id}
      class="field-input"
      type="number"
      bind:value
      {placeholder}
      {required}
      {disabled}
      {step}
      {min}
      {max}
    />
  {:else if type === 'email'}
    <input
      {id}
      class="field-input"
      type="email"
      bind:value
      {placeholder}
      {required}
      {disabled}
    />
  {:else if type === 'tel'}
    <input
      {id}
      class="field-input"
      type="tel"
      bind:value
      {placeholder}
      {required}
      {disabled}
    />
  {:else if type === 'date'}
    <input
      {id}
      class="field-input"
      type="date"
      bind:value
      {required}
      {disabled}
    />
  {:else if type === 'url'}
    <input
      {id}
      class="field-input"
      type="url"
      bind:value
      {placeholder}
      {required}
      {disabled}
    />
  {:else if type === 'password'}
    <input
      {id}
      class="field-input"
      type="password"
      bind:value
      {placeholder}
      {required}
      {disabled}
    />
  {:else}
    <input
      {id}
      class="field-input"
      type="text"
      bind:value
      {placeholder}
      {required}
      {disabled}
    />
  {/if}
</div>
