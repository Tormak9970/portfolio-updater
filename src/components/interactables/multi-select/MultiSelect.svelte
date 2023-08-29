<script lang="ts">
  import StaticLabelDropDown from "./StaticLabelDropDown.svelte";
  import Entry from "./Entry.svelte";

  export let label: string;
  export let options: { name: string, linkId: string }[];
  export let values: { name: string, linkId: string }[] = [];
  export let onChange: (values: { name: string, linkId: string }[]) => void = () => {};

  $: available = options.filter((o) => !values.includes(o)).map(({ name, linkId }) => { return { label: name, data: linkId } });

  function projectAdded(linkId: string) {
    values.push(options.find((entry) => entry.linkId === linkId));
    values = [...values];
    onChange(values);
  }

  function projectRemoved(event: { detail: { name: string; linkId: string } }) {
    values.splice(values.indexOf(event.detail), 1);
    values = [...values];
    onChange(values);
  }
</script>

<div class="multi-select">
  <div>{label}</div>
  <div class="sel-cont">
    {#each values as sel}
      <Entry value={sel} on:removeProj={projectRemoved} />
    {/each}
  </div>
  <StaticLabelDropDown options={available} onChange={projectAdded} />
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

    border-radius: 4px;
  }

  .sel-cont {
    width: 90%;

    margin-top: 14px;
  }
</style>
