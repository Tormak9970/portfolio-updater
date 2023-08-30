<script lang="ts">
  import { path, tauri } from "@tauri-apps/api";

  import { onMount } from "svelte";
  import { currentArchive, currentArt, currentExperience, currentOrganization, currentProject, selectedCategory, selectedKey } from "../stores";
  import { addPathToScope, configPath, updateSettings } from "../lib/Utils";
  import Button from "./interactables/Button.svelte";

  export let data: any;
  export let field: LowercaseCategory;
  export let key: string;

  let imgPath: string;

  const fieldStateLUT = {
    "projects": "currentProject",
    "art": "currentArt",
    "experience": "currentExperience",
    "organizations": "currentOrganization",
    "archive": "currentArchive"
  }

  async function setState() {
    const lutEntry = fieldStateLUT[field];

    const newData = {
      "original": data.name,
      "key": key,
      "data": data
    }
    
    switch($selectedCategory) {
      case "Projects":
        $currentProject = newData;
        break;
      case "Art":
        $currentArt = newData;
        break;
      case "Experience":
        $currentExperience = newData;
        break;
      case "Organizations":
        $currentOrganization = newData;
        break;
      case "Archive":
        $currentArchive = newData;
        break;
    }

    $selectedKey = key;
    await updateSettings({ prop: lutEntry, data: newData });
  }

  onMount(async () => {
    const tmpPath = await path.join(
      await path.dirname(configPath),
      data.img.substring(2)
    );

    if (tmpPath && tmpPath != "") await addPathToScope(tmpPath);

    imgPath = tmpPath;
  });
</script>

<div class="entry">
  <img
    src={imgPath && imgPath != "" ? tauri.convertFileSrc(imgPath) : ""}
    alt=""
    style="width: 40px; margin: 0px 7px;"
  />
  <div class="info">
    <div class="field">{$selectedCategory === "Experience" ? data.position : data.name}</div>
  </div>
  <div class="btn-cont">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <Button label="Edit" onClick={setState} highlight height="30px" width="60px" />
  </div>
</div>

<style>
  @import "/theme.css";

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
