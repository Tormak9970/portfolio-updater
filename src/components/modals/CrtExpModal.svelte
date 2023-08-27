<script lang="ts">
  import { config, showCrtExpModal, state } from "../../stores";
  import { writeConfig } from "../../Utils";
  import ImageInput from "../interactables/ImageInput.svelte";
  import TextArea from "../interactables/TextArea.svelte";
    import TextInput from "../interactables/TextInput.svelte";

  let comp: string;
  let pos: string;
  let img: string;
  let desc: string;

  async function close(e: Event) {
    $showCrtExpModal = false;
  }

  function validateFields(): boolean {
    return comp !== "" && img !== "" && pos !== "" && desc !== "";
  }

  async function saveNew(e: Event) {
    if (validateFields()) {
      const newExp = {
        company: comp,
        position: pos,
        img: img,
        description: desc,
      };

      const cfg = $config;
      const key = comp
        .toLocaleLowerCase()
        .concat("-")
        .concat(pos.toLocaleLowerCase())
        .replaceAll(" ", "-");

      // @ts-ignore
      cfg.experience[key] = newExp;

      $config = cfg;
      await writeConfig(JSON.stringify(cfg, null, "\t"));

      $state.experience = {
        original: pos,
        key: key,
        data: {
          company: comp,
          img: img,
          position: pos,
          description: desc,
        },
      };

      $showCrtExpModal = false;
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
          <TextInput
            label="Company"
            placeholder="something new"
            bind:value={comp}
          />
          <TextInput
            label="Position"
            placeholder="position held"
            bind:value={pos}
          />

          <ImageInput label="Image" placeholder="" bind:value={img} />
        </div>

        <TextArea label="Description" placeholder={""} bind:value={desc} />
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

  .input-wrapper {
    width: auto;

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
