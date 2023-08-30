<script lang="ts">
  import type { OutputData } from "@editorjs/editorjs";
  import { config, currentArchive, currentProject, archiveList, projectsList, canSave } from "../../stores";
  import {
    getKeyFromName,
    updateSettings,
    writeConfig,
  } from "../../lib/Utils";
  import EditorJs from "../EditorJS.svelte";
  import DropDown from "../interactables/DropDown.svelte";
  import VerticalSpacer from "../utils/VerticalSpacer.svelte";
  import { categories, difficulties, statusOptions } from "../../lib/ProjectDropdowns";
  import TextInput from "../interactables/TextInput.svelte";
  import ImagePreview from "../interactables/ImagePreview.svelte";
  import type { ProjectEntry } from "../../types/ConfigTypes";
  import EditorTemplate from "./EditorTemplate.svelte";

  const organizations = $config.organizations ?[ { label: "none", data: "none" }, ...Object.keys($config.organizations).map((entry: string) => { return { label: entry, data: entry } }) ] : [];

  let image = $currentArchive.data.img;
  let name = $currentArchive.data.name;
  let time = $currentArchive.data.time;
  let link = $currentArchive.data.link;

  let category = $currentArchive.data.category;
  let organization = $currentArchive.data.org;
  let status = $currentArchive.data.status;
  let difficulty = $currentArchive.data.difficulty;

  let content = $currentArchive.data.content as OutputData;

  async function allowSave() {
    $canSave = true;
  }

  async function unarchiveProject() {
    const cfg = $config;

    cfg["projects"][$currentArchive.key] = $currentArchive.data;

    $currentProject = {
      "original": $currentArchive.original,
      "key": $currentArchive.key,
      "data": $currentArchive.data
    }

    delete cfg["archive"][$currentArchive.key];
    $currentArchive = {
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

    $config = cfg;
    await writeConfig(JSON.stringify(cfg, null, "\t"));
		await updateSettings({ prop: "currentProject", data: $currentProject });
		await updateSettings({ prop: "currentArchive", data: $currentArchive });

		$archiveList = Object.entries($config.archive).map(([key, data]) => {
      return {
        key: key,
				data: data,
			}
    });

    $projectsList = Object.entries($config.projects).map(([key, data]) => {
      return {
        key: key,
				data: data,
			}
    });
  }
  
  async function saveChanges() {
    const cfg = $config;

		if (name !== $currentArchive.data.name) {
      const newKey = getKeyFromName(name);

			cfg.archive[newKey] = cfg.archive[$currentArchive.key];
			delete cfg.archive[$currentArchive.key];

			$currentArchive.key = newKey;
		}

    const changedArchivedProject: ProjectEntry = {
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

		$currentArchive = {
      "original": $currentProject.original,
      "key": $currentProject.key,
      "data": changedArchivedProject
    };

		await updateSettings({ prop: "currentArchive", data: $currentArchive });

		cfg.archive[$currentArchive.key] = changedArchivedProject;

		await writeConfig(JSON.stringify(cfg, null, "\t"));

		$config = cfg;
		$canSave = false;
  }
</script>

<EditorTemplate saveChanges={saveChanges} curretStore={currentArchive} archiveFunction={unarchiveProject} emptyMessage="Select an Archived Project to get started">
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