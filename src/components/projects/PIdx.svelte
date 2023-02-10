<script lang="ts">
    import { projsList } from "../../listStores";
	import { afterUpdate, onMount } from "svelte";

	import { config } from "../../stores";

	import EditorPage from "../universal/EditorPage.svelte";
	import Editor from "./Editor.svelte";
	import Entry from "./Entry.svelte";

	afterUpdate(() => {
		$projsList = [];
		for (const proj of Object.entries($config.projects)) {
			$projsList.push({
				props: {
					data: proj[1],
					// @ts-ignore
					category: proj[1].category,
					key: proj[0]
				}
			});
		}
	});

	onMount(() => {
		$projsList = [];
		for (const proj of Object.entries($config.projects)) {
			$projsList.push({
				props: {
					data: proj[1],
					// @ts-ignore
					category: proj[1].category,
					key: proj[0]
				}
			});
		}
	})
</script>

<div>
	<EditorPage main={Editor} crtModal={"proj"} entry={Entry} data={$projsList}/>
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