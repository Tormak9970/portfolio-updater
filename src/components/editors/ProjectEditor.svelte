<script lang="ts">
	import { toast } from "@zerodevx/svelte-toast";
	import type { OutputData } from "@editorjs/editorjs";

	import {
		state,
		config,
		changedKey,
		selectedCategory
	} from "../../stores";
	import {
		updateSettings,
		writeConfig,
	} from "../../Utils";
	import ImagePreview from "../interactables/ImagePreview.svelte";
	import ConfirmDelete from "../modals/ConfirmDelete.svelte";
	import { archList, projsList } from "../../listStores";
  import TextInput from "../interactables/TextInput.svelte";
  import DropDown from "../interactables/DropDown.svelte";
  import EditorJs from "../EditorJS.svelte";
  import Button from "../interactables/Button.svelte";
  import VerticalSpacer from "../utils/VerticalSpacer.svelte";

	let canSave = false;

  const categories = [
    {
      label: "Web Dev",
      data: "web-dev"
    },
    {
      label: "Software Engineering",
      data: "software-engineering"
    },
    {
      label: "Web Games",
      data: "web-games"
    },
    {
      label: "Blender",
      data: "blender"
    },
    {
      label: "Steam Deck",
      data: "steam-deck"
    },
    {
      label: "Education",
      data: "education"
    },
    {
      label: "Miscellaneous",
      data: "miscellaneous"
    }
  ];

  const organizations = $config.organizations ?[ { label: "none", data: "none" }, ...Object.keys($config.organizations).map((entry: string) => { return { label: entry, data: entry } }) ] : [];

  const difficulties = [
    {
      label: "Simple",
      data: "Simple"
    },
    {
      label: "Moderate",
      data: "Moderate"
    },
    {
      label: "Complex",
      data: "Complex"
    }
  ];

  const statusses = [
    {
      label: "Not Live / Obsolete",
      data: "Not Live / Obsolete"
    },
    {
      label: "In Progress",
      data: "In Progress"
    },
    {
      label: "Complete",
      data: "Complete"
    }
  ];

  let category = $state.projects.data.category;
  let organization = $state.projects.data.org;
  let status = $state.projects.data.status;
  let difficulty = $state.projects.data.difficulty;

  let content = $state.projects.data.content as OutputData;
  $: if (content) console.log("content:", content)

	async function onEditorChange(editorContent: OutputData) {
    setTimeout(() => {
      console.log("content:", content);
      console.log("editorContent:", {...editorContent});
    }, 100);
    console.log("ran on change");
    canSave = true;
  }

	async function inputHandler(e: Event, fieldName: string) {
		const value = (e.currentTarget as HTMLInputElement).value;
		if (fieldName == "Name" && $state.projects.original != value) {
			$state.projects.original = value;
			$changedKey = value.replace(" ", "-").toLowerCase();
		}

		$state.projects.data[fieldName.toLowerCase()] = value;

		$state = $state;
		await updateSettings({ prop: "state", data: $state });
	}
	async function dropDownHandler(value: string, fieldName: string) {
		$state.projects.data[
			fieldName == "Organization" ? "org" : fieldName.toLowerCase()
		] = value;

		$state = $state;
		await updateSettings({ prop: "state", data: $state });
	}
	async function imageHandler(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;

		$state.projects.data.img = value;

		$state = $state;
		await updateSettings({ prop: "state", data: $state });
	}

	function confirmDelete(e: Event) {
		toast.push({
			component: {
				src: ConfirmDelete,
				props: {
					properties: ["projects", $state.projects.data.name],
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

	async function archiveProject(e: Event) {
		const cfg = $config;

		cfg["archive"][$state.projects.key] = $state.projects.data;
		$state.archive.original = $state.projects.original;
		$state.archive.key = $state.projects.key;
		$state.archive.data = $state.projects.data;

		delete cfg["projects"][$state.projects.key];
		$state.projects = {
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
		await updateSettings({ prop: "state", data: $state });

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

		if ($changedKey) {
			// @ts-ignore
			cfg.projects[$changedKey] = cfg.projects[$state.projects.key];

			// @ts-ignore
			delete cfg.projects[$state.projects.key];

			$state.projects.key = $changedKey;
			$changedKey = null;
		}

		$state.projects.data.content = content;
		$state.projects.data.description = content.blocks[1].data.text;
		await updateSettings({ prop: "state", data: $state });
		// @ts-ignore
		cfg.projects[$state.projects.key] = $state.projects.data;

		await writeConfig(JSON.stringify(cfg, null, "\t"));

		$config = cfg;
		canSave = false;
  }
</script>

<div class="project-editor">
	<div class="header">
    <h1>{$state.projects.original !== "" ? `Editing: ${$state.projects.original}` : "Select an Project to get started"}</h1>
    <div class="btn-cont" class:hide={$state.projects.original === ""}>
      {#if canSave}
        <Button label="Save" width="90px" height="30px" highlight onClick={saveChanges} />
        <div style="height: 1px; width: 10px" />
      {/if}
      <Button label="Archive" width="90px" height="30px" warn onClick={archiveProject} />
      <div style="height: 1px; width: 10px" />
      <Button label="Delete" width="90px" height="30px" warn onClick={confirmDelete} />
    </div>
  </div>
  <div class="content" class:hide={$state.projects.original === ""}>
    <div class="fields">
      <h3>Fields</h3>
      <ImagePreview
        label={"Project"}
        placeholder={$state.projects.data.img}
        handler={imageHandler}
      />

      <TextInput
        label={"Name"}
        placeholder={$state.projects.data.name}
        value={$state.projects.data.name}
        onInput={(e) => inputHandler(e, "Name")}
      />
      <VerticalSpacer />

      <TextInput
        label={"Time"}
        placeholder={$state.projects.data.time}
        value={$state.projects.data.time}
        onInput={(e) => inputHandler(e, "Time")}
      />
      <VerticalSpacer />

      <TextInput
        label={"Link"}
        placeholder={$state.projects.data.link}
        value={$state.projects.data.link}
        onInput={(e) => inputHandler(e, "Link")}
      />
      <VerticalSpacer />
      
      <DropDown label={"Category"} options={categories} value={category} onChange={(selected) => dropDownHandler(selected, "Category")} />
      <VerticalSpacer />

      <DropDown label={"Organization"} options={organizations} value={organization} onChange={(selected) => dropDownHandler(selected, "Organization")} />
      <VerticalSpacer />

      <DropDown label={"Difficulty"} options={difficulties} value={difficulty} onChange={(selected) => dropDownHandler(selected, "Difficulty")} />
      <VerticalSpacer />

      <DropDown label={"Status"} options={statusses} value={status} onChange={(selected) => dropDownHandler(selected, "Status")} />
    </div>
    <div class="editor">
      <h3>Writeup</h3>
      <div class="editor-scroll-container">
        <EditorJs onChange={onEditorChange} bind:content={content} />
      </div>
    </div>
  </div>
</div>

<style>
	@import "/theme.css";

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
    margin-left: 3px;
  }

  .fields {
    padding: 7px;
    height: calc(100% - 14px);
    margin-right: 10px;

    border-radius: 4px;
    background-color: var(--foreground-dark);
  }

  .editor {
    padding: 7px;
    height: calc(100% - 14px);
    
    border-radius: 4px;
    background-color: var(--foreground-dark);
  }

  .editor-scroll-container {
    height: calc(100% - 60px);
    overflow-y: scroll;
  }
</style>
