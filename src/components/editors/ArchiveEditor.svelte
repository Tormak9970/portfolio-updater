<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import type { OutputData } from "@editorjs/editorjs";
  import { config, currentArchive, currentProject, archiveList, projectsList } from "../../stores";
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
  import Button from "../interactables/Button.svelte";
  import ConfirmDelete from "../modals/ConfirmDelete.svelte";
  import type { ProjectEntry } from "../../types/ConfigTypes";

  let canSave = false;

  const organizations = $config.organizations ?[ { label: "none", data: "none" }, ...Object.keys($config.organizations).map((entry: string) => { return { label: entry, data: entry } }) ] : [];

  $: console.log($currentArchive)

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
    canSave = true;
  }

  function confirmDelete() {
    toast.push({
      component: {
        src: ConfirmDelete,
        props: {
          properties: ["archive", $currentArchive.data.name],
        },
        sendIdTo: "toastId",
      },
      target: "top",
      dismissable: false,
      initial: 0,
      intro: { y: -192 },
      theme: {
        "--toastPadding": "0",
        "--toastBackground": "transparent",
        "--toastMsgPadding": "0",
      },
    });
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
		canSave = false;
  }
</script>

<div class="archive-editor">
	<div class="header">
    <h1>{$currentArchive.original !== "" ? `Editing: ${$currentArchive.original}` : "Select an Archived Project to get started"}</h1>
    <div class="btn-cont" class:hide={$currentArchive.original === ""}>
      {#if canSave}
        <Button label="Save" width="90px" height="30px" highlight onClick={saveChanges} />
        <div style="height: 1px; width: 10px" />
      {/if}
      <Button label="Unarchive" width="90px" height="30px" warn onClick={unarchiveProject} />
      <div style="height: 1px; width: 10px" />
      <Button label="Delete" width="90px" height="30px" warn onClick={confirmDelete} />
    </div>
  </div>
  <div class="content" class:hide={$currentArchive.original === ""}>
    <div class="fields">
      <h3>Fields</h3>
      <div class="scroll-container">
        <ImagePreview
          label={"Project Image"}
          placeholder={"The project image"}
          bind:value={image}
          onChange={allowSave}
        />

        <TextInput
          label={"Name"}
          placeholder={"The project name"}
          bind:value={name}
          onChange={allowSave}
        />
        <VerticalSpacer />

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
    </div>
    <div class="editor">
      <h3>Writeup</h3>
      <div class="scroll-container">
        <EditorJs onChange={allowSave} bind:content={content} />
      </div>
    </div>
  </div>
</div>

<style>
	.archive-editor {
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
    height: calc(100% - 25px);
    overflow-y: scroll;
  }

  .hide {
    display: none !important;
  }
</style>