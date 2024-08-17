<script lang="ts">
  import { ModalBody } from "@component-utils";
  import { Button } from "@interactables";
  import { DEFAULT_SETTINGS, updateSettings, writeConfig } from "@utils";
  import { config, currentExperience, currentProject, experienceList, projectsList, selectedCategory, showConfirmDeleteModal } from "../../stores";
  
  async function onConfirm() {
    switch ($selectedCategory) {
      case "Projects":
      // @ts-expect-error lowercase selected category always indexes $config
        delete $config[$selectedCategory.toLowerCase()][$currentProject.key];
        $currentProject = structuredClone(DEFAULT_SETTINGS.currentProject);
        await updateSettings({ prop: "currentProject", data: $currentProject });
        $projectsList = Object.entries($config.projects).map(([key, data]) => {
          return {
            key: key,
            data: data,
          }
        });
        break;
      case "Experience":
        // @ts-expect-error lowercase selected category always indexes $config
        delete $config[$selectedCategory.toLowerCase()][$currentExperience.key];
        $currentExperience = structuredClone(DEFAULT_SETTINGS.currentExperience);
        await updateSettings({ prop: "currentExperience", data: $currentExperience });
        $experienceList = Object.entries($config.experience).map(([key, data]) => {
          return {
            key: key,
            data: data,
          }
        });
        break;
    }

    await writeConfig(JSON.stringify({ ...$config }, null, "\t"));

    closeModal();
  }

  function closeModal() {
    $showConfirmDeleteModal = false;
  }
</script>

<ModalBody headline={"Caution!"} open canClose={false}>
  <div class="content">
    <div class="info">
      <div class="type-cont">
        <svg xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 0 512 512" fill="#ffee04">
          <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
        </svg>
      </div>
      <div class="message font-label-large">You can't undo this action! Are you sure you want to delete this?</div>
    </div>
  </div>
  <div class="actions" slot="buttons">
    <div class="left">
      <Button type="text" on:click={onConfirm}>Yes</Button>
    </div>
    <div class="right">
      <Button type="text" on:click={closeModal}>No</Button>
    </div>
  </div>
</ModalBody>

<style>
  .content {
    max-width: 300px;
  }

  .info {
    margin: 0px 10px;
    margin-top: 7px;
    font-size: 14px;

    display: flex;
    align-items: center;
  }

  .message {
    margin-left: 15px;
  }

  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

