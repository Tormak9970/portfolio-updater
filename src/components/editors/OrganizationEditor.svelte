<script lang="ts">
  import { config, currentOrganization, canSave, organizationsList } from "../../stores";
  import { getKeyFromName, updateSettings, writeConfig } from "../../lib/Utils";
  import ImagePreview from "../interactables/ImagePreview.svelte";
  import MultiSelect from "../interactables/multi-select/MultiSelect.svelte";
  import TextArea from "../interactables/TextArea.svelte";
  import TextInput from "../interactables/TextInput.svelte";
  import EditorTemplate from "./EditorTemplate.svelte";
  import VerticalSpacer from "../utils/VerticalSpacer.svelte";
  import type { OrganizationEntry } from "../../types/ConfigTypes";

  const projects = [];

  for (const proj of Object.entries($config.projects)) {
    projects.push({
      // @ts-ignore
      name: proj[1].name,
      linkId: proj[0],
    });
  }

  let name = $currentOrganization.data.name;
  let image = $currentOrganization.data.image;
  let link = $currentOrganization.data.link;
  let about = $currentOrganization.data.about;
  let description = $currentOrganization.data.description;
  let selectedProjects = $currentOrganization.data.projects;

  async function allowSave() {
    $canSave = true;
  }

  async function saveChanges() {
    const cfg = $config;

		if (name !== $currentOrganization.data.name) {
      const newKey = getKeyFromName(name);

			cfg.organizations[newKey] = cfg.organizations[$currentOrganization.key];
			delete cfg.art[$currentOrganization.key];

			$currentOrganization.key = newKey;
		}

    const changedOrganization: OrganizationEntry = {
      index: $currentOrganization.data.index,
      name: name,
      image: image,
      link: link,
      about: about,
      description: description,
      projects: selectedProjects
    }

		$currentOrganization = {
      "original": $currentOrganization.original,
      "key": $currentOrganization.key,
      "data": changedOrganization
    };

		await updateSettings({ prop: "currentOrganization", data: $currentOrganization });
    
		cfg.organizations[$currentOrganization.key] = changedOrganization;

		await writeConfig(JSON.stringify(cfg, null, "\t"));

		$config = cfg;
		$canSave = false;

    $organizationsList = Object.entries($config.organizations).map(([key, data]) => {
      return {
        key: key,
				data: data,
			}
    });
  }
</script>

<EditorTemplate saveChanges={saveChanges} emptyMessage="Select an Organization to get started" curretStore={currentOrganization}>
  <div slot="fields">
    <TextInput
      label={"Name"}
      placeholder={"The name of the organization"}
      bind:value={name}
      onChange={allowSave}
    />
    <VerticalSpacer />

    <ImagePreview
      label="Logo"
      placeholder={"The organization logo"}
      bind:value={image}
      onChange={allowSave}
    />
    <VerticalSpacer />
    
    <TextInput
      label="Link"
      placeholder={"A link to the organization"}
      bind:value={link}
      onChange={allowSave}
    />
  </div>
  <div slot="editor">
    <TextArea
      label="About"
      placeholder={""}
      bind:value={about}
      onChange={allowSave}
    />
    <VerticalSpacer />
    
    <TextArea
      label="Description"
      placeholder={""}
      bind:value={description}
      onChange={allowSave}
    />
    <VerticalSpacer />

    <MultiSelect
      label="Projects"
      options={projects}
      bind:values={selectedProjects}
      onChange={allowSave}
    />
  </div>
</EditorTemplate>