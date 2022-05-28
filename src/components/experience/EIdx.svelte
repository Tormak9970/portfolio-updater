<script lang="ts">
import { afterUpdate } from "svelte";

	import { config } from "../../stores";

	import EditorPage from "../universal/EditorPage.svelte";
	import Editor from "./Editor.svelte";
    import Entry from "./Entry.svelte";

	let entrs = [];

	for (const expEntr of Object.entries($config.experience)) {
		entrs.push({
            props: {
                data: expEntr[1],
				key: expEntr[0]
            }
        });
	}

	afterUpdate(() => {
		entrs = [];
		for (const expEntr of Object.entries($config.experience)) {
			entrs.push({
				props: {
					data: expEntr[1],
					key: expEntr[0]
				}
			});
		}
	});
</script>

<div>
    <EditorPage main={Editor} crtModal={"exp"} entry={Entry} data={entrs}/>
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