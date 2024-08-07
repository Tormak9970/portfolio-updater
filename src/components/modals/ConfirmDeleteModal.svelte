<script lang="ts">
  import { updateSettings, writeConfig } from "../../lib/Utils";
  import { config, currentExperience, currentProject, experienceList, projectsList, selectedCategory, showConfirmDeleteModal } from "../../stores";
  import ModalBody from "./ModalBody.svelte";
  import Button from "../interactables/Button.svelte";

  async function onConfirm() {
    switch ($selectedCategory) {
      case "Projects":
        delete $config[$selectedCategory.toLowerCase()][$currentProject.key];
        $currentProject = {
          original: "",
          key: "",
          data: {
            index: 0,
            name: "",
            description: "",
            content: {},
            link: "",
            image: "",
            tech: []
          },
        };
        await updateSettings({ prop: "currentProject", data: $currentProject });
        $projectsList = Object.entries($config.projects).map(([key, data]) => {
          return {
            key: key,
            data: data,
          }
        });
        break;
      case "Experience":
        delete $config[$selectedCategory.toLowerCase()][$currentExperience.key];
        $currentExperience = {
          original: "",
          key: "",
          data: {
            index: 0,
            company: "",
            position: "",
            description: "",
            duration: "",
            companyLink: ""
          },
        };
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

<ModalBody title={"Are you sure you want to delete this?"} canClose={false}>
  <div class="content">
    <div class="info">
      <div class="type-cont">
        <svg xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 0 512 512" fill="#ffee04">
          <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
        </svg>
      </div>
      <div class="message">Are you sure you want to delete this entry? You can't undo this action!</div>
    </div>
    <div class="buttons">
      <Button label={"Yes"} onClick={onConfirm} width={"47.5%"} />
      <Button label={"No"} onClick={closeModal} width={"47.5%"} />
    </div>
  </div>
</ModalBody>

<style>
  .content {
    max-width: 400px;
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

  .buttons {
    margin-top: 14px;
    margin-bottom: 7px;
    margin-left: 7px;
    margin-right: 7px;
    width: calc(100% - 14px);
    display: flex;
    justify-content: space-around;
    justify-self: flex-end;
  }
</style>

