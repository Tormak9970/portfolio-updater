<script lang="ts">
    import { path, tauri } from "@tauri-apps/api";

    import { onMount } from "svelte";
    import { state } from "../../stores";
    import { configPath, updateSettings } from "../../Utils";

	export let data;
    export let key:string;

    let imgPath:string;

    async function setArt(e) {
        $state.art.oArt = data.name;
        $state.art.key = key;
        $state.art.data = data;

        $state = $state;
        await updateSettings({prop: "state", data: $state});
    }

    onMount(async () => {
        imgPath = await path.join(await path.dirname(configPath), data.img.substring(2));
    });
</script>

<div id="entry-{data.name}" class="entry">
    <img src="{tauri.convertFileSrc(imgPath)}" alt="" style="width: 40px; margin: 0px 7px;">
    <div class="info">
        <div class="field">{data.name}</div>
    </div>
    <div class="btn-cont">
        <div class="btn" on:click="{setArt}">
            <div>Edit</div>
        </div>
    </div>
</div>

<style>
	@import "/theme.css";

	.entry {
		height: 60px;
        min-width: 300px;

        background-color: var(--foreground);
        color: var(--font-color);

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

        border-radius: 8px;

        margin-bottom: 7px;
	}

    .entry > .info {
        margin-right: 7px;
        margin-right: 14px;

        display: flex;
        flex-direction: column;
        justify-content: start;
    }
    .entry > .info > .field {
        font-size: 20px;
        white-space: nowrap;
        max-width: 170px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .entry > .btn-cont { margin-right: 7px; }
    .entry > .btn-cont > .btn {
        height: 30px;
        width: 60px;

        cursor: pointer;
        background-color:var(--highlight);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        border-radius: 10px;
    }
    .entry > .btn-cont > .btn:hover { background-color: var(--highlight-hover); }
</style>