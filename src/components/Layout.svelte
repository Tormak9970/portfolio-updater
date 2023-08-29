<script lang="ts">
  import { selectedKey } from "../stores";
	import Entry from "./Entry.svelte";
  import OpenCrtModal from "./modals/OpenCrtModal.svelte";

	type Data = {
		props:any
	}

	export let field: LowercaseCategory;
	export let editor:any;
	export let data:Data[];
</script>

<div class="layout">
	<div class="entries-container">
		<div class="entries">
      {#if field != "archive"}
        <OpenCrtModal modal={field}/>
      {/if}

      {#each data as datEntr}
        <Entry data={datEntr.props.data} key={datEntr.props.key} field={field} />
      {/each}
    </div>
	</div>
	<div class="editor-container">
		{#key $selectedKey}
      <svelte:component this={editor} />
    {/key}
	</div>
</div>

<style>
	.layout {
		width: calc(100% - 20px);
		height: 100%;

    margin: 10px;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		color: var(--font-color);

		overflow: hidden;
	}

	.layout > .entries-container {
    border-radius: 4px;
    background-color: var(--foreground-dark);

		min-width: 334px;

    margin-right: 10px;

    height: calc(100% - 8px);

    padding: 7px;
    padding-bottom: 0px;

    overflow-y: scroll;
    overflow-x: none;
	}

  .entries {
    height: auto;
  }

	.layout > .editor-container {
		height: 100%;
		flex-grow: 1;
	}
</style>