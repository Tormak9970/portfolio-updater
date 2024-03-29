<script lang="ts">
  export let label:string = "";
  export let options: {label: string, data: any}[];
  export let onChange: (value: string) => void = () => {};
  export let width = "auto";
  export let direction: "UP" | "DOWN" = "DOWN";

  let customSelectElem: HTMLDivElement;
  let customSelectElemWrapper: HTMLDivElement;
  
  let active = false;

  /**
   * Closes all dropdowns.
   * @param e The click event.
   */
  function closeDropdowns(e: Event): void {
    const target = <HTMLDivElement>e.target;
    if (target != customSelectElem && target != customSelectElemWrapper) active = false;
  }

  /**
   * Toggles the dropdown.
   */
  function toggleDropdown(): void {
    active = !active;
  }

  /**
   * Updates the dropdown with the new option.
   * @param e The associated event.
   */
  function selectOption(e: Event): void {
    const targetElement = <HTMLElement>e.currentTarget;
    
    onChange(targetElement.id);

    toggleDropdown();
  }
</script>

<div class="wrapper" style="width: {width};">
  {#if label != ""}
    <div style="margin-bottom: 3px; font-size: 16px; user-select: none;">{label}:</div>
  {/if}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="custom-select" style="width: calc(100% - 8px);" on:click|stopPropagation={toggleDropdown} bind:this={customSelectElemWrapper}>
    <select>
      {#each options as opt}
        <option value={opt.data}>{opt.label}</option>
      {/each}
    </select>
  
    <div class="select-selected" class:select-arrow-active={active} bind:this={customSelectElem}>Choose an Option</div>
    <div class="select-items" class:open-up={direction=="UP"} style="--top-percentage: -{(options.length + 1) * 100 - 90 }%;" class:select-hide={!active}>
      {#each options as opt}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div id={opt.data} on:click|stopPropagation={selectOption}>{opt.label}</div>
      {/each}
    </div>
  </div>
</div>

<style>
  .wrapper {
    margin: 0px;

		display: flex;
		flex-direction: column;

		color: var(--font-color);

    font-size: 14px;
  }

  .custom-select {
    user-select: none;
    position: relative;
    padding: 3px;
    border-radius: 4px;
    border: 1px solid transparent;

    background-color: var(--foreground);
    transition: background-color 0.15s ease-in-out;

    min-width: 160px;
  }
  .custom-select:hover {
    background-color: var(--foreground-hover);
    cursor: pointer;
  }
  .custom-select > select { display: none; }

  .select-selected {
    text-overflow: ellipsis;
    overflow: hidden;

    width: calc(100% - 30px);
  }
  .select-selected::after {
    position: absolute;
    content: "";
    top: 38.88%;
    right: 4%;
    width: 0;
    height: 0;
    border: min(1.333vw, 6px) solid transparent;
    border-color: var(--font-color) transparent transparent transparent;
  }
  
  :global(.select-arrow-active::after) {
    border-color: transparent transparent var(--font-color) transparent !important;
    top: 7px !important;
  }

  .select-items > div,
  .select-selected {
    color: var(--font-color);
    padding: 0px 3px;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .select-items > div {
    padding: 3px 4px;
    padding-top: 5px;

    height: calc(22px - 7px);
    
    transition: background-color 0.15s ease-in-out;
  }
  .select-items > div:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    overflow: hidden;
  }
  .select-items > div:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow: hidden;
  }
  .select-items {
    position: absolute;
    background-color: var(--foreground);
    top: 102%;
    left: 0;
    right: 0;
    z-index: 99;
    margin-top: 2px;
    border-radius: 4px;
    border: 1px solid transparent;
    box-shadow: 3px 6px 12px -2px var(--shadow);
  }
  .select-items > div:hover {
    background-color: var(--foreground-light);
    cursor: pointer;
  }
  
  .open-up {
    top: var(--top-percentage);
    left: 0;
    right: 0;
    z-index: 99;
    margin-top: 2px;
    border-radius: 4px;
    border: 1px solid transparent;
    box-shadow: -3px -6px 26px -2px var(--shadow);
  }

  .select-hide { display: none; }
</style>
