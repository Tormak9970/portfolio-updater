<script lang="ts">
    import { expList } from "../../listStores";
import { afterUpdate, onMount } from "svelte";

	import { config } from "../../stores";

	import EditorPage from "../universal/EditorPage.svelte";
	import Editor from "./Editor.svelte";
    import Entry from "./Entry.svelte";

	afterUpdate(() => {
		$expList = [];
		for (const expEntr of Object.entries($config.experience)) {
			$expList.push({
				props: {
					data: expEntr[1],
					key: expEntr[0]
				}
			});
		}
	});

	onMount(() => {
		$expList = [];
		for (const expEntr of Object.entries($config.experience)) {
			$expList.push({
				props: {
					data: expEntr[1],
					key: expEntr[0]
				}
			});
		}
	})
</script>

<div>
    <EditorPage main={Editor} crtModal={"exp"} entry={Entry} data={$expList}/>
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