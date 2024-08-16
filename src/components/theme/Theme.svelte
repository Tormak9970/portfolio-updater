<script lang="ts">
  import { argbFromHex, Hct, SchemeTonalSpot } from "@material/material-color-utilities";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import { themePrimaryColor } from "../../stores";
  import { genCSS, serializeScheme, type SerializedScheme } from "./themeUtils";

  let primaryColorUnsub: Unsubscriber;
  
  let contrast = 0.0;

  let lightScheme: SerializedScheme;
  let darkScheme: SerializedScheme;

  let styling = "";
  $: if (lightScheme && darkScheme) styling = genCSS(darkScheme);

  onMount(() => {
    primaryColorUnsub = themePrimaryColor.subscribe((color) => {
      if (color !== "") {
        darkScheme = serializeScheme(new SchemeTonalSpot(Hct.fromInt(argbFromHex(color)), true, contrast));
        lightScheme = serializeScheme(new SchemeTonalSpot(Hct.fromInt(argbFromHex(color)), false, contrast));
      }
    });
  });

  onDestroy(() => {
    if (primaryColorUnsub) primaryColorUnsub();
  })
</script>

<main>
  {@html `<${""}style>${styling}</${""}style>`}
  <div class="wrapper">
    <slot />
  </div>
</main>

<style>
  main {
    height: 100%;
    width: 100%;

    position: relative;
  }

  .wrapper {
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    flex-direction: column-reverse;

    background-color: rgb(var(--m3-scheme-background));
    color: rgb(var(--m3-scheme-on-background));
  }
</style>