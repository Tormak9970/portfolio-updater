<script lang="ts">
    import { path, tauri } from '@tauri-apps/api';

    import { afterUpdate, onMount } from 'svelte';

	import { state } from '../../stores';
    import { configPath, updateSettings } from '../../Utils';

    export let label:string;

	async function handleInput(e:Event) {
        const value = (e.currentTarget as HTMLInputElement).value;
        
        $state.art.data.path = value;

        $state = $state;
        await updateSettings({prop: "state", data: $state});
	}

    let imgPath = "";

    onMount(async () => {
        if ($state.art.data.path) {
            imgPath = await path.join(await path.dirname(configPath), $state.art.data.path.substring(2));
        }
    });

    afterUpdate(async () => {
        if ($state.art.data.path) {
            imgPath = await path.join(await path.dirname(configPath), $state.art.data.path.substring(2));
        }
    });
</script>

<div class="img-preview">
	<div class="info">
        <div class="field-name">{label}:</div>
        <input type="text" placeholder="{$state.art.data.path ? $state.art.data.path : null}" on:change="{handleInput}">
    </div>
    <div class="prev" style="margin-top: 7px;">
        <img src="{tauri.convertFileSrc(imgPath)}" alt="" style="max-width: 100%;">
    </div>
</div>

<!-- svelte-ignore css-unused-selector -->
<style>
	@import "/theme.css";

	.img-preview {
        width: 80%;
        max-width: 700px;
		margin: 5px;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: var(--font-color);
	}
    .img-preview > .info {
        display: flex;
        
    }
	.img-preview > .info > .field-name { margin-right: 10px; }

    .img-preview > .info > input {
		color: var(--font-color);
        background-color: var(--foreground);
        border-radius: 4px;
        outline: none;
        border: 1px solid black;
        padding: 4px;
    }
    .img-preview > .info > input:hover {
        outline: 1px solid var(--highlight-hover);
    }
    .img-preview > .info > input:focus {
        outline: 1px solid var(--highlight);
    }

    .img-preview > .prev {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>