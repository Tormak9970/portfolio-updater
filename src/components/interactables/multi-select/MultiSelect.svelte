<script lang="ts">
  import StaticLabelDropDown from "./StaticLabelDropDown.svelte";
  import Entry from "./Entry.svelte";
  import VerticalSpacer from "../../utils/VerticalSpacer.svelte";

  export let label: string;
  export let options: { name: string, linkId: string }[];
  export let values: { name: string, linkId: string }[] = [];
  export let onChange: (values: { name: string, linkId: string }[]) => Promise<void> = async () => {};

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

<div class="multi-select-wrapper">
  <div style="margin-bottom: 2px;">{label}</div>
  <div class="multi-select">
    <div class="selection-cont">
      {#each values as sel}
        <Entry value={sel} on:removeProj={projectRemoved} />
      {/each}
    </div>
    <StaticLabelDropDown options={available} onChange={projectAdded} width="calc(100% - 23px)" direction="UP" />
    <VerticalSpacer />
  </div>
</div>

<style>
  @import "/theme.css";

  .multi-select {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: var(--foreground);

    border-radius: 4px;
  }

  .selection-cont {
    width: 100%;

    margin-top: 14px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
