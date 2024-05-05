<script lang="ts">
  import { path, tauri } from "@tauri-apps/api";

  import { onMount } from "svelte";
  import { currentExperience, currentProject, selectedCategory, selectedKey } from "../stores";
  import { configPath, updateSettings } from "../lib/Utils";
  import Button from "./interactables/Button.svelte";

  export let data: any;
  export let field: LowercaseCategory;
  export let key: string;

  let imgPath: string;

  const fieldStateLUT = {
    "projects": "currentProject",
    "experience": "currentExperience",
  }

  async function setState() {
    const lutEntry = fieldStateLUT[field];

    const newData = {
      "original": "",
      "key": key,
      "data": data
    }
    
    switch($selectedCategory) {
      case "Projects":
        newData.original = data.name;
        $currentProject = newData;
        break;
      case "Experience":
        newData.original = data.position;
        $currentExperience = newData;
        break;
    }

    $selectedKey = key;
    await updateSettings({ prop: lutEntry, data: newData });
  }

  onMount(async () => {
    if ($selectedCategory === "Projects") {
      const tmpPath = await path.join(
        await path.dirname(configPath),
        data.image.substring(2)
      );

      imgPath = tmpPath;
    }
  });
</script>

<div class="entry">
  {#if imgPath}
    <img
      src={imgPath && imgPath != "" ? tauri.convertFileSrc(imgPath) : ""}
      alt=""
      style="width: 40px; margin: 0px 7px;"
    />
  {/if}
  <div class="info" style="{$selectedCategory === "Experience" ? "margin-left: 10px" : ""}">
    <div class="field">{$selectedCategory === "Experience" ? data.position : data.name}</div>
  </div>
  <div class="btn-cont">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <Button label="Edit" onClick={setState} height="30px" width="60px" />
  </div>
</div>

<style>
  .entry {
    height: 60px;
    min-width: 300px;

    background-color: var(--foreground);
    color: var(--font-color);

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    border-radius: 4px;
  }

  .entry > .info {
    margin-right: 7px;
    margin-right: 14px;

    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  .entry > .info > .field {
    font-size: 20px;
    white-space: nowrap;
    max-width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entry > .btn-cont {
    margin-right: 7px;
  }
</style>
