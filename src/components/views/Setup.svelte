<script lang="ts">
  import { Button } from "@interactables";
  import { dialog } from "@tauri-apps/api";
  import { getConfig, updateSettings } from "@utils";
  import { config, showSetup } from "../../stores";

  async function onClick() {
    const file = await dialog.open({
      directory: false,
      title: "Select the config file",
      multiple: false,
    });

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
  <Button type="elevated" on:click={onClick}>
    Choose Config
  </Button>
</div>

<style>
  #setup {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
