<script lang="ts">
  import type { EntryUnion } from "../types/ConfigTypes";
  import { config, selectedKey } from "../stores";
	import Entry from "./Entry.svelte";
  import GenerateNewEntry from "./utils/GenerateNewEntry.svelte";

  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import { writeConfig } from "../lib/Utils";

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

    const newData = {};

    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      entry.data.index = i;

      newData[entry.key] = entry.data;
    }

    $config[field] = newData;
    writeConfig(JSON.stringify($config, null, '\t'));
  }
</script>

<div class="layout">
  <div class="grad-left" />
  <div class="grad-right" />
	<div class="entries-container">
		<div class="entries">
      <GenerateNewEntry />

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

    position: relative;

		color: var(--font-color);

    background-color: var(--background);
    background:
      linear-gradient(-90deg, var(--background) 1px, transparent 1px),
      linear-gradient(var(--background) 1px, transparent 1px),
      linear-gradient(-90deg, var(--background) 1px, transparent 1px),
      linear-gradient(var(--background) 1px, transparent 1px),
      linear-gradient(transparent 6px, transparent 6px, transparent 156px, transparent 156px),
      linear-gradient(-90deg,var(--background) 1px, transparent 1px),
      linear-gradient(-90deg, transparent 6px, transparent 6px, transparent 156px, transparent 156px),
      linear-gradient(var(--background) 1px, transparent 1px),
      transparent;

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

  .grad-left {
    position: absolute;
    z-index: 1;
    top: 0%;
    left: -50%;
    width: 150vh;
    height: 150vh;
    opacity: .3;
    background: radial-gradient(circle, var(--highlight-alt) 0%, transparent 70%);
    animation: 14s intro;
    pointer-events: none;
  }

  .grad-right {
    position: absolute;
    z-index: 1;
    top: -50%;
    left: 50%;
    width: 150vh;
    height: 150vh;
    opacity: .3;
    background: radial-gradient(circle, var(--highlight) 0%, transparent 70%);
    animation: 6s intro;
    pointer-events: none;
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