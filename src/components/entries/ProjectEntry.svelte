<script>
  import { jSwitchProj, state } from "../../stores";
  import { updateSettings } from "../../Utils";

  export let data;
  export let key;
  export let category;

  async function setProject(e) {
    $jSwitchProj = true;
    $state.projects.oProj = data.name;
    $state.projects.key = key;
    $state.projects.data = data;

    $state = $state;
    await updateSettings({ prop: "state", data: $state });
  }
</script>

<div id="entry-{data.name}" class="entry">
  <div class="info">
    <div class="field">{data.name}</div>
    <div class="category">{category}</div>
  </div>
  <div class="btn-cont">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="btn" on:click={setProject}>
      <div>{data.content.time ? "Edit" : "Create"}</div>
    </div>
  </div>
</div>

<style>
  @import "/theme.css";

  .entry {
    height: 60px;
    min-width: 300px;

    background-color: var(--foreground);
    color: var(--font-color);

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    border-radius: 8px;

    margin-bottom: 7px;
  }

  .entry > .info {
    margin-left: 7px;
    margin-right: 14px;

    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  .entry > .info > .field {
    font-size: 20px;
    white-space: nowrap;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .entry > .info > .category {
    font-size: 16px;
  }

  .entry > .btn-cont {
    margin-right: 7px;
  }
  .entry > .btn-cont > .btn {
    height: 30px;
    width: 60px;

    cursor: pointer;
    background-color: var(--highlight);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 10px;
  }
  .entry > .btn-cont > .btn:hover {
    background-color: var(--highlight-hover);
  }
</style>
