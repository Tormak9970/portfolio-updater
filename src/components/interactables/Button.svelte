<script lang="ts">
  export let label: string;
  export let width = "40px";
  export let height = "auto";
  export let onClick: (e: MouseEvent) => void;
  export let disabled = false;
  export let highlight = false;
  export let warn = false;
</script>

<button class="button" class:warn={warn} class:highlight={highlight} class:disabled={disabled} style="width: {width}; height: {height};" on:click={onClick}>
  <div style="user-select: none;">{label}</div>
</button>

<style>
  .button {
    padding: 3px 6px;
    min-width: 40px;
        
    background-color: var(--foreground-light);
    border: 1px solid transparent;
    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 12px;
    cursor: pointer;

    color: var(--font-color);

    transition: background-color 0.15s ease-in-out, border 0.15s ease-in-out;
  }

  .button:hover {
    background-color: var(--foreground-light-hover);
  }

  .button:focus {
    outline: none;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.7;
  }

  .highlight { background-color: var(--save); }
  .highlight:hover { background-color: var(--save-hover); }

  .warn { background-color: var(--warning); }
  .warn:hover { background-color: var(--warning-hover); }
</style>
