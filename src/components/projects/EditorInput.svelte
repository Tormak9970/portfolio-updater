<script lang="ts">
	import { state, changedCat, changedKey } from '../../stores';

    export let fieldName:string;
    export let cVal:string;

	async function handleInput(e:Event) {
        const value = (e.currentTarget as HTMLInputElement).value;
        if (fieldName == "Category" && $state.projects.cat != value) {
            $changedCat = value;
        } else if (fieldName == "Name" && $state.projects.oProj != value) {
            $state.projects.oProj = value;
            $changedKey = value.replace(" ", "-").toLowerCase();
        }
        
        $state.projects.data[fieldName.toLowerCase()] = value;

        $state = $state;
	}
</script>

<div class="editor-input">
	<div class="field-name">{fieldName}:</div>
    <input type="text" placeholder="{cVal}" on:change="{handleInput}">
</div>

<!-- svelte-ignore css-unused-selector -->
<style>
	@import "/theme.css";

	.editor-input {
		width: calc(100% - 100px);
		margin: 5px 50px;

		display: flex;
		flex-direction: row;
		align-items: center;

		color: var(--font-color);
	}
	.editor-input > .field-name { margin-right: 10px; }

    .editor-input > input {
		color: var(--font-color);
        background-color: var(--foreground);
        border-radius: 4px;
        outline: none;
        border: 1px solid black;
        padding: 4px;
    }
    .editor-input > input:hover {
        outline: 1px solid var(--highlight-hover);
    }
    .editor-input > input:focus {
        outline: 1px solid var(--highlight);
    }
</style>