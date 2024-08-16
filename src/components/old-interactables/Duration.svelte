<script lang="ts">
  import { onMount } from "svelte";
  import Checkbox from "./Checkbox.svelte";
  import TextInput from "./TextInput.svelte";

  export let label:string = "";
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
  {#if label != ""}
    <label style="margin-bottom: 2px; font-size: 16px; user-select: none;">{label}</label>
  {/if}
  <div class="type-container">
    <div class="type-label" style="margin-right: 7px;">Single Year:</div>
    <Checkbox bind:value={singleYear} />
  </div>
  {#if singleYear}
    <TextInput placeholder="The dates of employment" bind:value={value} onInput={onChange} />
  {:else}
    <div class="multi-year-container">
      <TextInput bind:value={from} onInput={onSplitChangeWrapper} width={80} />
      <div style="margin: 0px 7px;">—</div>
      <TextInput bind:value={to} onInput={onSplitChangeWrapper} width={80} />
    </div>
  {/if}
</div>

<style>
  .type-container {
    display: flex;
    align-items: center;
    margin: 5px 0px;
  }

  .type-label {
    margin-right: 7px;
  }

  .multi-year-container {
    display: flex;
    align-items: center;
  }
</style>