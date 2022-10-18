<script lang="ts">
    import { artList } from "../../listStores";
	import { afterUpdate, onMount } from "svelte";

	import { config } from "../../stores";

	import EditorPage from "../universal/EditorPage.svelte";
	import Editor from "./Editor.svelte";
    import Entry from "./Entry.svelte";

	afterUpdate(() => {
		$artList = [];
		for (const artPiece of Object.entries($config.art)) {
			$artList.push({
				props: {
					data: artPiece[1],
					key: artPiece[0]
				}
			});
		}
	});

	onMount(() => {
		$artList = [];
		for (const artPiece of Object.entries($config.art)) {
			$artList.push({
				props: {
					data: artPiece[1],
					key: artPiece[0]
				}
			});
		}
	})
</script>

<div>
    <EditorPage main={Editor} crtModal={"art"} entry={Entry} data={$artList}/>
</div>

<style>
	@import "/theme.css";

	div {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		color: var(--font-color);
	}
</style>