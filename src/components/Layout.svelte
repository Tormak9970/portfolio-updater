<script lang="ts">
  import type { EntryUnion } from "src/types/ConfigTypes";
  import { selectedCategory, selectedKey } from "../stores";
	import Entry from "./Entry.svelte";
  import GenerateNewEntry from "./utils/GenerateNewEntry.svelte";

  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
	import { cubicIn } from 'svelte/easing';
  import { SHADOW_ITEM_MARKER_PROPERTY_NAME, dndzone } from "svelte-dnd-action";

	type EntryData<T extends EntryUnion> = {
    key: string,
		data: T
	}

	export let field: LowercaseCategory;
	export let editor:any;
	export let data:EntryData<EntryUnion>[];

  const animateDurationMS = 300;
  function handleDndConsider(e) {
    data = e.detail.items;
  }
  function handleDndFinalize(e) {
    data = e.detail.items;
  }
</script>

<div class="layout">
	<div class="entries-container">
		<div class="entries">
      {#if $selectedCategory !== "Archive"}
        <GenerateNewEntry />
      {/if}

      <div class="dnd-zone" use:dndzone={{ items: data, flipDurationMs: animateDurationMS, dropTargetStyle: {} }} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
        {#each data as entry (entry.key)}
          <div class="entry-wrapper" animate:flip={{ duration:animateDurationMS }}>
            <Entry data={entry.data} key={entry.key} field={field} />
          </div>
        {/each}
      </div>
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
  .dnd-zone {
    width: 100%;
    min-height: 60px;
  }
  .entry-wrapper {
    height: 60px;
    min-width: 300px;
    margin-bottom: 7px;
    position: relative;
  }

	.layout > .editor-container {
		height: 100%;
		flex-grow: 1;
	}
</style>