<script lang="ts">
  import { config, currentProject, showCrtProjModal } from "../../stores";
  import { writeConfig } from "../../lib/Utils";
  import DropDown from "../interactables/DropDown.svelte";
  import TextInput from "../interactables/TextInput.svelte";
  
  import ImageInput from "../interactables/ImageInput.svelte";

  const categories = [
    {
      label: "Web Dev",
      data: "web-dev"
    },
    {
      label: "Software Engineering",
      data: "software-engineering"
    },
    {
      label: "Web Games",
      data: "web-games"
    },
    {
      label: "Blender",
      data: "blender"
    },
    {
      label: "Steam Deck",
      data: "steam-deck"
    },
    {
      label: "Education",
      data: "education"
    },
    {
      label: "Miscellaneous",
      data: "miscellaneous"
    }
  ];

  const organizations = $config.organizations ?[ { label: "none", data: "none" }, ...Object.keys($config.organizations).map((entry: string) => { return { label: entry, data: entry } }) ] : [];

  const difficulties = [
    {
      label: "Simple",
      data: "Simple"
    },
    {
      label: "Moderate",
      data: "Moderate"
    },
    {
      label: "Complex",
      data: "Complex"
    }
  ];

  const statusses = [
    {
      label: "Not Live / Obsolete",
      data: "Not Live / Obsolete"
    },
    {
      label: "In Progress",
      data: "In Progress"
    },
    {
      label: "Complete",
      data: "Complete"
    }
  ];

  let category = "web-dev";
  let organization = "none";
  let name: string;
  let time: string;
  let status = "In Progress";
  let difficulty = "Moderate";
  let link: string;
  let projectImage: string;

  async function close(e: Event) {
    $showCrtProjModal = false;
  }

  function validateFields(): boolean {
    return name !== "" && time !== "" && link !== "" && projectImage !== "";
  }

  async function saveNew() {
    if (validateFields()) {
      const newProj = {
        category: category,
        name: name,
        time: time,
        status: status,
        difficulty: difficulty,
        description: "",
        content: {},
        link: link,
        isRelative: false,
        img: projectImage,
        org: organization,
      };

      const cfg = $config;
      const key = name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "");

      // @ts-ignore
      cfg.projects[key] = newProj;

      $config = cfg;
      await writeConfig(JSON.stringify(cfg, null, "\t"));

      $jSwitchProj = true;
      $currentProject = {
        original: name,
        key: key,
        data: {
          category: category,
          name: name,
          time: time,
          status: status,
          difficulty: difficulty,
          description: "",
          content: {},
          link: link,
          isRelative: false,
          img: projectImage,
          org: organization,
        }
      };

      $showCrtProjModal = false;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="backdrop" on:click={close}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="modal" on:click|stopPropagation={() => {}}>
    <div class="content">
      <h2>Create a New Project</h2>
      <div class="input-wrapper">
        <DropDown label={"Category"} options={categories} bind:value={category} />
        <DropDown label={"Organization"} options={organizations} bind:value={organization} />
        <DropDown label={"Difficulty"} options={difficulties} bind:value={difficulty} />
        <DropDown label={"Status"} options={statusses} bind:value={status} />

        <TextInput label="Name" placeholder="something new" bind:value={name} />
        <TextInput label="Time" placeholder="# hours" bind:value={time} />
        <TextInput label="Link" placeholder="" bind:value={link} />

        <ImageInput label="Project Image" placeholder="" bind:value={projectImage} />
      </div>

      <div class="btns-cont">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="btn" on:click={saveNew}>Create</div>
      </div>
    </div>
  </div>
</div>

<style>
  @import "/theme.css";

  .backdrop {
    z-index: 10;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    padding: 14px;
    max-width: 70vw;
    border-radius: 4px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--background);
    border: 1px solid var(--highlight);

    overflow: hidden;

    box-shadow: -2px 2px 8px 1px #000;
  }

  .content {
    max-height: 50vh;
    overflow: auto;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .btns-cont {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .btn {
    padding: 6px 20px;
    border-radius: 4px;
    border: 1px solid var(--highlight);

    background-color: var(--foreground);
  }
  .btn:hover {
    background-color: var(--hover);
    cursor: pointer;
  }
  .btn:focus {
    background-color: var(--highlight);
  }
</style>
