<script lang="ts">
	import { config } from "../../stores";

	import EditorPage from "../universal/EditorPage.svelte";
	import Editor from "./Editor.svelte";
    import Entry from "./Entry.svelte";

	const pieces = [];

	for (const expEntr of Object.entries($config.experience)) {
		pieces.push({
            props: {
                data: expEntr[1],
				key: expEntr[0]
            }
        });
	}
</script>

<div>
    <EditorPage main={Editor} crtModal={"exp"} entry={Entry} data={pieces}/>
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