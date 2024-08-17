<script lang="ts">
  import type { HTMLAttributes, HTMLTextareaAttributes } from "svelte/elements";

  export let display = "inline-flex";
  export let extraWrapperOptions: HTMLAttributes<HTMLDivElement> = {};
  export let extraOptions: HTMLTextareaAttributes = {};
  export let name: string;
  
  export let disabled = false;
  export let required = false;
  export let error = false;
  export let value = "";
  const id = crypto.randomUUID();
</script>

<div
  class="m3-container"
  class:error
  style="display: {display}"
  {...extraWrapperOptions}
>
  <textarea
    class="m3-font-body-large"
    placeholder=" "
    bind:value
    {id}
    {disabled}
    {required}
    {...extraOptions}
    on:change
    on:input
  />
  <div class="layer" />
  <label class="m3-font-body-large" for={id}>{name}</label>
</div>

<style>
  :root {
    --m3-textfield-outlined-shape: var(--m3-util-rounding-extra-small);
  }
  .m3-container {
    position: relative;
    align-items: center;
    height: 3.5rem;
    min-width: 15rem;
  }
  textarea {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 1rem;
    border-radius: var(--m3-textfield-outlined-shape);
    background-color: transparent;
    color: rgb(var(--m3-scheme-on-surface));
    resize: none;
  }
  label {
    position: absolute;
    left: 0.75rem;
    top: 1rem;
    color: rgb(var(--error, var(--m3-scheme-on-surface-variant)));
    background-color: rgb(var(--m3-util-background, var(--m3-scheme-surface-container)));
    padding: 0 0.25rem;
    pointer-events: none;
    transition:
      all 200ms,
      font-size 300ms,
      line-height 300ms,
      letter-spacing 300ms;
  }
  .layer {
    position: absolute;
    inset: 0;
    border: 0.0625rem solid rgb(var(--error, var(--m3-scheme-outline)));
    border-radius: var(--m3-textfield-outlined-shape);
    pointer-events: none;
    transition: all 200ms;
  }
  .m3-container :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
    color: rgb(var(--m3-scheme-on-surface-variant));
    pointer-events: none;
  }
  .m3-container > :global(.leading) {
    position: relative;
    margin-left: 0.75rem;
  }
  .trailing {
    position: absolute;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    height: 100%;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: transparent;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;

    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    transition: all 200ms;
  }

  textarea:focus ~ label,
  textarea:not(:placeholder-shown) ~ label {
    top: calc(var(--m3-font-body-small-height, 1rem) * -0.5);
    font-size: var(--m3-font-body-small-size, 0.85rem);
    line-height: var(--m3-font-body-small-height, 1rem);
    letter-spacing: var(--m3-font-body-small-tracking, 0.4);
  }
  textarea:hover ~ label {
    color: rgb(var(--error, var(--m3-scheme-on-surface)));
  }
  textarea:hover ~ .layer {
    border-color: rgb(var(--error, var(--m3-scheme-on-surface)));
  }
  textarea:focus ~ label {
    color: rgb(var(--error, var(--m3-scheme-primary)));
  }
  textarea:focus ~ .layer {
    border-color: rgb(var(--error, var(--m3-scheme-primary)));
    border-width: 0.125rem;
  }

  .error {
    --error: var(--m3-scheme-error);
  }
  .error > textarea:hover ~ label,
  .error > textarea:hover ~ .layer {
    --error: var(--m3-scheme-on-error-container);
  }

  textarea:disabled {
    color: rgb(var(--m3-scheme-on-surface) / 0.38);
  }
  textarea:disabled ~ label {
    color: rgb(var(--m3-scheme-on-surface) / 0.38);
  }
  textarea:disabled ~ .layer {
    border-color: rgb(var(--m3-scheme-on-surface) / 0.38);
  }
</style>
