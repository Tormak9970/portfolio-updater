<script lang="ts">
	import { changedKey, state } from '../../stores';
    import { updateSettings } from '../../Utils';

    export let fieldName:string;
    export let cVal:string;

	async function handleInput(e:Event) {
        const value = (e.currentTarget as HTMLInputElement).value;

        if (fieldName == "Name" && $state.art.oArt != value) {
            $state.art.oArt = value;
            $changedKey = value.replace(" ", "-").toLowerCase();
        }
        
        $state.art.data[fieldName.toLowerCase()] = value;

        $state = $state;
        await updateSettings({prop: "state", data: $state});
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