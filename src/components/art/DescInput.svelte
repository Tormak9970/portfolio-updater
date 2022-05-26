<script lang="ts">
	import { state } from '../../stores';
    import { updateSettings } from '../../Utils';

    export let cVal:string;

	async function handleInput(e:Event) {
        const value = (e.currentTarget as HTMLInputElement).value;
        
        $state.art.data.description = value;

        $state = $state;
        await updateSettings({prop: "state", data: $state});
	}
</script>

<div class="desc-input">
    <textarea type="text" placeholder="{cVal}" value="{cVal}" on:change="{handleInput}"/>
</div>

<style>
	@import "/theme.css";

	.desc-input {
		margin: 5px ;
        width: 80%;

		display: flex;
		flex-direction: row;
		align-items: center;

		color: var(--font-color);
	}

    .desc-input > textarea {
		color: var(--font-color);
        width: 100%;
        height: 300px;
        
        background-color: var(--foreground);
        border-radius: 4px;
        outline: none;
        border: 1px solid black;
        padding: 4px;
    }
    .desc-input > textarea:hover {
        outline: 1px solid var(--highlight-hover);
    }
    .desc-input > textarea:focus {
        outline: 1px solid var(--highlight);
    }
</style>