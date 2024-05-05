<script lang="ts">
  import { canSave, selectedCategory, showConfirmDeleteModal } from "../../stores";
  import type { Writable } from "svelte/store";
  import type { EntryState, EntryUnion } from "../../types/ConfigTypes";
  import Button from "../interactables/Button.svelte";
  
  export let saveChanges: () => Promise<void>;
  export let emptyMessage: string;
  export let curretStore: Writable<EntryState<EntryUnion>>;
  export let useFields = true;
</script>

<div class="editor-template">
	<div class="header">
    <h1>{$curretStore.original !== "" ? `Editing: ${$curretStore.original}` : emptyMessage}</h1>
    <div class="btn-cont" class:hide={$curretStore.original === ""}>
      {#if $canSave}
        <Button label="Save" width="90px" height="30px" highlight onClick={saveChanges} />
        <div style="height: 1px; width: 10px" />
      {/if}
      <Button label="Delete" width="90px" height="30px" warn onClick={() => $showConfirmDeleteModal = true} />
    </div>
  </div>
  <div class="content" class:hide={$curretStore.original === ""}>
    {#if useFields}
      <div class="fields">
        <h3>Fields</h3>
        <div class="scroll-container">
          <slot name="fields" />
        </div>
      </div>
    {/if}
    <div class="editor">
      <h3>Writeup</h3>
      <div class="scroll-container">
        <slot name="editor" />
      </div>
    </div>
  </div>
</div>

<style>
	.editor-template {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: var(--font-color);

		position: relative;
	}

	.header {
		width: calc(100% - 40px);

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

    padding: 0px 20px;

    margin-bottom: 10px;
    
    border-radius: 4px;
    background-color: var(--foreground-dark);
	}

	.header > .btn-cont {
		display: flex;
		flex-direction: row;
    justify-content: flex-end;
    width: 290px;
	}

  .content {
    width: 100%;
    height: calc(100% - 93px);

    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .content h3 {
    margin: 0px;
  }

  .fields {
    padding: 7px;
    padding-left: 10px;
    height: calc(100% - 14px);
    margin-right: 10px;

    border-radius: 4px;
    background-color: var(--foreground-dark);
  }

  .editor {
    padding: 7px;
    padding-left: 10px;
    height: calc(100% - 14px);

    flex-grow: 1;
    
    border-radius: 4px;
    background-color: var(--foreground-dark);
  }

  .scroll-container {
    padding-right: 7px;
    height: calc(100% - 25px);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .hide {
    display: none !important;
  }
</style>
