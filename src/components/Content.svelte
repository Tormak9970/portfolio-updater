<script lang="ts">
	import { config, experienceList, projectsList, selectedCategory, selectedKey, showConfirmDeleteModal, showSetup, showSideNav, showUnsavedChangesModal } from "../stores";

	import Setup from "./views/Setup.svelte";

  import ConfirmDeleteModal from "./modals/ConfirmDeleteModal.svelte";
  import UnsavedChangesModal from "./modals/UnsavedChangesModal.svelte";

  import { ErrorSnackbar, InfoSnackbar } from "@component-utils";
  import { setSettingsPath } from "@utils";
  import { afterUpdate, onMount } from "svelte";
  import { overrideItemIdKeyNameBeforeInitialisingDndZones as overrideSvelteDndKey } from "svelte-dnd-action";
  import { showErrorSnackbar, showInfoSnackbar } from "../stores";
  import SideNav from "./modals/SideNav.svelte";
  import ExperienceEditor from "./views/editors/ExperienceEditor.svelte";
  import ProjectEditor from "./views/editors/ProjectEditor.svelte";
  
  overrideSvelteDndKey("key");

  $: list = $selectedCategory === "Projects" ? projectsList : experienceList;
  $: editor = $selectedCategory === "Projects" ? ProjectEditor : ExperienceEditor;
  $: field = $selectedCategory.toLowerCase() as "projects" | "experience";

  function handleListUpdate() {
    if ($list.length === 0) {
      $list = Object.entries($config[field]).map(([key, data]) => {
        return {
          key: key,
          data: data,
        }
      }).sort((a, b) => a.data.index - b.data.index);
    }
  }

	afterUpdate(() => {
    if (!$showSetup) handleListUpdate();
  });

  onMount(() => {
    setSettingsPath();
  });
</script>

<ErrorSnackbar bind:show={$showErrorSnackbar} />
<InfoSnackbar bind:show={$showInfoSnackbar} />

{#if $showUnsavedChangesModal}
  <UnsavedChangesModal />
{/if}
{#if $showConfirmDeleteModal}
  <ConfirmDeleteModal />
{/if}

<div class="content">
  {#if $showSideNav}
    <SideNav data={$list} />
  {/if}
  {#if $showSetup}
    <Setup />
  {:else}
    <div class="layout">
      {#key $selectedKey}
        <svelte:component this={editor} />
      {/key}
    </div>
  {/if}
</div>

<style>
	.content {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

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
</style>