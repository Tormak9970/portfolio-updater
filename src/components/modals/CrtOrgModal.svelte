<script lang="ts">
  import { config, showCrtOrgModal, state } from "../../stores";
  import { writeConfig } from "../../Utils";
  import ImageInput from "../interactables/ImageInput.svelte";
  import MultiSelect from "../interactables/multi-select/MultiSelect.svelte";
  import TextArea from "../interactables/TextArea.svelte";
  import TextInput from "../interactables/TextInput.svelte";

  let name: string;
  let img: string;
  let about: string;
  let desc: string;
  let link: string;
  let includedProjects: { name: string; linkId: string }[];

  const projects = [];
  projects.push(...Object.entries($config.projects).map(([linkId, entry]) => {
    return {
      name: (entry as any).name,
      linkId: linkId
    }
  }));
  projects.push(...Object.entries($config.archive).map(([linkId, entry]) => {
    return {
      name: (entry as any).name,
      linkId: linkId
    }
  }));

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
        projects: includedProjects,
      };

      const cfg = $config;
      const key = name.replaceAll(" ", "-").toLowerCase();

      // @ts-ignore
      cfg.organizations[key] = newOrg;

      $config = cfg;
      await writeConfig(JSON.stringify(cfg, null, "\t"));

      $state.organizations = {
        original: name,
        key: key,
        data: {
          name: name,
          img: img,
          about: about,
          description: desc,
          projects: includedProjects,
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
          <TextInput label="Name" placeholder="something new" bind:value={name} />
          <ImageInput label="Image" placeholder="" bind:value={img} />
          <TextInput label="Link" placeholder="link to org" bind:value={link} />
        </div>

        <TextArea
          label="About"
          placeholder="description of this organization"
          bind:value={about}
        />
        <TextArea
          label="Description"
          placeholder={"my involvement"}
          bind:value={desc}
        />

        <MultiSelect
          label="Projects"
          options={projects}
          bind:values={includedProjects}
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
    border-radius: 4px;

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
