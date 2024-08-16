<script lang="ts">
  import TextInput from "../TextInput.svelte";
  import Tag from "./Tag.svelte";

  export let label: string;
  export let value: string[];
  export let onChange: (tags: string[]) => void = () => {};

  let newTagValue = "";

  function onNewTagChange() {
    value = [ ...value, newTagValue ];
    newTagValue = "";
    onChange(value);
  }

  function onTagRemove(index: number) {
    value.splice(index, 1);
    value = [ ...value ]
  }
</script>

<div class="tags-input">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  {#if label != ""}
    <label style="margin-bottom: 2px; font-size: 16px; user-select: none;">{label}</label>
  {/if}
  <div class="tags-container">
    {#each value as tag, index}
      <Tag tag={tag} index={index} onDelete={onTagRemove} />
    {/each}
  </div>
  <TextInput bind:value={newTagValue} onChange={onNewTagChange} />
</div>

<style>
  .tags-container {
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;

    max-width: 250px;
  }
</style>