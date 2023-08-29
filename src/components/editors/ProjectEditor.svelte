<script lang="ts">
	import type { OutputData } from "@editorjs/editorjs";

	import {
		config,
		selectedCategory,
    currentProject,
    currentArchive,
    archiveList,
    projectsList
	} from "../../stores";
	import {
    getKeyFromName,
		updateSettings,
		writeConfig,
	} from "../../lib/Utils";
	import ImagePreview from "../interactables/ImagePreview.svelte";
  import TextInput from "../interactables/TextInput.svelte";
  import DropDown from "../interactables/DropDown.svelte";
  import EditorJs from "../EditorJS.svelte";
  import VerticalSpacer from "../utils/VerticalSpacer.svelte";
  import { categories, difficulties, statusOptions } from "../../lib/ProjectDropdowns";
  import type { ProjectEntry } from "src/types/ConfigTypes";
    import EditorTemplate from "./EditorTemplate.svelte";

	let canSave = false;

  const organizations = $config.organizations ?[ { label: "none", data: "none" }, ...Object.keys($config.organizations).map((entry: string) => { return { label: entry, data: entry } }) ] : [];

  let image = $currentProject.data.img;
  let name = $currentProject.data.name;
  let time = $currentProject.data.time;
  let link = $currentProject.data.link;

  let category = $currentProject.data.category;
  let organization = $currentProject.data.org;
  let status = $currentProject.data.status;
  let difficulty = $currentProject.data.difficulty;

  let content = $currentProject.data.content as OutputData;

  async function allowSave() {
    canSave = true;
  }

	async function archiveProject() {
		const cfg = $config;

		cfg["archive"][$currentProject.key] = $currentProject.data;

    $currentArchive = {
      "original": $currentProject.original,
      "key": $currentProject.key,
      "data": $currentProject.data
    }

		delete cfg["projects"][$currentProject.key];
		$currentProject = {
			original: "",
			key: "",
			data: {
				category: "",
				name: "",
				time: "",
				status: "",
				difficulty: "",
				description: "",
				content: {},
				link: "",
				isRelative: false,
				img: "",
				org: "",
			},
		};
		$selectedCategory = "Archive";

		$config = cfg;
		await writeConfig(JSON.stringify(cfg, null, "\t"));
		await updateSettings({ prop: "currentProject", data: $currentProject });
		await updateSettings({ prop: "currentArchive", data: $currentArchive });

		$projectsList = [];
		for (const proj of Object.entries($config.projects)) {
			$projectsList.push({
				props: {
					data: proj[1],
					// @ts-ignore
					category: proj[1].category,
					key: proj[0],
				},
			});
		}

		$archiveList = [];
		for (const proj of Object.entries($config.archive)) {
			$archiveList.push({
				props: {
					data: proj[1],
					// @ts-ignore
					category: proj[1].category,
					key: proj[0],
				},
			});
		}
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
      category: category,
      name: name,
      time: time,
      status: status,
      difficulty: difficulty,
      description: content.blocks[1].data.text,
      content: content,
      link: link,
      isRelative: $currentProject.data.isRelative,
      img: image,
      org: organization
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
		canSave = false;
  }
</script>

<EditorTemplate saveChanges={saveChanges} curretStore={currentProject} archiveFunction={archiveProject} emptyMessage="Select a Project to get started" bind:canSave={canSave}>
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

    <TextInput
      label={"Time"}
      placeholder={"# hours"}
      bind:value={time}
      onChange={allowSave}
    />
    <VerticalSpacer />

    <TextInput
      label={"Link"}
      placeholder={"A link to the project"}
      bind:value={link}
      onChange={allowSave}
    />
    <VerticalSpacer />
    
    <DropDown label={"Category"} options={categories} width={"148px"} bind:value={category} onChange={allowSave} />
    <VerticalSpacer />

    <DropDown label={"Organization"} options={organizations} width={"148px"} bind:value={organization} onChange={allowSave} />
    <VerticalSpacer />

    <DropDown label={"Difficulty"} options={difficulties} width={"148px"} bind:value={difficulty} onChange={allowSave} />
    <VerticalSpacer />

    <DropDown label={"Status"} options={statusOptions} width={"148px"} bind:value={status} onChange={allowSave} />
  </div>
  <div slot="editor">
    <EditorJs onChange={allowSave} bind:content={content} />
  </div>
</EditorTemplate>