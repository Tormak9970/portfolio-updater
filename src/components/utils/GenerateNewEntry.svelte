<script lang="ts">
  import { updateSettings } from "../../lib/Utils";
  import {
    artList,
    currentArt,
    currentExperience,
    currentOrganization,
    currentProject,
    experienceList,
    organizationsList,
    projectsList,
    selectedCategory,
    selectedKey
  } from "../../stores";

  async function createNewEntry() {
    switch ($selectedCategory) {
      case "Projects":
        const newProject = {
          "category": "web-dev",
          "name": "New Project",
          "time": "",
          "status": "In Progress",
          "difficulty": "Moderate",
          "description": "",
          "content": {},
          "link": "",
          "isRelative": false,
          "img": "",
          "org": "none"
        };
        $currentProject = {
          "original": "New Project",
          "key": "new-project",
          "data": newProject
        }
        $projectsList = [{ "key": "new-project", "data": newProject }, ...$projectsList];
        $selectedKey = "new-project";
        break;
      case "Art":
        const newArt = {
          "name": "New Art",
          "img": "",
          "description": ""
        }
        $currentArt = {
          "original": "New Art",
          "key": "new-art",
          "data": newArt
        }
        $artList = [{ "key": "new-art", "data": newArt }, ...$artList];
        $selectedKey = "new-art";
        break;
      case "Experience":
        const newExperience = {
          "company": "new",
          "position": "experience",
          "img": "",
          "description": ""
        }
        $currentExperience = {
          "original": "New Experience",
          "key": "new-experience",
          "data": newExperience
        }
        $experienceList = [{ "key": "new-experience", "data": newExperience }, ...$experienceList];
        $selectedKey = "new-experience";
        break;
      case "Organizations":
        const newOrganization = {
          "name": "New Organization",
          "about": "",
          "description": "",
          "img": "",
          "link": "",
          "projects": []
        }
        $currentOrganization = {
          "original": "New Organization",
          "key": "new-organization",
          "data": newOrganization
        }
        $organizationsList = [{ "key": "new-organization", "data": newExperience }, ...$organizationsList];
        $selectedKey = "new-organization";
        break;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="gen-new-entry" on:click={createNewEntry}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
    <path
      d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
    />
  </svg>
</div>

<style>
  @import "/theme.css";

  .gen-new-entry {
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

    transition: background-color 0.2s ease-in-out;
  }
  .gen-new-entry:hover {
    background-color: var(--foreground-hover);

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
