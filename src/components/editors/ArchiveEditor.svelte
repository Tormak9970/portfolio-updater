<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import EditorJs, { OutputData } from "@editorjs/editorjs";
  import Header from "@editorjs/header";
  import Code from "@editorjs/code";
  import List from "@editorjs/nested-list";
  import ImageTool from "@editorjs/image";
  import Delimiter from "@editorjs/delimiter";
  import Paragraph from "@editorjs/paragraph";
  import Embed from "@editorjs/embed";

  import { onMount } from "svelte";
  import { state, jSwitchProj, config, changedKey } from "../../stores";
  import {
    addPathToScope,
    configPath,
    updateSettings,
    uploadFile,
    uploadUrl,
    writeConfig,
  } from "../../Utils";
  import { path, tauri } from "@tauri-apps/api";
  import ImagePreview from "../interactables/ImagePreview.svelte";
  import ConfirmDelete from "../modals/ConfirmDelete.svelte";
  import { archList, projsList } from "../../listStores";
    import DropDown from "../interactables/DropDown.svelte";
    import TextInput from "../interactables/TextInput.svelte";

  let editor: EditorJs;
  let saved = true;
  let showSave = false;
  let wasProgramatic = false;

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

  $: category = $state.archive.data.category;
  $: organization = $state.archive.data.org;
  $: status = $state.archive.data.status;
  $: difficulty = $state.archive.data.difficulty;

  onMount(async () => {
    editor = new EditorJs({
      holder: "editorjs",
      // @ts-ignore
      logLevel: "ERROR",
      tools: {
        header: { class: Header, inlineToolbar: true },
        code: { class: Code, inlineToolbar: true },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                const uploadRes = await uploadFile(
                  file.name,
                  await file.arrayBuffer()
                );
                return JSON.parse(uploadRes);
              },
              uploadByUrl: async (url: any) => {
                const uploadRes = await uploadUrl(url);
                return JSON.parse(uploadRes);
              },
            },
          },
        },
        list: { class: List, inlineToolbar: true },
        delimiter: { class: Delimiter, inlineToolbar: true },
        paragraph: { class: Paragraph, inlineToolbar: true },
        embed: { class: Embed, inlineToolbar: true },
      },
      onChange: async () => {
        if (!wasProgramatic) {
          if (saved) saved = false;
          const content = await editor.save();
          wasProgramatic = true;
          $state.archive.data.content = content;
          await updateSettings({ prop: "state", data: $state });
        } else {
          wasProgramatic = false;
        }
      },
      onReady: async () => {
        // @ts-ignore
        if ($state.archive.data.content.blocks)
          editor.blocks.render(
            await convertToTauri($state.archive.data.content)
          );
      },
    });
  });

  $: {
    renderNewContent($state.archive.data.content);
  }

  const renderNewContent = async (data) => {
    if (editor && $jSwitchProj) {
      wasProgramatic = true;
      $jSwitchProj = false;
      if (data.time && data.blocks?.length > 0 && data.version) {
        const transformedDat = await convertToTauri(data);
        editor.blocks.render(transformedDat);
      } else {
        editor.blocks.clear();
      }
    }
  };

  async function convertToTauri(data) {
    if (data) {
      await Promise.all(
        data.blocks.map(async (block) => {
          if (block.type == "image" && block.data.file.url.indexOf("./") == 0) {
            console.log(block.data.file.url);
            block.data.file.webUrl = block.data.file.url;
            const targetPath = await path.join(
              await path.dirname(configPath),
              block.data.file.url
            );

            const pathAdded = await addPathToScope(targetPath);
            console.log(
              pathAdded
                ? `successfully added ${targetPath} to scope`
                : `failed to add ${targetPath} to scope`
            );

            block.data.file.url = tauri.convertFileSrc(targetPath);
          }
          return block;
        })
      );
    }
    return data;
  }

  function convertToWeb(data: OutputData) {
    console.log(data.blocks);
    data.blocks = data.blocks.map((block) => {
      if (block.type == "image") {
        console.log(block);
        block.data.file.url = block.data.file.webUrl;
        delete block.data.file.webUrl;
      }
      return block;
    });
    return data;
  }

  async function getEditorContent() {
    const content = await editor.save().then((outputData) => {
      return convertToWeb(outputData);
    });
    const contentStr = JSON.stringify(content);
    return JSON.parse(
      contentStr.replaceAll(
        `<a href`,
        `<a target=\\"_blank\\" rel=\\"noreferrer noopener\\" href`
      )
    );
  }

  async function save() {
    const content = await getEditorContent();
    const cfg = $config;

    if ($changedKey) {
      // @ts-ignore
      cfg.projects[$changedKey] = cfg.projects[$state.archive.key];

      // @ts-ignore
      delete cfg.projects[$state.archive.key];

      $state.archive.key = $changedKey;
      $changedKey = null;
    }

    $state.archive.data.content = content;
    $state.archive.data.description = content.blocks[1].data.text;
    await updateSettings({ prop: "state", data: $state });

    // @ts-ignore
    cfg.projects[$state.archive.key] = $state.archive.data;

    await writeConfig(JSON.stringify(cfg, null, "\t"));

    $config = cfg;
    saved = true;
  }

  async function inputHandler(e: Event, fieldName: string) {
    const value = (e.currentTarget as HTMLInputElement).value;
    if (fieldName == "Name" && $state.archive.original != value) {
      $state.archive.original = value;
      $changedKey = value.replace(" ", "-").toLowerCase();
    }

    $state.archive.data[fieldName.toLowerCase()] = value;

    $state = $state;
    await updateSettings({ prop: "state", data: $state });
  }
  async function dropDownHandler(value: string, fieldName: string) {
    $state.archive.data[
      fieldName == "Organization" ? "org" : fieldName.toLowerCase()
    ] = value;

    $state = $state;
    await updateSettings({ prop: "state", data: $state });
  }
  async function imageHandler(e: Event) {
    const value = (e.currentTarget as HTMLInputElement).value;

    $state.archive.data.img = value;

    $state = $state;
    await updateSettings({ prop: "state", data: $state });
  }

  function confirmDelete(e: Event) {
    toast.push({
      component: {
        src: ConfirmDelete,
        props: {
          properties: ["archive", $state.archive.data.name],
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

  async function unArchiveProject(e: Event) {
    const cfg = $config;

    cfg["projects"][$state.archive.key] = $state.archive.data;
    $state.projects.original = $state.archive.original;
    $state.projects.key = $state.archive.key;
    $state.projects.data = $state.archive.data;

    delete cfg["archive"][$state.archive.key];
    $state.archive = {
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
    await updateSettings({ prop: "state", data: $state });

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
  }
</script>

<div id="editor">
  <div
    class:hide={$state.archive.original == ""}
    style="overflow: scroll; min-height: 100%;"
  >
    <div class="header">
      <div />
      <h1>Editing: {$state.archive.original}</h1>
      <div class="btn-cont">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="btn" on:click={unArchiveProject}>
          <div>Move</div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="btn" on:click={confirmDelete}>
          <div>Delete</div>
        </div>
      </div>
    </div>
    <div class="info-cont">
      <div class="sub">
        <TextInput
					label={"Name"}
					placeholder={$state.projects.data.name}
          value={$state.projects.data.name}
					onInput={(e) => inputHandler(e, "Name")}
				/>
				<TextInput
					label={"Time"}
					placeholder={$state.projects.data.time}
          value={$state.projects.data.time}
					onInput={(e) => inputHandler(e, "Time")}
				/>
				<TextInput
					label={"Link"}
					placeholder={$state.projects.data.link}
          value={$state.projects.data.link}
					onInput={(e) => inputHandler(e, "Link")}
				/>
        
        <DropDown label={"Category"} options={categories} value={category} onChange={(selected) => dropDownHandler(selected, "Category")} />
          <DropDown label={"Organization"} options={organizations} value={organization} onChange={(selected) => dropDownHandler(selected, "Organization")} />
          <DropDown label={"Difficulty"} options={difficulties} value={difficulty} onChange={(selected) => dropDownHandler(selected, "Difficulty")} />
          <DropDown label={"Status"} options={statusses} value={status} onChange={(selected) => dropDownHandler(selected, "Status")} />
      </div>
      <div class="sub">
        <ImagePreview
          label={"Project"}
          placeholder={$state.archive.data.img}
          handler={imageHandler}
        />
      </div>
    </div>
    <div id="editorjs" />
    <button id="save" on:click={save}>Save Content</button>
  </div>
  <div class:hide={$state.archive.original != ""}>
    <div class="welcome-msg">Select an Project to get started</div>
  </div>
  <div class="save-modal{showSave ? '' : ' hide-modal'}">
    <div class="modal">
      <div class="modal-msg">
        <p>
          You have not saved the current changes. Do you want to save before
          exiting?
        </p>
      </div>
      <div class="modal-btns">
        <button id="saveBtn" class="modal-btn" on:click|stopPropagation={save}
          >Save</button
        >
        <button
          class="modal-btn"
          on:click|stopPropagation={() => {
            showSave = false;
          }}>Cancel</button
        >
      </div>
    </div>
  </div>
</div>

<!-- svelte-ignore css-unused-selector -->
<style>
  @import "/theme.css";

  #editor {
    width: calc(100% - 292px - 2em - 40px);
    margin: 0px 20px;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: var(--font-color);

    position: relative;
  }

  #save {
    font-family: "Source Sans Pro", sans-serif;
    font-size: 16px;
    color: var(--font-color);
    background-color: var(--foreground);
    padding: 4px;
    border: 1px solid #000;
    box-shadow: 0 0 4px rgb(0 0 0 / 50%);
    border-radius: 4px;
  }
  #save:hover {
    cursor: pointer;
    background-color: var(--hover);
  }
  #save:focus {
    outline: 1px solid var(--highlight);
  }

  .header {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .header > .btn-cont {
    display: flex;
    flex-direction: row;
  }

  .header > .btn-cont > .btn {
    height: 30px;
    width: 60px;

    cursor: pointer;
    background-color: var(--warning);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 4px;

    margin-right: 10px;
  }
  .header > .btn-cont > .btn:hover {
    background-color: var(--warning-hover);
  }

  .info-cont {
    width: 100%;

    display: flex;
    flex-direction: row;
  }

  #editor > .save-modal {
    z-index: 10;
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.7);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  #editor > .save-modal > .modal {
    width: 300px;

    background-color: var(--foreground);
    border-radius: 4px;
    border: 1px solid black;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  #editor > .save-modal > .modal > .modal-msg {
    margin: 10px;
    width: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 18px;
  }
  #editor > .save-modal > .modal > .modal-msg > p {
    margin: 0px;
  }
  #editor > .save-modal > .modal > .modal-btns {
    margin: 10px;

    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
  #editor > .save-modal > .modal > .modal-btns > .modal-btn {
    height: 24px;
    min-width: 40px;

    cursor: pointer;
    color: var(--font-color);
    background-color: var(--foreground);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 4px;
    border: 1px solid black;
  }
  #editor > .save-modal > .modal > .modal-btns > .modal-btn:hover {
    background-color: var(--hover);
  }
  #editor > .save-modal > .modal > .modal-btns > #saveBtn:hover {
    background-color: var(--highlight-hover);
  }

  #editor > .hide-modal {
    display: none;
  }
  #editor > .hide {
    display: none;
  }

  #editor > div {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: var(--font-color);

    position: relative;
  }

  #editor > div > #editorjs {
    width: calc(100% - 100px);
    padding: 7px 50px;
    background-color: transparent;
  }
  :global(.codex-editor) {
    width: 100%;
  }
  :global(.codex-editor__redactor) {
    padding-bottom: 60px !important;
  }
  :global(.ce-block__content) {
    max-width: calc(100% - 20px);
    background-color: transparent;
  }

  :global(.ce-block a) {
    color: #58a6ff;
  }
  :global(::selection) {
    background-color: #1982d582;
  }

  :global(.ce-toolbar__content) {
    max-width: calc(100% - 20px);
  }

  :global(.cdx-block) {
    background-color: transparent;
  }
  :global(.cdx-button) {
    background-color: var(--foreground);
  }

  :global(.cdx-settings-button) {
    background-color: transparent;
  }
  :global(.cdx-settings-button:hover) {
    background-color: var(--hover) !important;
  }
  :global(.cdx-settings-button--active) {
    background-color: var(--hover) !important;
  }

  :global(.ce-toolbar__settings-btn) {
    color: var(--font-color) !important;
    background-color: transparent !important;
    box-shadow: -3px 2px 8px 2px black;
    background: transparent !important;
  }
  :global(.ce-toolbar__settings-btn:hover) {
    background-color: var(--hover) !important;
    box-shadow: -3px 2px 8px 2px black;
    background: var(--hover) !important;
  }
  :global(.ce-toolbar__settings-btn:active) {
    background-color: var(--hover) !important;
    box-shadow: -3px 2px 8px 2px black;
    background: var(--hover) !important;
  }
  :global(.ce-toolbar__plus) {
    color: var(--font-color);
    background-color: transparent !important;
    background: transparent !important;
  }
  :global(.ce-toolbar__plus:hover) {
    background-color: var(--hover) !important;
    background: var(--hover) !important;
  }
  :global(.ce-toolbox__button) {
    color: var(--font-color);
    background-color: transparent !important;
    background: transparent !important;
  }
  :global(.ce-toolbox__button:hover) {
    background-color: var(--hover) !important;
    background: var(--hover) !important;
  }
  :global(.codex-editor--narrow .ce-toolbox) {
    background-color: transparent !important;
  }
  :global(.ce-settings) {
    color: var(--font-color) !important;
    background-color: transparent !important;
    box-shadow: -3px 2px 8px 2px black;
    background: transparent !important;
    border: 1px solid var(--foreground);
  }
  :global(.ce-settings.ce-settings--opened) {
    background-color: var(--foreground) !important;
  }
  :global(.ce-block--selected .ce-block__content) {
    background-color: var(--selection-color) !important;
  }
  :global(.ce-settings__button) {
    color: var(--font-color) !important;
    background-color: transparent !important;
    background: transparent !important;
  }
  :global(.ce-settings__button:hover) {
    color: var(--font-color) !important;
    background-color: var(--hover) !important;
    background: var(--hover) !important;
  }
  :global(.cdx-settings-button) {
    color: var(--font-color) !important;
    background-color: transparent !important;
    background: transparent !important;
  }
  :global(.cdx-settings-button:hover) {
    color: var(--font-color) !important;
    background-color: var(--hover) !important;
    background: var(--hover) !important;
  }
  :global(.ce-settings__button--confirm) {
    background-color: var(--warning-red) !important;
  }
  :global(.ce-settings__default-zone) {
    color: var(--font-color) !important;
    background-color: transparent !important;
  }
  :global(.ce-code__textarea) {
    color: var(--font-color) !important;
    background-color: rgb(20, 18, 44);
    background: rgb(20, 18, 44);
    border: 1px solid black;
  }
  :global(.link-tool__input) {
    background-image: url("data:image/svg+xml,%3Csvg width='13' height='14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.567 13.629c.728.464 1.581.65 2.41.558l-.873.873A3.722 3.722 0 1 1 4.84 9.794L6.694 7.94a3.722 3.722 0 0 1 5.256-.008L10.484 9.4a5.209 5.209 0 0 1-.017.016 1.625 1.625 0 0 0-2.29.009l-1.854 1.854a1.626 1.626 0 0 0 2.244 2.35zm2.766-7.358a3.722 3.722 0 0 0-2.41-.558l.873-.873a3.722 3.722 0 1 1 5.264 5.266l-1.854 1.854a3.722 3.722 0 0 1-5.256.008L9.416 10.5a5.2 5.2 0 0 1 .017-.016 1.625 1.625 0 0 0 2.29-.009l1.854-1.854a1.626 1.626 0 0 0-2.244-2.35z' fill='rgba(231, 231, 231)' transform='translate(-3.667 -2.7)'/%3E%3C/svg%3E%0A");
  }
  :global(.ce-inline-toolbar) {
    color: var(--font-color) !important;
    background-color: transparent;
    background: transparent;
    box-shadow: -3px 2px 8px 2px black;
    border: 1px solid var(--foreground);
  }
  :global(.ce-inline-toolbar__buttons > button > svg) {
    fill: var(--font-color) !important;
  }
  :global(.ce-inline-toolbar__buttons > button:hover) {
    background-color: var(--hover) !important;
    background: var(--hover) !important;
  }
  :global(.ce-inline-toolbar__dropdown) {
    margin: 0px;
  }
  :global(.ce-inline-toolbar__dropdown:hover) {
    background-color: var(--hover) !important;
    background: var(--hover) !important;
  }
  :global(.ce-conversion-toolbar) {
    color: var(--font-color) !important;
    background-color: var(--foreground) !important;
    box-shadow: -3px 2px 8px 2px black;
    border: 1px solid var(--foreground);
  }
  :global(.ce-inline-toolbar__toggler-and-button-wrapper) {
    color: var(--font-color) !important;
    background-color: var(--foreground) !important;
    box-shadow: -3px 2px 8px 2px black;
    border: 1px solid var(--foreground);
    padding: 0px;
  }
  :global(.ce-conversion-tool:hover) {
    background-color: var(--hover) !important;
    background: var(--hover) !important;
  }
  :global(.ce-conversion-tool > .ce-conversion-tool__icon > svg) {
    fill: var(--font-color) !important;
  }
  :global(.ce-conversion-tool__icon) {
    background-color: transparent !important;
    background: transparent !important;
    border: 1px solid var(--foreground);
  }
  :global(.ce-conversion-toolbar__label) {
    color: var(--font-color) !important;
  }

  /* new editorJS styles */
  :global(.ce-popover) {
    color: var(--font-color);
    background-color: var(--foreground);
    border: 1px solid black;
    box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.85);
  }
  :global(.cdx-search-field) {
    color: var(--font-color);
    fill: var(--font-color);
    background-color: var(--foreground);
    border: 1px solid black;
  }
  :global(.cdx-search-field__icon .icon) {
    color: var(--font-color);
  }
  :global(.cdx-search-field__input) {
    color: var(--font-color);
  }

  :global(.ce-popover__item:hover) {
    background-color: var(--hover);
  }
  :global(.ce-popover__item-icon) {
    background-color: var(--hover);
    border: 1px solid black;
  }

  #editor > div > .welcome-msg {
    color: var(--font-color);
    font-size: 30px;
  }
</style>
