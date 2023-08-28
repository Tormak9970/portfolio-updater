<script lang="ts">
  import { dialog, fs, path } from "@tauri-apps/api";
  import { configPath } from "../../lib/Utils";

  export let label: string;
  export let placeholder: string;

  export let value = "";

  let input: HTMLInputElement;

  function handleInput(e: Event) {
    value = (e.currentTarget as HTMLInputElement).value;
  }

  async function selectImage(e: Event) {
    await dialog
      .open({
        title: `Choose the ${label.toLowerCase()}`,
        directory: false,
      })
      .then(async (file: string) => {
        const relPath = await path.join(
          "./img",
          "projs",
          await path.basename(file)
        );
        const tarPath = await path.join(
          await path.dirname(configPath),
          relPath
        );
        await fs.copyFile(file, tarPath);
        value = `./${relPath.replaceAll("\\", "/")}`;
        input.value = `./${relPath.replaceAll("\\", "/")}`;
      });
  }
</script>

<div class="image-input">
  <div class="field-name">{label}:</div>
  <input
    bind:this={input}
    type="text"
    placeholder={placeholder}
    on:change={handleInput}
  />
  <button class="upload-file" on:click={selectImage}>select</button>
</div>

<!-- svelte-ignore css-unused-selector -->
<style>
  @import "/theme.css";

  .image-input {
    margin: 5px 50px;

    display: flex;
    flex-direction: row;
    align-items: center;

    color: var(--font-color);
  }
  .image-input > .field-name {
    margin-right: 10px;
  }

  .image-input > input {
    color: var(--font-color);
    background-color: var(--foreground);
    border-radius: 4px;
    outline: none;
    border: 1px solid black;
    padding: 4px;
  }
  .image-input > input:hover {
    outline: 1px solid var(--highlight-hover);
  }
  .image-input > input:focus {
    outline: 1px solid var(--highlight);
  }

  .image-input > .upload-file {
    color: var(--font-color);
    background-color: var(--foreground);
    border-radius: 4px;
    outline: none;
    border: 1px solid black;
    padding: 4px;

    margin-left: 7px;
  }
  .image-input > .upload-file:hover {
    background-color: var(--hover);
    cursor: pointer;
  }
  .image-input > .upload-file:focus {
    outline: 1px solid var(--highlight);
  }
</style>
