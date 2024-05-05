<script lang="ts">
  export let tag: string;
  export let index: number;
  export let onDelete: (index: number) => void;
</script>

<div class="tag-container">
  <div class="tag">{tag}</div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="delete-container" on:click={() => onDelete(index) }>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="14px" height="14px">
      <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
    </svg>
  </div>
</div>

<style>
  .tag-container {
    border-radius: 4px;
    padding: 4px 6px;

    margin-right: 5px;
    margin-bottom: 5px;

    font-weight: 600;
    font-size: 14px;

    background-color: var(--highlight-alt);
    color: var(--highlight-alt-text);

    display: flex;
    align-items: center;
  }

  .delete-container {
    border-radius: 4px;
    
    display: flex;
    align-items: center;
    justify-content: center;

    margin-left: 5px;
  }

  .delete-container svg {
    fill: var(--warning);
  }

  .delete-container:hover {
    cursor: pointer;
  }

  .delete-container:hover svg {
    fill: var(--warning-hover);
  }
</style>