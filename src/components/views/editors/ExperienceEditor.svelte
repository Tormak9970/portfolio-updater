<script lang="ts">
  import type { ExperienceEntry } from "../../../lib/types/ConfigTypes";
  import { genExperienceKey, updateSettings, writeConfig } from "../../../lib/utils/Utils";
  import { canSave, config, currentExperience, experienceList } from "../../../stores";
  import Duration from "../../old-interactables/Duration.svelte";
  import TextArea from "../../old-interactables/TextArea.svelte";
  import TextInput from "../../old-interactables/TextInput.svelte";
  import EditorTemplate from "./EditorTemplate.svelte";

  let company = $currentExperience.data.company;
  let position = $currentExperience.data.position;
  let companyLink = $currentExperience.data.companyLink;
  let duration = $currentExperience.data.duration;
  let description = $currentExperience.data.description;

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
		$canSave = false;

    $experienceList = Object.entries($config.experience).map(([key, data]) => {
      return {
        key: key,
				data: data,
			}
    });
  }
</script>

<EditorTemplate saveChanges={saveChanges} emptyMessage="Select an Experience entry to get started" curretStore={currentExperience} useFields={false}>
  <div slot="editor">
    <TextInput
      label={"Company"}
      placeholder={"The company name"}
      bind:value={company}
      onChange={allowSave}
    />

    <TextInput
      label={"Position"}
      placeholder={"The position name"}
      width={200}
      bind:value={position}
      onChange={allowSave}
    />

    <TextInput
      label={"Link"}
      placeholder={"A link to the company's website"}
      width={300}
      bind:value={companyLink}
      onChange={allowSave}
    />

    <Duration
      label="Duration"
      bind:value={duration}
      singleYear={singleYear}
      onChange={allowSave}
    />

    <TextArea
      label={"Description"}
      placeholder=""
      bind:value={description}
      onChange={allowSave}
    />
  </div>
</EditorTemplate>