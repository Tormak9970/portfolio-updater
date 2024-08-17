<script lang="ts">
  import { TextField, Toggle } from "@interactables";
  import { onMount } from "svelte";

  export let value:string;
  export let singleYear: boolean;

  export let onChange:() => void = () => {};

  let from: string;
  let to: string;

  function onSplitChangeWrapper() {
    if (from !== "" && to !== "") {
      value = from + " — " + to;
      onChange();
    }
  }

  onMount(() => {
    if (!singleYear) {
      const parts = value.split(" — ");
      from = parts[0];
      to = parts[1];
    }
  });
</script>

<div class="duration-container">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="type-container">
    <div class="type-label" style="margin-right: 7px;">Single Year:</div>
    <Toggle bind:checked={singleYear} />
  </label>
  {#if singleYear}
    <TextField
      name="Duration"
      extraWrapperOptions={{
        style: "width: 100%;"
      }}
      bind:value={value}
      on:change={onChange}
    />
  {:else}
    <div class="multi-year-container">
      <TextField
        name="From"
        extraWrapperOptions={{
          style: "width: 100%;"
        }}
        bind:value={from}
        on:change={onSplitChangeWrapper}
      />
      <TextField
        name="To"
        extraWrapperOptions={{
          style: "width: 100%;"
        }}
        bind:value={to}
        on:change={onSplitChangeWrapper}
      />
    </div>
  {/if}
</div>

<style>
  .duration-container {
    height: 110px;
  }
  
  .type-container {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
  }

  .type-label {
    margin-right: 7px;
  }

  .multi-year-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
</style>