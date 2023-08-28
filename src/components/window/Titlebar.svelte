<script lang="ts">
  import { fs } from "@tauri-apps/api";

  import { appWindow } from "@tauri-apps/api/window";
  import { afterUpdate, onMount } from "svelte";
  import { selectedCategory, config, showSetup, currentProject, currentArt, currentExperience, currentOrganization, currentArchive } from "../../stores";
  import {
    getConfig,
    setSettingsPath,
    settingsPath,
    updateSettings,
  } from "../../lib/Utils";
  import SubMenu from "./SubMenu.svelte";
  import { exit } from "@tauri-apps/api/process";

  let minimize: HTMLDivElement;
  let maximize: HTMLDivElement;
  let close: HTMLDivElement;

  let isMaxed = false;

  let menuConfig = {
    default: $selectedCategory,
    values: ["Projects", "Art", "Experience", "Organizations", "Archive"],
  };

  let dropVal: PortfolioCategory = "Projects";

  onMount(async () => {
    await setSettingsPath();
    let settings = JSON.parse(await fs.readTextFile(settingsPath));
    $selectedCategory = settings.selectedCategory;

    $currentProject = settings.currentProject;
    $currentArt = settings.currentArt;
    $currentExperience = settings.currentExperience;
    $currentOrganization = settings.currentOrganization;
    $currentArchive = settings.currentArchive;

    const cfg = await getConfig(settings.configPath);

    if (!cfg) {
      $showSetup = true;
    } else {
      $config = cfg;
      $showSetup = false;
    }

    dropVal = $selectedCategory;
    menuConfig.default = $selectedCategory;

    minimize.addEventListener("click", () => appWindow.minimize());
    maximize.addEventListener("click", () => {
      appWindow.toggleMaximize();
      isMaxed = !isMaxed;
    });
    close.addEventListener("click", async () => {
      const success = await exit(0);
    });
  });

  afterUpdate(async () => {
    if ($config) {
      const oldCat = $selectedCategory;
      $selectedCategory = dropVal;

      if (oldCat !== $selectedCategory) {
        await updateSettings({ prop: "selectedCategory", data: dropVal });
      }
    }
  });
</script>

<div data-tauri-drag-region class="titlebar">
  <div class="info">
    <img src="/logo.svg" alt="logo" height="15px" style="margin-left: 10px;" />
    <div style="margin-left: 10px; margin-right: 30px;">Portfolio Updater</div>
    {#if !$showSetup}
      <SubMenu config={menuConfig} bind:value={dropVal} />
    {/if}
  </div>
  <div class="btns">
    <div bind:this={minimize} class="titlebar-button" id="titlebar-minimize">
      <svg width="10" height="2" viewBox="0 0 11 2">
        <path d="m11 0v1h-11v-1z" stroke-width="0.25" style="fill: white;" />
      </svg>
    </div>
    <div bind:this={maximize} class="titlebar-button" id="titlebar-maximize">
      {#if isMaxed}
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path
            d="m10-1.667e-6v10h-10v-10zm-1.001 1.001h-7.998v7.998h7.998z"
            stroke-width=".25"
            style="fill: white;"
          />
        </svg>
      {:else}
        <svg width="11" height="11" viewBox="0 0 11 11">
          <path
            d="m11 8.7978h -2.2021v 2.2022h -8.7979v -8.7978h 2.2021v -2.2022h 8.7979z m-3.2979 -5.5h -6.6012v 6.6011h 6.6012z m2.1968 -2.1968h -6.6012v 1.1011h 5.5v 5.5h 1.1011z"
            stroke-width=".275"
            style="fill: white;"
          />
        </svg>
      {/if}
    </div>
    <div bind:this={close} class="titlebar-button" id="titlebar-close">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="/img/CloseWindow.png" height="20" />
    </div>
  </div>
</div>

<style>
  @import "/theme.css";

  .titlebar {
    height: 30px;
    width: 100%;

    background: var(--foreground);
    user-select: none;
    display: inline-flex;
    justify-content: space-between;
  }
  .info {
    display: flex;
    align-items: center;
  }
  .btns {
    display: flex;
  }
  .titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 47px;
    height: 30px;
  }
  .titlebar-button:hover {
    background: var(--hover);
  }
</style>
