<script lang="ts">
    export let fieldName:string;
    export let cVal:string;
    export let handler:(e:Event, fieldName:string)=>Promise<void>;

    async function wrapper(e:Event) {
        await handler(e, fieldName.toLowerCase());
    }
</script>

<div class="text-area-input">
	<div class="field-name">{fieldName}</div>
    <textarea type="text" placeholder="{cVal}" value="{cVal}" on:change="{wrapper}"/>
</div>

<style>
	@import "/theme.css";

	.text-area-input {
		margin: 5px ;
        width: 80%;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: var(--font-color);
	}
	.text-area-input > .field-name { margin: 7px 0px; }

    .text-area-input > textarea {
		color: var(--font-color);
        width: 100%;
        height: 300px;
        
        background-color: var(--foreground);
        border-radius: 4px;
        outline: none;
        border: 1px solid black;
        padding: 4px;
    }
    .text-area-input > textarea:hover {
        outline: 1px solid var(--highlight-hover);
    }
    .text-area-input > textarea:focus {
        outline: 1px solid var(--highlight);
    }
</style>