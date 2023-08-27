<script lang="ts">
  import { dialog, fs } from "@tauri-apps/api";
  import { config, renderIdx, selCat } from "../stores";
  import { getConfig, updateSettings } from "../Utils";

  async function click() {
    const file = await dialog.open({ directory: false, title: "Select the config file", multiple: false, });

    if (file) {
      const configFile = file as string;

      if (configFile) {
        const cfg = await getConfig(configFile);

        await updateSettings({ prop: "configPath", data: configFile });

        $config = cfg;

        switch ($selCat) {
          case "Projects":
            $renderIdx = 1;
            break;
          case "Art":
            $renderIdx = 2;
            break;
          case "Experience":
            $renderIdx = 3;
            break;
          case "Organizations":
            $renderIdx = 4;
            break;
          case "Archive":
            $renderIdx = 5;
            break;
        }
      }
    }
  }
</script>

<div id="setup">
  <button id="configPath" on:click={click}>Select Config File</button>
</div>

<style>
  @import "/theme.css";

  #setup {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: var(--font-color);
  }

  #configPath {
    font-family: "Source Sans Pro", sans-serif;
    font-size: 16px;
    color: var(--font-color);
    background-color: var(--foreground);
    padding: 4px;
    border: 1px solid #000;
    box-shadow: 0 0 4px rgb(0 0 0 / 50%);
    border-radius: 3px;
    cursor: pointer;
  }

  #configPath:hover {
    background-color: var(--hover);
  }
  #configPath:focus {
    outline: 1px solid var(--highlight);
  }
</style>
