<script lang="ts">
  export let label: string;
  export let placeholder: string;
  export let handler: (value: string) => void = () => {};

  export let value = "";

  function handleInput(e: Event) {
    value = (e.currentTarget as HTMLTextAreaElement).value;
    handler(value);
  }
</script>

<div class="desc-input">
  <div class="field-name">{label}</div>
  <textarea placeholder={placeholder} bind:value={value} on:change={handleInput} />
</div>

<style>
  @import "/theme.css";

  .desc-input {
    margin: 5px;
    width: 80%;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: var(--font-color);
  }

  .desc-input > textarea {
    color: var(--font-color);
    width: 100%;
    height: 100px;

    background-color: var(--foreground);
    border-radius: 4px;
    outline: none;
    border: 1px solid black;
    padding: 4px;
  }
  .desc-input > textarea:hover {
    outline: 1px solid var(--highlight-hover);
  }
  .desc-input > textarea:focus {
    outline: 1px solid var(--highlight);
  }
</style>
