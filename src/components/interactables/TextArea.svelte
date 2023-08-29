<script lang="ts">
  export let label: string;
  export let placeholder: string;
  export let onChange: (value: string) => Promise<void> = async () => {};

  export let value = "";
  
  export let width = "100%";
  export let height = "auto";

  function handleInput(e: Event) {
    value = (e.currentTarget as HTMLSpanElement).innerText;
    onChange(value);
  }
</script>

<div class="textarea-input" style="width: calc({width} - 2px); height: {height}; min-height: 100px">
  <div style="margin-bottom: 2px;">{label}</div>
  <!-- svelte-ignore a11y-interactive-supports-focus -->
  <span role="textbox" contenteditable on:keyup={handleInput}>{value ?? placeholder}</span>
</div>

<style>
  .textarea-input {
    margin: 0px;

    display: flex;
    flex-direction: column;

    color: var(--font-color);
  }

  span {
    width: calc(100% - 8px);
    height: calc(100% - 22px);
    box-sizing: border-box;
    
    padding: 4px;

    color: var(--font-color);
    background-color: var(--foreground);
    border-radius: 4px;

    outline: none;
    border: 1px solid transparent;

    transition: border 0.2s ease-in-out;

    resize: none;
  }
  
  span:hover { outline: none; }
  span:focus {
    outline: none;
    border: 1px solid var(--highlight);
  }
</style>
