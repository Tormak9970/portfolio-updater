<script lang="ts">
	import { afterUpdate, onMount } from "svelte";

	import { config, selectedCategory, experienceList, projectsList } from "../stores";

	import Layout from "./Layout.svelte";

	import ProjectEditor from "./editors/ProjectEditor.svelte";
  import ExperienceEditor from "./editors/ExperienceEditor.svelte";

  const configs = {
    "Projects": {
      "list": projectsList,
      "field": "projects",
      "editor": ProjectEditor
    },
    "Experience": {
      "list": experienceList,
      "field": "experience",
      "editor": ExperienceEditor
    }
  }

  $: currentConfig = configs[$selectedCategory];
  $: editor = currentConfig.editor;
  $: list = currentConfig.list;
  $: field = currentConfig.field as LowercaseCategory;

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

	afterUpdate(() => { handleListUpdate(); });
	onMount(() => { handleListUpdate(); });
</script>

<div class="core">
	<Layout editor={editor} field={field} data={$list}/>
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