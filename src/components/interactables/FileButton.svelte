<script lang="ts">
  import IconButton from "./IconButton.svelte";
  import { dialog } from "@tauri-apps/api";

  export let width = "22px";
  export let height = "22px";
  export let onChange: (filepath: string) => void;
  export let disabled = false;
  export let highlight = false;
  export let warn = false;

  async function onClick(e: MouseEvent) {
    const path = await dialog.open({
      title: "Select a file",
      directory: false,
      multiple: false
    });
    if (path && path != "") onChange(path as string);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<IconButton width={width} height={height} onClick={onClick} disabled={disabled} highlight={highlight} warn={warn}>
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
    <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
    <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/>
  </svg>
</IconButton>

<style>
  
</style>
