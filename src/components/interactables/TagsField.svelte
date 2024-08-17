<script lang="ts">
  import { Close } from "@icons";
  import { createEventDispatcher } from "svelte";
  import Chip from "./chip/Chip.svelte";
  import TextField from "./TextField.svelte";

  export let name: string;
  export let value: string[];

  let newTagValue = "";

  const dispatch = createEventDispatcher();

  function onNewTagChange() {
    value = [ ...value, newTagValue ];
    newTagValue = "";
    dispatch("change", value);
  }

  function onTagRemove(index: number) {
    value.splice(index, 1);
    value = [ ...value ]
  }
</script>

<div class="tags-input">
  <TextField
    name={name}
    extraWrapperOptions={{
      style: "width: 100%;"
    }}
    bind:value={newTagValue}
    on:change={onNewTagChange}
  />
  <div class="tags-container">
    {#each value as tag, index}
      <Chip type="general" trailingIcon={Close} on:trailingClick={() => onTagRemove(index)}>{tag}</Chip>
    {/each}
  </div>
</div>

<style>
  .tags-container {
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;

    gap: 0.5rem;

    max-width: 300px;
  }
</style>