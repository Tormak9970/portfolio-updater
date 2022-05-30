<script lang="ts">
    export let fieldName:string;
    export let cVal:string;
    export let handler:(e:Event, fieldName:string)=>Promise<void>;

    async function wrapper(e:Event) {
        await handler(e, fieldName);
    }
</script>

<div class="editor-input">
	<div class="field-name">{fieldName}:</div>
    <input type="text" placeholder="{cVal}" value="{cVal}" on:change="{wrapper}">
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