<script lang="ts">
  import { Icon } from "@component-utils";
  import { scrollShadow } from "@directives";
  import { Close, Save } from "@icons";
  import { Button } from "@interactables";
  import { Card } from "@layout";
  import type { EntryState, EntryUnion } from "@types";
  import type { Writable } from "svelte/store";
  import { canSave, showConfirmDeleteModal } from "../../../stores";
  
  export let saveChanges: () => Promise<void>;
  export let emptyMessage: string;
  export let curretStore: Writable<EntryState<EntryUnion>>;
  export let useFields = true;
</script>

<div class="editor-template">
  <Card type="filled" extraOptions={{ style: "width: 100%;" }}>
    <div class="header">
      <h1 style:margin="0px">{$curretStore.original !== "" ? `Editing: ${$curretStore.original}` : emptyMessage}</h1>
      <div class="btn-cont" class:hide={$curretStore.original === ""}>
        {#if $canSave}
          <Button type="text" iconType="full" on:click={saveChanges}>
            <Icon icon={Save} />
          </Button>
        {/if}
        <Button type="text" iconType="full" on:click={() => $showConfirmDeleteModal = true}>
          <Icon icon={Close} />
        </Button>
      </div>
    </div>
  </Card>
  <div class="content" class:hide={$curretStore.original === ""}>
    {#if useFields}
      <Card type="filled" extraOptions={{ style: "height: 100%;" }}>
        <div class="fields">
          <h3>Fields</h3>
          <slot name="fields" />
        </div>
      </Card>
    {/if}
    <Card type="filled" extraOptions={{ style: "height: 100%; flex-grow: 1;" }}>
      <div class="editor">
        <h3>Writeup</h3>
        <div class="scroll-wrapper">
          <div class="scroll-container" use:scrollShadow={{ background: "--m3-scheme-surface-container" }}>
            <slot name="editor" />
          </div>
        </div>
      </div>
    </Card>
  </div>
</div>

<style>
	.editor-template {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;

    gap: 1rem;

		position: relative;
	}

	.header {
		width: 100%;

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.header > .btn-cont {
		display: flex;
		flex-direction: row;
    gap: 0.5rem;
	}

  .content {
    width: 100%;
    height: calc(100% - 88px);

    display: flex;
    flex-direction: row;

    gap: 1rem;
  }

  .content h3 {
    margin: 0px;
  }

  .fields {
    padding: 0.5rem;
    height: calc(100% - 14px);
  }

  .editor {
    padding: 7px;
    padding-left: 10px;
    height: calc(100% - 14px);
    
    border-radius: 4px;
    background-color: var(--foreground-dark);
  }

  .scroll-wrapper {
    height: 100%;
    flex-grow: 1;

    position: relative;
  }

  .scroll-container {
    height: calc(100% - 25px);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .hide {
    display: none;
  }
</style>
