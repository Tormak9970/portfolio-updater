<script lang="ts">
  import { Button } from "@interactables";
  import { Card } from "@layout";
  import { updateSettings } from "@utils";
  import { currentExperience, currentProject, selectedCategory, selectedKey } from "../../stores";

  export let data: any;
  export let field: LowercaseCategory;
  export let key: string;

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
</script>


<Card type="filled">
  <div class="entry">
    <div class="info" style="{$selectedCategory === "Experience" ? "margin-left: 10px" : ""}">
      <div class="field">{$selectedCategory === "Experience" ? data.position : data.name}</div>
    </div>
    <Button type="elevated" on:click={setState}>
      Edit
    </Button>
  </div>
</Card>

<style>
  .entry {
    height: 40px;
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
    margin-right: 14px;

    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  .entry > .info > .field {
    font-size: 20px;
    white-space: nowrap;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
