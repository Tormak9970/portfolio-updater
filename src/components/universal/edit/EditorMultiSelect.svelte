<script lang="ts">
    import MulSelDropDown from "../MulSelDropDown.svelte";

    export let fieldName:string;
    export let options:string[];
    export let selected:string[];
    export let handler:(values:string[], fieldName:string)=>Promise<void>;

    $: available = options.filter((o) => !selected.includes(o));

    function projectAdded(event) {
        // event.detail
    }

    function projectRemoved(event) {
        // event.detail
    }
</script>

<div class="multi-select">
    <div class="sel-cont">

    </div>
    <MulSelDropDown values={available} on:addedProject={projectAdded}/>
</div>

<style>
	@import "/theme.css";

    .multi-select {
        width: 80%;
        margin: 5px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

</style>