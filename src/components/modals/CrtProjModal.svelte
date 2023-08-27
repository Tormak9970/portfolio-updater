<script lang="ts">
  import { config, jSwitchProj, showCrtProjModal, state } from "../../stores";
  import { writeConfig } from "../../Utils";
  import CDropDown from "../universal/create/CDropDown.svelte";
  import CImageInput from "../universal/create/CImageInput.svelte";
  import CTextInput from "../universal/create/CTextInput.svelte";

  let dropCnfgCat = {
    default: "web-dev",
    // @ts-ignore
    values: [
      "web-dev",
      "software-engineering",
      "web-games",
      "blender",
      "steam-deck",
      "education",
      "miscellaneous",
    ],
  };

  let dropCnfgOrg = {
    default: "none",
    // @ts-ignore
    values: $config.organizations ? Object.keys($config.organizations) : [],
  };
  dropCnfgOrg.values.unshift("none");
  let dropCfgDiff = {
    default: "Moderate",
    values: ["Simple", "Moderate", "Complex"],
  };
  let dropCfgStat = {
    default: "In Progress",
    values: ["Not Live / Obsolete", "In Progress", "Complete"],
  };

  let category: string;
  let org: string;
  let name: string;
  let time: string;
  let status: string;
  let difficulty: string;
  let link: string;
  let projImg: string;

  async function close(e: Event) {
    $showCrtProjModal = false;
  }

  function validateFields(): boolean {
    return name !== "" && time !== "" && link !== "" && projImg !== "";
  }

  async function saveNew(e: Event) {
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
        img: projImg,
        org: org,
      };

      const cfg = $config;
      const key = name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "");

      // @ts-ignore
      cfg.projects[key] = newProj;

      $config = cfg;
      await writeConfig(JSON.stringify(cfg, null, "\t"));

      $jSwitchProj = true;
      $state.projects = {
        oProj: name,
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
          img: projImg,
          org: org,
        },
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
        <!-- Catagory Dropdown -->
        <CDropDown
          fieldName="Catagory"
          config={dropCnfgCat}
          bind:value={category}
        />

        <!-- Organization Dropdown -->
        <CDropDown
          fieldName="Organization"
          config={dropCnfgOrg}
          bind:value={org}
        />

        <!-- Organization Dropdown -->
        <CDropDown
          fieldName="Difficulty"
          config={dropCfgDiff}
          bind:value={difficulty}
        />

        <!-- Organization Dropdown -->
        <CDropDown
          fieldName="Status"
          config={dropCfgStat}
          bind:value={status}
        />

        <CTextInput fieldName="Name" cVal="something new" bind:value={name} />
        <CTextInput fieldName="Time" cVal="# hours" bind:value={time} />
        <CTextInput fieldName="Link" cVal="" bind:value={link} />

        <CImageInput fieldName="Project Image" cVal="" bind:value={projImg} />
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
    border-radius: 8px;

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
    border-radius: 8px;
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
