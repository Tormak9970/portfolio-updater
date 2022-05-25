<script lang="ts">
	import { config } from "../../stores";

	import EditorPage from "../universal/EditorPage.svelte";
	import Editor from "./Editor.svelte";
import Entry from "./Entry.svelte";
	import OpenCrtModal from "./OpenCrtModal.svelte";

	const projects = [];

	for (const projCat of Object.entries($config.projects)) {
		for (const proj of Object.entries(projCat[1])) {
			projects.push({
				props: {
					data: proj[1],
					category: projCat[0],
					key: proj[0]
				}
			});
		}
	}
</script>

<div>
    <EditorPage main={Editor} crtModal={OpenCrtModal} entry={Entry} data={projects}/>
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