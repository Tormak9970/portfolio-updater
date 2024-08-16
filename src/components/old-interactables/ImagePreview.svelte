<script lang="ts">
  import { fs, path, tauri } from "@tauri-apps/api";

  import { toast } from "@zerodevx/svelte-toast";
  import { afterUpdate, onMount } from "svelte";
  import { configPath } from "../../lib/utils/Utils";
  import FileButton from "./FileButton.svelte";
  import TextInput from "./TextInput.svelte";

  export let label: string;
  export let placeholder: string;
  export let value: string;
  export let onChange: (path: string) => Promise<void> = async () => {};

  async function wrapper(e: Event) {
    await processPath((e.target as HTMLInputElement).value);
  }

  async function processPath(filePath: string) {
    const relPath = await path.join("./images/projects", await path.basename(filePath));
    const tarPath = await path.join(await path.dirname(configPath), relPath);

    if (await fs.exists(tarPath)) {
      toast.push("image with that name already exists!");
    } else {
      await fs.copyFile(filePath, tarPath);

      value = `./${relPath.replaceAll("\\", "/")}`;
      imgPath = tarPath;

      await onChange(value);
    }
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
      <TextInput placeholder={placeholder} onChange={wrapper} width="{188}" value={value} />
      <div style="height: 1px; width: 7px;"/>
      <FileButton onChange={async (path) => await processPath(path)} />
    </div>
  </div>
  <div class="prev" style="margin-top: 7px; max-width: 100%;">
    <img src={imgPath && imgPath !== "" ? tauri.convertFileSrc(imgPath) : ""} alt="" style="max-width: 100%;" />
  </div>
</div>

<style>
  .img-preview {
    max-width: 300px;
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
