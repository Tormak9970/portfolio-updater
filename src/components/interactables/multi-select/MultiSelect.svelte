<script lang="ts">
  import DropDown from "./DropDown.svelte";
  import Entry from "./Entry.svelte";

  export let label: string;
  export let options: { name: string; linkId: string }[];
  export let values: { name: string; linkId: string }[] = [];
  export let handler: (values: { name: string; linkId: string }[]) => void = () => {};

  $: available = options.filter((o) => !values.includes(o));

  function projectAdded(event: { detail: { name: string; linkId: string } }) {
    values.push(event.detail);
    values = [...values];
    handler(values);
  }

  function projectRemoved(event: { detail: { name: string; linkId: string } }) {
    values.splice(values.indexOf(event.detail), 1);
    values = [...values];
    handler(values);
  }
</script>

<div class="multi-select">
  <div>{label}</div>
  <div class="sel-cont">
    {#each values as sel}
      <Entry value={sel} on:removeProj={projectRemoved} />
    {/each}
  </div>
  <DropDown values={available} on:addedProject={projectAdded} />
</div>

<style>
  @import "/theme.css";

  .multi-select {
    width: 80%;
    margin: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: var(--foreground);

    border-radius: 8px;
  }

  .sel-cont {
    width: 90%;

    margin-top: 14px;
  }
</style>
