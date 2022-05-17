<script>
	import { config } from "../../stores";
	import Entry from "./Entry.svelte";
	import Editor from "./Editor.svelte";
</script>

<div id="entries">
    <div class="wrapper">
		{#each Object.entries($config.projects) as projCat}
			{#each Object.entries(projCat[1]) as proj}
				<Entry data={proj[1]} category={projCat[0]} key={proj[0]}/>
			{/each}
		{/each}
	</div>
	<Editor />
</div>

<style>
	@import "/theme.css";
	#entries {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		color: var(--font-color);

		overflow: hidden;
	}

	#entries > .wrapper {
		height: calc(100% - 40px);

		overflow: auto;

		overflow: scroll;

		margin-left: 20px;
	}
</style>