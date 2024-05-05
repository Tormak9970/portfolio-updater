<script lang="ts">
  import { dialog } from "@tauri-apps/api";
  import { config, showSetup } from "../stores";
  import { getConfig, updateSettings } from "../lib/Utils";
  import Button from "./interactables/Button.svelte";

  async function onClick() {
    const file = await dialog.open({ directory: false, title: "Select the config file", multiple: false, });

    if (file) {
      const configFile = file as string;

      if (configFile) {
        const cfg = await getConfig(configFile);

        await updateSettings({ prop: "configPath", data: configFile });

        $config = cfg;
        $showSetup = false;
      }
    }
  }
</script>

<div id="setup">
  <Button label="Choose Config" onClick={onClick} width="200px" height="30px"/>
</div>

<style>
  #setup {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: var(--font-color);
  }
</style>
