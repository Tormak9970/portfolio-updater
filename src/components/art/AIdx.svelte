<script lang="ts">
	import { config } from "../../stores";

	import EditorPage from "../universal/EditorPage.svelte";
	import Editor from "./Editor.svelte";
    import Entry from "./Entry.svelte";

	const pieces = [];

	for (const artCat of Object.entries($config.art)) {
		pieces.push({
            props: {
                data: artCat[1],
				key: artCat[0]
            }
        });
	}
</script>

<div>
    <EditorPage main={Editor} crtModal={"art"} entry={Entry} data={pieces}/>
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