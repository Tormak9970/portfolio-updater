<script lang="ts">
    import { updateSettings } from "src/lib/Utils";
  import {
    currentArt,
    currentExperience,
    currentOrganization,
    currentProject,
    projectsList,
    selectedCategory,

    selectedKey

  } from "../../stores";

  async function createNewEntry() {
    switch ($selectedCategory) {
      case "Projects":
        const newData = {
          "category": "web-dev",
          "name": "New Project",
          "time": "",
          "status": "In Progress",
          "difficulty": "Intermediate",
          "description": "",
          "content": {},
          "link": "",
          "isRelative": false,
          "img": "",
          "org": "None"
        };
        $currentProject = {
          "original": "New Project",
          "key": "new-project",
          "data": newData
        }
        $selectedKey = "new-project";
        $projectsList.unshift({
          "key": "new-project",
          "data": newData
        });
        await updateSettings({ prop: "currentProject", data: $currentProject });
        break;
      case "Art":
        $currentArt = {
          "original": "",
          "key": "",
          "data": {
            "name": "",
            "img": "",
            "description": ""
          }
        }
        break;
      case "Experience":
        $currentExperience = {
          "original": "",
          "key": "",
          "data": {
            "company": "",
            "position": "",
            "img": "",
            "description": ""
          }
        }
        break;
      case "Organizations":
        $currentOrganization = {
          "original": "",
          "key": "",
          "data": {
            "name": "",
            "about": "",
            "description": "",
            "img": "",
            "link": "",
            "projects": []
          }
        }
        break;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="createNew" on:click={createNewEntry}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
    <path
      d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
    />
  </svg>
</div>

<style>
  @import "/theme.css";

  #createNew {
    height: 60px;
    min-width: 300px;

    background-color: var(--foreground);
    color: var(--font-color);

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    border-radius: 4px;

    margin-bottom: 7px;

    border: 1px dashed var(--highlight);
  }
  #createNew:hover {
    background-color: var(--hover);

    border-color: var(--highlight-hover);

    cursor: pointer;
  }

  svg {
    width: 30px;
    height: 30px;
  }
  path {
    fill: var(--font-color);
  }
</style>
