<script lang="ts">
  import { config, currentArt, canSave, artList } from "../../stores";
  import { getKeyFromName, updateSettings, writeConfig } from "../../lib/Utils";
  import ImagePreview from "../interactables/ImagePreview.svelte";
  import TextInput from "../interactables/TextInput.svelte";
  import TextArea from "../interactables/TextArea.svelte";
  import VerticalSpacer from "../utils/VerticalSpacer.svelte";
  import EditorTemplate from "./EditorTemplate.svelte";
  import type { ArtEntry } from "../../types/ConfigTypes";

  let name = $currentArt.data.name;
  let image = $currentArt.data.image;
  let description = $currentArt.data.description;

  async function allowSave() {
    $canSave = true;
  }

  async function saveChanges() {
    const cfg = $config;

		if (name !== $currentArt.data.name) {
      const newKey = getKeyFromName(name);

			cfg.art[newKey] = cfg.art[$currentArt.key];
			delete cfg.art[$currentArt.key];

			$currentArt.key = newKey;
		}

    const changedArt: ArtEntry = {
      index: 0,
      name: name,
      image: image,
      description: description
    }

		$currentArt = {
      "original": $currentArt.original,
      "key": $currentArt.key,
      "data": changedArt
    };

		await updateSettings({ prop: "currentArt", data: $currentArt });
    
		cfg.art[$currentArt.key] = changedArt;

		await writeConfig(JSON.stringify(cfg, null, "\t"));

		$config = cfg;
		$canSave = false;
    
		$artList = Object.entries($config.art).map(([key, data]) => {
      return {
        key: key,
				data: data,
			}
    });
  }
</script>

<EditorTemplate saveChanges={saveChanges} curretStore={currentArt} emptyMessage="Select an Art Piece to get started">
  <div slot="fields">
    <TextInput
        label={"Name"}
        placeholder={"The name of the art piece"}
        bind:value={name}
        onChange={allowSave}
      />
      <VerticalSpacer />

      <ImagePreview
        label={"Image"}
        placeholder={"An image of the art piece"}
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