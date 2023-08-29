<script lang="ts">
  import { dialog, fs, path, tauri } from "@tauri-apps/api";

  import { afterUpdate, onMount } from "svelte";
  import { configPath } from "../../lib/Utils";
  import TextInput from "./TextInput.svelte";
  import FileButton from "./FileButton.svelte";

  export let label: string;
  export let placeholder: string;
  export let value: string;
  export let onChange: (path: string) => Promise<void> = async () => {};

  let input: HTMLInputElement;

  const changeEvnt = new Event("change");

  async function wrapper(e: Event) {
    await onChange((e.target as HTMLInputElement).value);
  }

  async function selectImage(e: Event) {
    await dialog
      .open({
        title: `Choose the ${label.toLowerCase()}`,
        directory: false,
      })
      .then(async (file: string) => {
        const relPath = await path.join(
          "./img",
          "projs",
          await path.basename(file)
        );
        const tarPath = await path.join(
          await path.dirname(configPath),
          relPath
        );
        await fs.copyFile(file, tarPath);
        input.value = `./${relPath.replaceAll("\\", "/")}`;
        input.dispatchEvent(changeEvnt);
        imgPath = tarPath;
      });
  }

  let imgPath = "";

  onMount(async () => {
    const tmpPath = await path.join(await path.dirname(configPath), value.substring(2));
    if (value !== "") imgPath = tmpPath;
  });

  afterUpdate(async () => {
    const tmpPath = await path.join(await path.dirname(configPath), value.substring(2));
    if (value !== "") imgPath = tmpPath;
  });
</script>

<div class="img-preview">
  <div class="info">
    {#if label !== ""}
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label style="margin-bottom: 2px; font-size: 16px; user-select: none;">{label}</label>
      <div style="height: 2px; width: 1px;" />
    {/if}
    <div class="inputs">
      <TextInput placeholder={placeholder} onChange={wrapper} width="{188}" bind:value={value} />
      <div style="height: 1px; width: 7px;"/>
      <FileButton onChange={onChange} />
    </div>
  </div>
  <div class="prev" style="margin-top: 7px;">
    <img src={imgPath && imgPath !== "" ? tauri.convertFileSrc(imgPath) : ""} alt="" style="max-width: 100%;" />
  </div>
</div>

<style>
  @import "/theme.css";

  .img-preview {
    width: 300px;
    margin-bottom: 7px;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: var(--font-color);
  }
  .img-preview > .info {
    width: 100%;
  }

  .inputs {
    width: 100%;

    display: flex;
    flex-direction: row;
  }

  .img-preview > .prev {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
