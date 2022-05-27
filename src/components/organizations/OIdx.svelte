<script lang="ts">
	import { config } from "../../stores";

	import EditorPage from "../universal/EditorPage.svelte";
	import Editor from "./Editor.svelte";
    import Entry from "./Entry.svelte";

	const orgs = [];

	for (const orgEntr of Object.entries($config.organizations)) {
		orgs.push({
            props: {
                data: orgEntr[1],
				key: orgEntr[0]
            }
        });
	}
</script>

<div>
    <EditorPage main={Editor} crtModal={"exp"} entry={Entry} data={orgs}/>
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