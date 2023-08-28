<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let values: { name: string; linkId: string }[];

  const dispatchEvent = createEventDispatcher();

  const body = document.getElementsByTagName("body")[0];

  if (!body.hasAttribute("data-select-close")) {
    document.addEventListener("click", closeAllSelect);
    body.setAttribute("data-select-close", "");
  }

  function closeAllSelect(elmnt) {
    var x,
      y,
      i,
      xl,
      yl,
      arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }

  function aHandleClick(e: Event) {
    const target = <HTMLDivElement>e.currentTarget;
    closeAllSelect(target);
    target.nextElementSibling.classList.toggle("select-hide");
    target.classList.toggle("select-arrow-active");
  }

  function eHandleClick(e: Event) {
    const elem = <HTMLElement>e.currentTarget;
    let s =
      elem.parentElement.parentElement.parentElement.getElementsByTagName(
        "select"
      )[0];
    let sl = s.length;
    let h = elem.parentElement.previousElementSibling;

    for (let i = 0; i < sl; i++) {
      if (s.options[i].innerHTML == elem.innerHTML) {
        s.selectedIndex = i;

        break;
      }
    }

    dispatchEvent(
      "addedProject",
      values.find((v) => v.name == elem.innerHTML)
    );

    (h as HTMLElement).click();
  }
</script>

<div class="custom-select">
  <select>
    <option value="default" />
    {#each values as val}
      <option value={val.name.toLowerCase()}>{val.name}</option>
    {/each}
  </select>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="select-selected" on:click|stopPropagation={aHandleClick}>
    Add a project
  </div>
  <div class="select-items select-hide">
    {#each values as val}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div id={val.name} on:click|stopPropagation={eHandleClick}>
        {val.name}
      </div>
    {/each}
  </div>
</div>

<style>
  @import "/theme.css";

  .custom-select {
    position: relative;
    font-size: 16px;
    width: 100%;
  }
  .custom-select > select {
    display: none;
  }
  .select-selected {
    background-color: var(--foreground);
    width: calc(100% - 10px);
    padding: 7px 4px;

    border: 1px solid transparent;

    border-radius: 4px;
    cursor: pointer;
  }
  .select-selected::after {
    position: absolute;
    content: "";
    top: 38.88%;
    right: 5%;
    width: 0;
    height: 0;
    border: min(1.333vw, 6px) solid transparent;
    border-color: var(--font-color) transparent transparent transparent;
  }
  :global(.select-arrow-active::after) {
    border-color: transparent transparent var(--font-color) transparent !important;
    top: 7px !important;
  }
  .select-items > div {
    color: var(--font-color);
    padding: 2px 4px;
    border: 1px solid transparent;
    cursor: pointer;
  }
  .select-items {
    position: absolute;
    background-color: var(--foreground);
    bottom: 100%;
    left: 0;
    right: 0;
    z-index: 99;

    border-radius: 4px;

    box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.85);
  }
  .select-items > div:hover {
    background-color: var(--hover);
    cursor: pointer;
  }
  .select-hide {
    display: none;
  }
</style>
