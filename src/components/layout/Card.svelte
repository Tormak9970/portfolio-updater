<script lang="ts">
  import type { HTMLAttributes, HTMLButtonAttributes } from "svelte/elements";

  export let extraOptions: HTMLAttributes<HTMLDivElement> & HTMLButtonAttributes = {};
  export let highlight = false;
  export let type: "elevated" | "filled" | "outlined" | "transparent";
</script>

<div class="m3-container type-{type}" style="display: flex;" {...extraOptions}>
  <div class="layer" class:highlight />
  <slot />
</div>

<style>
  :root {
    --m3-card-shape: var(--m3-util-rounding-medium);
  }
  .m3-container {
    flex-direction: column;
    position: relative;
    padding: 1rem; /* protip: use margin: -1rem (adjust as needed) to make images stretch to the end */
    border: none;
    border-radius: var(--m3-card-shape);
    background-color: rgb(var(--m3-scheme-surface));
    color: rgb(var(--m3-scheme-on-surface));
    transition: background-color 0.2s, box-shadow 0.2s;
  }
  .layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    transition: all 200ms;
    pointer-events: none;
  }
  
  .type-transparent {
    background-color: transparent;
  }

  .type-elevated {
    background-color: rgb(var(--m3-scheme-surface-container-low));
  }
  .type-filled {
    background-color: rgb(var(--m3-scheme-surface-container));
  }
  .type-outlined {
    border: solid 0.0625rem rgb(var(--m3-scheme-outline));
  }

  .type-elevated {
    box-shadow: var(--m3-util-elevation-1);
  }
  
  .highlight.layer {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
  }
</style>