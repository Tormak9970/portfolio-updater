<script lang="ts">
  import { config, showCrtOrgModal, state } from "../../stores";
  import { writeConfig } from "../../Utils";
  import CImageInput from "../universal/create/CImageInput.svelte";
  import CMultiSelect from "../universal/create/CMultiSelect.svelte";
  import CTextArea from "../universal/create/CTextArea.svelte";
  import CTextInput from "../universal/create/CTextInput.svelte";

  let name: string;
  let img: string;
  let about: string;
  let desc: string;
  let link: string;
  let projs: { name: string; linkId: string }[];

  const projects = [];

  for (const proj of Object.entries($config.projects)) {
    projects.push({
      // @ts-ignore
      name: proj[1].name,
      linkId: proj[0],
    });
  }

  for (const proj of Object.entries($config.archive)) {
    projects.push({
      // @ts-ignore
      name: proj[1].name,
      linkId: proj[0],
    });
  }

  async function close(e: Event) {
    $showCrtOrgModal = false;
  }

  function validateFields(): boolean {
    return name !== "" && img !== "" && about !== "" && desc !== "";
  }

  async function saveNew(e: Event) {
    if (validateFields()) {
      const newOrg = {
        name: name,
        img: img,
        about: about,
        description: desc,
        projects: projs,
      };

      const cfg = $config;
      const key = name.replaceAll(" ", "-").toLowerCase();

      // @ts-ignore
      cfg.organizations[key] = newOrg;

      $config = cfg;
      await writeConfig(JSON.stringify(cfg, null, "\t"));

      $state.organizations = {
        oOrg: name,
        key: key,
        data: {
          name: name,
          img: img,
          about: about,
          description: desc,
          projects: projs,
          link: link,
        },
      };

      $showCrtOrgModal = false;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="backdrop" on:click={close}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="modal" on:click|stopPropagation={() => {}}>
    <div class="content">
      <h2>Create a Experience entry</h2>
      <div class="input-wrapper">
        <div class="sub">
          <CTextInput fieldName="Name" cVal="something new" bind:value={name} />
          <CImageInput fieldName="Image" cVal="" bind:value={img} />
          <CTextInput fieldName="Link" cVal="link to org" bind:value={link} />
        </div>

        <CTextArea
          fieldName="About"
          cVal="description of this organization"
          bind:value={about}
        />
        <CTextArea
          fieldName="Description"
          cVal={"my involvement"}
          bind:value={desc}
        />

        <CMultiSelect
          fieldName="Projects"
          options={projects}
          bind:selected={projs}
        />
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
    max-width: 80vw;
    border-radius: 8px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--background);
    border: 1px solid var(--highlight);

    overflow: hidden;

    box-shadow: -2px 2px 8px 1px #000;
  }

  .input-wrapper {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sub {
    width: 100%;
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
