<script lang="ts">
	import type { OutputData } from "@editorjs/editorjs";

	import {
		config,
    canSave,
    currentProject,
    projectsList
	} from "../../stores";
	import {
    getKeyFromName,
		updateSettings,
		writeConfig,
	} from "../../lib/Utils";
	import ImagePreview from "../interactables/ImagePreview.svelte";
  import TextInput from "../interactables/TextInput.svelte";
  import TextArea from "../interactables/TextArea.svelte";
  import EditorJs from "../EditorJS.svelte";
  import VerticalSpacer from "../utils/VerticalSpacer.svelte";
  import type { ProjectEntry } from "src/types/ConfigTypes";
  import EditorTemplate from "./EditorTemplate.svelte";
  import TagsInput from "../interactables/tags/TagsInput.svelte";

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

		$currentProject = {
      "original": $currentProject.original,
      "key": $currentProject.key,
      "data": changedProject
    };

		await updateSettings({ prop: "currentProject", data: $currentProject });
    
		cfg.projects[$currentProject.key] = changedProject;

		await writeConfig(JSON.stringify(cfg, null, "\t"));

		$config = cfg;
		$canSave = false;
    
		$projectsList = Object.entries($config.projects).map(([key, data]) => {
      return {
        key: key,
				data: data,
			}
    });
  }
</script>

<EditorTemplate saveChanges={saveChanges} curretStore={currentProject} emptyMessage="Select a Project to get started">
  <div slot="fields">
    <TextInput
      label={"Name"}
      placeholder={"The project name"}
      bind:value={name}
      onChange={allowSave}
    />
    <VerticalSpacer />

    <ImagePreview
      label={"Project Image"}
      placeholder={"The project image"}
      bind:value={image}
      onChange={allowSave}
    />

    <VerticalSpacer />

    <TextInput
      label={"Link"}
      placeholder={"A link to the project"}
      bind:value={link}
      onChange={allowSave}
      width={200}
    />

    <VerticalSpacer />
    
    <TagsInput
      label="Tech"
      bind:value={tech}
      onChange={allowSave}
    />
  </div>
  <div slot="editor">
    <TextArea
      label={"Short Description"}
      placeholder="A short description of the project"
      bind:value={description}
      onChange={allowSave}
    />

    <EditorJs onChange={allowSave} bind:content={content} />
  </div>
</EditorTemplate>