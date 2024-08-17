<script lang="ts">
  import { Button } from "@interactables";
  import { selectedKey, showSideNav } from "../../stores";

  import { Icon } from "@component-utils";
  import { Settings } from "@icons";

	export let editor:any;
</script>

<div class="layout">
  <div class="left-container">
    <Button type="text" iconType="full" on:click={() => $showSideNav = true}>
      <Icon icon={Settings} />
    </Button>
  </div>
	<div class="editor-container styled-scrollbar">
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

    position: relative;

		overflow: hidden;
	}

  .left-container {
    margin-top: 1.25rem;
  }

	.layout > .editor-container {
		height: 100%;
		flex-grow: 1;
	}
</style>