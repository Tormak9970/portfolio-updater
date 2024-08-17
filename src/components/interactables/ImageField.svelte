<script lang="ts">
  import { dialog, fs, path, tauri } from "@tauri-apps/api";

  import { MoreHoriz } from "@icons";
  import { TextField } from "@interactables";
  import { configPath } from "@utils";
  import { afterUpdate, onMount } from "svelte";
  import { showInfoSnackbar } from "../../stores";

  export let name: string;
  export let value: string;
  export let onChange: (path: string) => Promise<void> = async () => {};

  async function wrapper(e: Event) {
    await processPath((e.target as HTMLInputElement).value);
  }

  async function processPath(filePath: string) {
    const relPath = await path.join("./images/projects", await path.basename(filePath));
    const tarPath = await path.join(await path.dirname(configPath), relPath);

    if (await fs.exists(tarPath)) {
      $showInfoSnackbar({ message: "An image with that name already exists!" });
    } else {
      await fs.copyFile(filePath, tarPath);

      value = `./${relPath.replaceAll("\\", "/")}`;
      imgPath = tarPath;

      await onChange(value);
    }
  }

  async function promptPickImage() {
    const path = await dialog.open({
      title: "Select a file",
      directory: false,
      multiple: false
    });
    if (path && path != "") processPath(path as string);
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
  <TextField
    name={name}
    extraWrapperOptions={{
      style: "width: 100%;"
    }}
    bind:value
    trailingIcon={MoreHoriz}
    on:trailingClick={promptPickImage}
  />
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

  .img-preview > .prev {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    border-radius: 10px;
    overflow: hidden;
  }
</style>
