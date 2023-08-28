<script lang="ts">
  import { archList, artList, expList, orgsList, projsList } from "../listStores";
	import { afterUpdate, onMount } from "svelte";

	import { config, selectedCategory } from "../stores";

	import Layout from "./Layout.svelte";

	import ProjectEditor from "./editors/ProjectEditor.svelte";
  import ArtEditor from "./editors/ArtEditor.svelte";
  import ExperienceEditor from "./editors/ExperienceEditor.svelte";
  import OrganizationEditor from "./editors/OrganizationEditor.svelte";
  import ArchiveEditor from "./editors/ArchiveEditor.svelte";

  const configs = {
    "Projects": {
      "list": $projsList,
      "field": "projects",
      "editor": ProjectEditor
    },
    "Art": {
      "list": $artList,
      "field": "art",
      "editor": ArtEditor
    },
    "Experience": {
      "list": $expList,
      "field": "experience",
      "editor": ExperienceEditor
    },
    "Organizations": {
      "list": $orgsList,
      "field": "organizations",
      "editor": OrganizationEditor
    },
    "Archive": {
      "list": $archList,
      "field": "archive",
      "editor": ArchiveEditor
    }
  }

  $: currentConfig = configs[$selectedCategory];
  $: editor = currentConfig.editor;
  $: list = currentConfig.list;
  $: field = currentConfig.field as LowercaseCategory;

  function handleListUpdate() {
    list = [];

		for (const entry of Object.entries($config[field])) {
			list.push({
				props: {
					data: entry[1],
					// @ts-ignore
					category: entry[1].category,
					key: entry[0]
				}
			});
		}
  }

	afterUpdate(() => { handleListUpdate(); });
	onMount(() => { handleListUpdate(); });
</script>

<div class="core">
	<Layout editor={editor} field={field} data={list}/>
</div>

<style>
	@import "/theme.css";

	.core {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		color: var(--font-color);
	}
</style>