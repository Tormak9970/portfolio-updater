<script lang="ts">
    import { dialog, fs, path, tauri } from '@tauri-apps/api';

    import { afterUpdate, onMount } from 'svelte';
    import { configPath } from '../../../Utils';

	export let fieldName:string;
    export let cVal:string;
    export let handler:(e:Event, fieldName:string)=>Promise<void>;

    let input:HTMLInputElement;

    const changeEvnt = new Event("change");

    async function wrapper(e:Event) {
        await handler(e, fieldName.toLowerCase());
    }

    async function selectImage(e:Event) {
        await dialog.open({
            "title": `Choose the ${fieldName.toLowerCase()}`,
            "directory": false
        }).then(async (file:string) => {
            const relPath = await path.join('./img', 'projs', await path.basename(file));
            const tarPath = await path.join(await path.dirname(configPath), relPath);
            await fs.copyFile(file, tarPath);
            input.value = `./${relPath.replaceAll("\\", "/")}`;
            input.dispatchEvent(changeEvnt);
            imgPath = tarPath;
        });
    }

    let imgPath = "";

    onMount(async () => {
        imgPath = await path.join(await path.dirname(configPath), cVal.substring(2));
    });

    afterUpdate(async () => {
        imgPath = await path.join(await path.dirname(configPath), (input.value != "" ? input.value : cVal).substring(2));
    });
</script>

<div class="img-preview">
	<div class="info">
        <div class="field-name">{fieldName}:</div>
        <input type="text" placeholder="{cVal}" value="{cVal}" on:change="{wrapper}" bind:this="{input}">
        <button class="upload-file" on:click="{selectImage}">select</button>
    </div>
    <div class="prev" style="margin-top: 7px;">
        <img src="{tauri.convertFileSrc(imgPath)}" alt="" style="max-width: 100%;">
    </div>
</div>

<!-- svelte-ignore css-unused-selector -->
<style>
	@import "/theme.css";

	.img-preview {
        width: 300px;
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

        pointer-events: none;
    }

    .img-preview > .info > .upload-file {
        color: var(--font-color);
        background-color: var(--foreground);
        border-radius: 4px;
        outline: none;
        border: 1px solid black;
        padding: 4px;

        margin-left: 7px;
    }
    .img-preview > .info > .upload-file:hover {
        background-color: var(--hover);
        cursor: pointer;
    }
    .img-preview > .info > .upload-file:focus { outline: 1px solid var(--highlight); }

    .img-preview > .prev {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>