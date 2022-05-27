<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let value: string;

    const dispatchEvent = createEventDispatcher();

    function remove(e:Event) {
        dispatchEvent("removeProj", value);
    }
</script>

<div class="mul-sel-entr" />

<style>
    @import "/theme.css";
</style>
