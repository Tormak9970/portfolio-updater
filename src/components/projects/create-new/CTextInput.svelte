<script lang="ts">
    export let fieldName:string;
    export let cVal:string;

    export let value = "";

	function handleInput(e:Event) { value = (e.currentTarget as HTMLInputElement).value; }
</script>

<div class="create-input">
	<div class="field-name">{fieldName}:</div>
    <input type="text" placeholder="{cVal}" on:change="{handleInput}">
</div>

<!-- svelte-ignore css-unused-selector -->
<style>
	@import "/theme.css";

	.create-input {
		margin: 5px 50px;

		display: flex;
		flex-direction: row;
		align-items: center;

		color: var(--font-color);
	}
	.create-input > .field-name { margin-right: 10px; }

    .create-input > input {
		color: var(--font-color);
        background-color: var(--foreground);
        border-radius: 4px;
        outline: none;
        border: 1px solid black;
        padding: 4px;
    }
    .create-input > input:hover {
        outline: 1px solid var(--highlight-hover);
    }
    .create-input > input:focus {
        outline: 1px solid var(--highlight);
    }
</style>