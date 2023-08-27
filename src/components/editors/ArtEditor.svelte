<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { state, config, changedKey } from "../../stores";
  import { updateSettings, writeConfig } from "../../Utils";
  import TextAreaInput from "../universal/edit/TextAreaInput.svelte";
  import EditorInput from "../universal/edit/EditorInput.svelte";
  import ImagePreview from "../universal/edit/ImagePreview.svelte";
  import ConfirmDelete from "../universal/ConfirmDelete.svelte";

  async function inputHandler(e: Event, fieldName: string) {
    const value = (e.currentTarget as HTMLInputElement).value;

    if ($state.art.oArt != value) {
      $state.art.oArt = value;
      $changedKey = value.replace(" ", "-").toLowerCase();
    }

    $state.art.data.name = value;

    $state = $state;
    await updateSettings({ prop: "state", data: $state });
  }

  async function descHandler(e: Event, fieldName: string) {
    const value = (e.currentTarget as HTMLTextAreaElement).value;

    $state.art.data.description = value;

    $state = $state;
    await updateSettings({ prop: "state", data: $state });
  }

  async function imageHandler(e: Event, fieldName: string) {
    const value = (e.currentTarget as HTMLInputElement).value;

    $state.art.data.img = value;

    $state = $state;
    await updateSettings({ prop: "state", data: $state });
  }

  async function save() {
    const cfg = $config;

    if ($changedKey) {
      // @ts-ignore
      cfg.art[$changedKey] = cfg.art[$state.art.key];

      // @ts-ignore
      delete cfg.art[$state.art.key];

      $state.art.key = $changedKey;
      await updateSettings({ prop: "state", data: $state });
      $changedKey = null;
    }

    // @ts-ignore
    cfg.art[$state.art.key] = $state.art.data;

    await writeConfig(JSON.stringify(cfg, null, "\t"));

    $config = cfg;
  }

  function confirmDelete(e: Event) {
    toast.push({
      component: {
        src: ConfirmDelete,
        props: {
          properties: ["art", $state.art.data.name],
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
</script>

<div id="editor">
  <div
    class:hide={$state.art.oArt == ""}
    style="overflow: scroll; min-height: 100%;"
  >
    <div class="header">
      <div />
      <h1>Editing: {$state.art.oArt}</h1>
      <div class="btn-cont">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="btn" on:click={confirmDelete}>
          <div>Delete</div>
        </div>
      </div>
    </div>
    <div class="info-cont">
      <EditorInput
        fieldName={"Name"}
        cVal={$state.art.data.name}
        handler={inputHandler}
      />
      <ImagePreview
        fieldName={"Image"}
        cVal={$state.art.data.img}
        handler={imageHandler}
      />
      <TextAreaInput
        fieldName={"Description"}
        cVal={$state.art.data.description}
        handler={descHandler}
      />
    </div>
    <button id="save" on:click={save}>Save Content</button>
  </div>
  <div class:hide={$state.art.oArt != ""}>
    <div class="welcome-msg">Select an Art Piece to get started</div>
  </div>
</div>

<style>
  @import "/theme.css";

  #editor {
    width: calc(100% - 272px - 2em - 40px);
    margin: 0px 20px;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: var(--font-color);

    position: relative;
  }

  .header {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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

    border-radius: 10px;

    margin-right: 10px;
  }
  .header > .btn-cont > .btn:hover {
    background-color: var(--warning-hover);
  }

  #save {
    font-family: "Source Sans Pro", sans-serif;
    font-size: 16px;
    color: var(--font-color);
    background-color: var(--foreground);
    padding: 4px;
    border: 1px solid #000;
    box-shadow: 0 0 4px rgb(0 0 0 / 50%);
    border-radius: 3px;
  }
  #save:hover {
    cursor: pointer;
    background-color: var(--hover);
  }
  #save:focus {
    outline: 1px solid var(--highlight);
  }

  .info-cont {
    width: fit-content;

    display: flex;
    flex-direction: column;
    align-items: center;
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

  #editor > div > .welcome-msg {
    color: var(--font-color);
    font-size: 30px;
  }
</style>