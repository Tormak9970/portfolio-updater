<script lang="ts">
  import type { OutputData } from "@editorjs/editorjs";
  import { Duration, TextArea, TextField } from "@interactables";
  import type { ExperienceEntry } from "@types";
  import { genExperienceKey, updateSettings, writeConfig } from "@utils";
  import { canSave, config, currentExperience, experienceList } from "../../../stores";
  import EditorJs from "./EditorJS.svelte";
  import EditorTemplate from "./EditorTemplate.svelte";

  let company = $currentExperience.data.company;
  let position = $currentExperience.data.position;
  let companyLink = $currentExperience.data.companyLink;
  let duration = $currentExperience.data.duration;
  let description = $currentExperience.data.description;
  
  let content = $currentExperience.data.content as OutputData;

  let singleYear = !duration.includes("—");

  async function allowSave() {
    $canSave = true;
  }

  async function saveChanges() {
    const cfg = $config;

		if (company !== $currentExperience.data.company || position !== $currentExperience.data.position) {
      const newKey = genExperienceKey(company, position);

			cfg.experience[newKey] = cfg.experience[$currentExperience.key];
			delete cfg.experience[$currentExperience.key];

			$currentExperience.key = newKey;
		}

    const changedExperience: ExperienceEntry = {
      index: $currentExperience.data.index,
      company: company,
      position: position,
      companyLink: companyLink,
      duration: duration,
      description: description,
      content: content,
    }

		$currentExperience = {
      "original": $currentExperience.original,
      "key": $currentExperience.key,
      "data": changedExperience
    };

		await updateSettings({ prop: "currentExperience", data: $currentExperience });
    
		cfg.experience[$currentExperience.key] = changedExperience;

		await writeConfig(JSON.stringify(cfg, null, "\t"));

		$config = cfg;
		$canSave = false;

    $experienceList = Object.entries($config.experience).map(([key, data]) => {
      return {
        key: key,
				data: data,
			}
    });
  }
</script>

<EditorTemplate saveChanges={saveChanges} emptyMessage="Select an Experience entry to get started" curretStore={currentExperience}>
  <div slot="fields" class="fields">
    <TextField
      name={"Company"}
      extraWrapperOptions={{
        style: "width: 300px;"
      }}
      bind:value={company}
      on:change={allowSave}
    />

    <TextField
      name={"Position"}
      extraWrapperOptions={{
        style: "width: 300px;"
      }}
      bind:value={position}
      on:change={allowSave}
    />

    <TextField
      name={"Link"}
      extraWrapperOptions={{
        style: "width: 300px;"
      }}
      bind:value={companyLink}
      on:change={allowSave}
    />

    <Duration
      bind:value={duration}
      singleYear={singleYear}
      onChange={allowSave}
    />
  </div>
  <div slot="editor" class="editor-container">
    <TextArea
      name={"Short Description"}
      extraWrapperOptions={{
        style: "width: 100%; height: 100px; margin-top: 0.5rem; margin-right: 0.5rem;"
      }}
      bind:value={description}
      on:change={allowSave}
    />

    <EditorJs onChange={allowSave} bind:content={content} />
  </div>
</EditorTemplate>

<style>
  .fields {
    width: 100%;

    padding-top: 0.5rem;

    display: flex;
    flex-direction: column;

    gap: 0.5rem;
  }

  .editor-container {
    height: calc(100% - 25px);
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>