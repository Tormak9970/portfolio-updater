<script lang="ts">
	import { toast } from "@zerodevx/svelte-toast";
	import type { OutputData } from "@editorjs/editorjs";

	import {
		config,
		selectedCategory,
    currentProject,
    currentArchive
	} from "../../stores";
	import {
    getKeyFromName,
		updateSettings,
		writeConfig,
	} from "../../lib/Utils";
	import ImagePreview from "../interactables/ImagePreview.svelte";
	import ConfirmDelete from "../modals/ConfirmDelete.svelte";
	import { archList, projsList } from "../../listStores";
  import TextInput from "../interactables/TextInput.svelte";
  import DropDown from "../interactables/DropDown.svelte";
  import EditorJs from "../EditorJS.svelte";
  import Button from "../interactables/Button.svelte";
  import VerticalSpacer from "../utils/VerticalSpacer.svelte";
  import { categories, difficulties, statusOptions } from "../../lib/ProjectDropdowns";
  import type { ProjectEntry } from "src/types/ConfigTypes";

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

	function confirmDelete() {
		toast.push({
			component: {
				src: ConfirmDelete,
				props: {
					properties: ["projects", $currentProject.data.name],
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

		$projsList = [];
		for (const proj of Object.entries($config.projects)) {
			$projsList.push({
				props: {
					data: proj[1],
					// @ts-ignore
					category: proj[1].category,
					key: proj[0],
				},
			});
		}

		$archList = [];
		for (const proj of Object.entries($config.archive)) {
			$archList.push({
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

<div class="project-editor">
	<div class="header">
    <h1>{$currentProject.original !== "" ? `Editing: ${$currentProject.original}` : "Select an Project to get started"}</h1>
    <div class="btn-cont" class:hide={$currentProject.original === ""}>
      {#if canSave}
        <Button label="Save" width="90px" height="30px" highlight onClick={saveChanges} />
        <div style="height: 1px; width: 10px" />
      {/if}
      <Button label="Archive" width="90px" height="30px" warn onClick={archiveProject} />
      <div style="height: 1px; width: 10px" />
      <Button label="Delete" width="90px" height="30px" warn onClick={confirmDelete} />
    </div>
  </div>
  <div class="content" class:hide={$currentProject.original === ""}>
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
	.project-editor {
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

	.hide {
		display: none;
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
</style>
