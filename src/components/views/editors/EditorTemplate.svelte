<script lang="ts">
  import { Icon } from "@component-utils";
  import { Close, Save, Settings } from "@icons";
  import { Button } from "@interactables";
  import { Card } from "@layout";
  import type { EntryState, EntryUnion } from "@types";
  import type { Writable } from "svelte/store";
  import { canSave, showConfirmDeleteModal, showSideNav } from "../../../stores";
  
  export let saveChanges: () => Promise<void>;
  export let emptyMessage: string;
  export let curretStore: Writable<EntryState<EntryUnion>>;
</script>

<div class="editor-template">
  <Card type="filled" extraOptions={{ style: "width: 100%;" }}>
    <div class="header">
      <div class="title">
        <Button type="text" iconType="full" on:click={() => $showSideNav = true}>
          <Icon icon={Settings} />
        </Button>
        <h1 style:margin="0px">{$curretStore.original !== "" ? `Editing: ${$curretStore.original}` : emptyMessage}</h1>
      </div>
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
    <Card type="filled" extraOptions={{ style: "height: 100%;" }}>
      <div class="fields">
        <h3>Fields</h3>
        <slot name="fields" />
      </div>
    </Card>
    <Card type="filled" extraOptions={{ style: "height: 100%; flex-grow: 1;" }}>
      <div class="editor">
        <h3>Writeup</h3>
        <slot name="editor" />
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

  .title {
    display: flex;
    align-items: center;
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
    height: 100%;
    
    border-radius: 4px;
  }

  .hide {
    display: none;
  }
</style>
