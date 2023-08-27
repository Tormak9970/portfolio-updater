<script lang="ts">
  import { archList, artList, expList, orgsList, projsList } from "../listStores";
	import { afterUpdate, onMount } from "svelte";

	import { config, selectedCategory } from "../stores";

	import EditorPage from "./universal/EditorPage.svelte";

	import ProjectEditor from "./editors/ProjectEditor.svelte";
  import ArtEditor from "./editors/ArtEditor.svelte";
  import ExperienceEditor from "./editors/ExperienceEditor.svelte";
  import OrganizationEditor from "./editors/OrganizationEditor.svelte";
  import ArchiveEditor from "./editors/ArchiveEditor.svelte";
  
	import ProjectEntry from "./entries/ProjectEntry.svelte";
  import ArtEntry from "./entries/ArtEntry.svelte";
  import ExperienceEntry from "./entries/ExperienceEntry.svelte";
  import OrganizationEntry from "./entries/OrganizationEntry.svelte";
  import ArchiveEntry from "./entries/ArchiveEntry.svelte";

  const configs = {
    "Projects": {
      "list": $projsList,
      "field": "projects",
      "editor": ProjectEditor,
      "entry": ProjectEntry
    },
    "Art": {
      "list": $artList,
      "field": "art",
      "editor": ArtEditor,
      "entry": ArtEntry
    },
    "Experience": {
      "list": $expList,
      "field": "experience",
      "editor": ExperienceEditor,
      "entry": ExperienceEntry
    },
    "Organizations": {
      "list": $orgsList,
      "field": "organizations",
      "editor": OrganizationEditor,
      "entry": OrganizationEntry
    },
    "Archive": {
      "list": $archList,
      "field": "archive",
      "editor": ArchiveEditor,
      "entry": ArchiveEntry
    }
  }

  $: currentConfig = configs[$selectedCategory];
  $: editor = currentConfig.editor;
  $: entry = currentConfig.entry;
  $: list = currentConfig.list;
  $: field = currentConfig.field;

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

<div>
	<EditorPage main={editor} crtModal={field} entry={entry} data={list}/>
</div>

<style>
	@import "/theme.css";

	div {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		color: var(--font-color);
	}
</style>