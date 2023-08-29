<script lang="ts">
  import { config, currentExperience } from "../../stores";
  import { getKeyFromName, updateSettings, writeConfig } from "../../lib/Utils";
  import ImagePreview from "../interactables/ImagePreview.svelte";
  import TextArea from "../interactables/TextArea.svelte";
  import TextInput from "../interactables/TextInput.svelte";
  import EditorTemplate from "./EditorTemplate.svelte";
  import VerticalSpacer from "../utils/VerticalSpacer.svelte";
  import type { ExperienceEntry } from "../../types/ConfigTypes";

  let canSave = false;

  let company = $currentExperience.data.company;
  let position = $currentExperience.data.position;
  let image = $currentExperience.data.img;
  let description = $currentExperience.data.description;

  async function allowSave() {
    canSave = true;
  }

  function genExperienceKey(company: string, position: string): string {
    return [getKeyFromName(company), getKeyFromName(position)].join("-");
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
      company: company,
      position: position,
      img: image,
      description: description
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
		canSave = false;
  }
</script>

<EditorTemplate saveChanges={saveChanges} emptyMessage="Select an Experience entry to get started" curretStore={currentExperience} bind:canSave={canSave}>
  <div slot="fields">
    <TextInput
      label={"Company"}
      placeholder={"The company name"}
      bind:value={company}
      onChange={allowSave}
    />
    <VerticalSpacer />

    <TextInput
      label={"Position"}
      placeholder={"The position name"}
      bind:value={position}
      onChange={allowSave}
    />
    <VerticalSpacer />

    <ImagePreview
      label={"Image"}
      placeholder={"The company logo"}
      bind:value={image}
      onChange={allowSave}
    />
  </div>
  <div slot="editor">
    <TextArea
      label={"Description"}
      placeholder=""
      bind:value={description}
      onChange={allowSave}
    />
  </div>
</EditorTemplate>