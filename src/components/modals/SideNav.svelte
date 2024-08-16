<script lang="ts">
  import { Icon } from "@component-utils";
  import { scrollShadow } from "@directives";
  import { Add } from "@icons";
  import { Button, Select } from "@interactables";
  import { SideSheet } from "@layout";
  import type { EntryData, EntryUnion } from "@types";
  import { updateSettings, writeConfig } from "@utils";
  import { afterUpdate } from "svelte";
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { config, currentExperience, currentProject, experienceList, projectsList, selectedCategory, selectedKey, showSideNav } from "../../stores";
  import Entry from "../views/Entry.svelte";
  
  export let data: EntryData<EntryUnion>[];

  const animateDurationMS = 300;
  const options = [
    {
      label: "Projects",
      value: "Projects",
    },
    {
      label: "Experience",
      value: "Experience",
    },
  ];
  let dropdownValue = $selectedCategory;

  $: field = $selectedCategory.toLowerCase() as LowercaseCategory;

  function handleDndConsider(e: any) {
    data = e.detail.items;
  }
  function handleDndFinalize(e: any) {
    data = e.detail.items;

    const newData: any = {};

    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      entry.data.index = i;

      newData[entry.key] = entry.data;
    }

    $config[field] = newData;
    writeConfig(JSON.stringify($config, null, '\t'));
  }

  async function createNewEntry() {
    switch ($selectedCategory) {
      case "Projects":
        const newProject = {
          "index": 0,
          "name": "New Project",
          "time": "",
          "tech": [],
          "description": "",
          "content": {},
          "link": "",
          "image": ""
        };
        $currentProject = {
          "original": "New Project",
          "key": "new-project",
          "data": newProject
        }
        const updatedProjectIndices = $projectsList.map((entry) => {
          entry.data.index++;
          return entry;
        });
        $projectsList = [{ "key": "new-project", "data": newProject }, ...updatedProjectIndices];
        $selectedKey = "new-project";
        break;
      case "Experience":
        const newExperience = {
          "index": 0,
          "company": "new",
          "position": "experience",
          "image": "",
          "duration": "",
          "companyLink": "",
          "description": ""
        }
        $currentExperience = {
          "original": "New Experience",
          "key": "new-experience",
          "data": newExperience
        }
        const updatedExperienceIndices = $experienceList.map((entry) => {
          entry.data.index++;
          return entry;
        });
        $experienceList = [{ "key": "new-experience", "data": newExperience }, ...updatedExperienceIndices];
        $selectedKey = "new-experience";
        break;
    }
  }
  
  afterUpdate(async () => {
    const oldCat = $selectedCategory;
    $selectedCategory = dropdownValue as PortfolioCategory;

    if (oldCat !== $selectedCategory) {
      await updateSettings({ prop: "selectedCategory", data: dropdownValue });
    }
  });
</script>

<SideSheet width={400} on:close={() => $showSideNav = false}>
  <div class="options">
    <div class="category-select" style:--m3-util-background="var(--m3-scheme-surface-container-low)">
      <Select name="Category" options={options} bind:value={dropdownValue} />
    </div>
    <Button type="text" iconType="full" on:click={createNewEntry}>
      <Icon icon={Add} />
    </Button>
  </div>
  <div class="entries-container">
    <div class="font-label-large" style:margin-top="1rem" style:margin-bottom="0.5rem">Entries</div>
		<div class="entries-positioner">
      <div class="entries styled-scrollbar" use:scrollShadow={{ background: "--m3-scheme-surface-container-lowest" }}>
        <div
          class="dnd-zone"
          use:dndzone={{ items: data, flipDurationMs: animateDurationMS, dropTargetStyle: {}, axis: "y" }}
          on:consider={handleDndConsider}
          on:finalize={handleDndFinalize}
        >
          {#each data as entry (entry.key)}
            <div class="entry-wrapper" animate:flip={{ duration: animateDurationMS }}>
              <Entry data={entry.data} key={entry.key} field={field} />
            </div>
          {/each}
        </div>
      </div>
    </div>
	</div>
</SideSheet>

<style>
  .options {
    width: 100%;

    display: flex;
    align-items: center;
    gap: 1rem;
    
    overflow: hidden;
  }
  .category-select {
    flex-grow: 1;
  }

  .entries-container {
    width: 100%;
    height: calc(100% - 56px);
    overflow: hidden;
	}

  .entries-positioner {
    width: 100%;
    height: calc(100% - 40px);
    position: relative;

    overflow: hidden;
    
    border-radius: 10px;
    background-color: rgb(var(--m3-scheme-surface-container-lowest));
  }

  .entries {
    width: 100%;
    height: 100%;

    overflow-y: scroll;
    overflow-x: none;
  }
  .dnd-zone {
    width: 100%;
    min-height: 60px;
    
    overflow-x: none;
  }

  .entry-wrapper {
    margin-bottom: 7px;
    overflow: hidden;
  }
</style>