<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: { name:string, linkId:string };

  const dispatchEvent = createEventDispatcher();

  function remove(e:Event) {
    dispatchEvent("removeProj", value);
  }
</script>

<div class="multi-select-entry">
  <div class="field">{value.name}</div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="clear" on:click="{remove}">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
      <path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM143 208.1L190.1 255.1L143 303C133.7 312.4 133.7 327.6 143 336.1C152.4 346.3 167.6 346.3 176.1 336.1L223.1 289.9L271 336.1C280.4 346.3 295.6 346.3 304.1 336.1C314.3 327.6 314.3 312.4 304.1 303L257.9 255.1L304.1 208.1C314.3 199.6 314.3 184.4 304.1 175C295.6 165.7 280.4 165.7 271 175L223.1 222.1L176.1 175C167.6 165.7 152.4 165.7 143 175C133.7 184.4 133.7 199.6 143 208.1V208.1z"/>
    </svg>
  </div>
</div>

<style>
  .multi-select-entry {
    background-color: var(--foreground-light);
    width: calc(100% - 34px);
    height: 20px;
    padding: 7px 4px;
    
    border: 1px solid transparent;

    border-radius: 4px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 7px;
  }

  .field {
    margin-left: 7px;
    font-size: 16px;
  }

  .clear {
    fill: var(--warning);
    width: 20px;
    height: 20px;

    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 7px;

    cursor: pointer;
  }
  .clear:hover {
    fill: var(--warning-hover);
  }
</style>
