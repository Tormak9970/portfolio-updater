<script lang="ts">
	import type { OutputData } from "@editorjs/editorjs";

	import { ImageField, TagsField, TextArea, TextField } from "@interactables";
	import type { ProjectEntry } from "@types";
	import { getKeyFromName } from "@utils";
	import { canSave, config, currentProject } from "../../../stores";
	import EditorJs from "./EditorJS.svelte";
	import EditorTemplate from "./EditorTemplate.svelte";

  let image = $currentProject.data.image;
  let name = $currentProject.data.name;
  let link = $currentProject.data.link;
  let description = $currentProject.data.description;
  let tech = $currentProject.data.tech;

  let content = $currentProject.data.content as OutputData;

  async function allowSave() {
    $canSave = true;
  }

  async function saveChanges() {
    const cfg = $config;

		if (name !== $currentProject.data.name) {
      const newKey = getKeyFromName(name);

			cfg.projects[newKey] = cfg.projects[$currentProject.key];
			delete cfg.projects[$currentProject.key];

			$currentProject.key = newKey;
		}

    const changedProject: ProjectEntry = {
      index: $currentProject.data.index,
      name: name,
      description: description,
      content: content,
      link: link,
      image: image,
      tech: tech
    }

    console.log(changedProject);

		// $currentProject = {
    //   "original": $currentProject.original,
    //   "key": $currentProject.key,
    //   "data": changedProject
    // };

		// await updateSettings({ prop: "currentProject", data: $currentProject });
    
		// cfg.projects[$currentProject.key] = changedProject;

		// await writeConfig(JSON.stringify(cfg, null, "\t"));

		// $config = cfg;
		// $canSave = false;
    
		// $projectsList = Object.entries($config.projects).map(([key, data]) => {
    //   return {
    //     key: key,
		// 		data: data,
		// 	}
    // });
  }
</script>

<EditorTemplate saveChanges={saveChanges} curretStore={currentProject} emptyMessage="Select a Project to get started">
  <div slot="fields" class="fields">
    <TextField
      name={"Name"}
      extraWrapperOptions={{
        style: "width: 100%;"
      }}
      bind:value={name}
      on:change={allowSave}
    />

    <ImageField
      name={"Project Image"}
      bind:value={image}
      onChange={allowSave}
    />

    <TextField
      name={"Link"}
      extraWrapperOptions={{
        style: "width: 100%;"
      }}
      bind:value={link}
      on:change={allowSave}
    />
    
    <TagsField
      name="Tech Used"
      bind:value={tech}
      on:change={allowSave}
    />
  </div>
  <div slot="editor" class="editor-container">
    <TextArea
      name={"Short Description"}
      extraWrapperOptions={{
        style: "width: 100%; height: 100px; margin-top: 0.5rem; margin-right: 0.5rem;"
      }}
      bind:value={description}
      on:change={allowSave}
    />

    <EditorJs onChange={allowSave} bind:content={content} />
  </div>
</EditorTemplate>

<style>
  .fields {
    width: 100%;

    padding-top: 0.5rem;

    display: flex;
    flex-direction: column;

    gap: 0.5rem;
  }

  .editor-container {
    height: calc(100% - 25px);
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>