<script lang="ts">
    import MulSelDropDown from "../MulSelDropDown.svelte";
    import MulSelEntry from "../MulSelEntry.svelte";

    export let fieldName:string;
    export let options:{name:string, linkId:string}[];
    export let selected:{name:string, linkId:string}[] = [];

    $: available = options.filter((o) => !selected.includes(o));

    function projectAdded(event: { detail: {name:string, linkId:string}; }) {
        selected.push(event.detail);
        selected = [...selected];
    }

    function projectRemoved(event: { detail: {name:string, linkId:string}; }) {
        selected.splice(selected.indexOf(event.detail), 1);
        selected = [...selected];
    }
</script>

<div class="multi-select">
    <div>{fieldName}</div>
    <div class="sel-cont">
        {#each selected as sel}
            <MulSelEntry value={sel} on:removeProj={projectRemoved}/>
        {/each}
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

        background-color: var(--foreground);

        border-radius: 8px;
    }

    .sel-cont {
        width: 90%;

        margin-top: 14px;
    }
</style>