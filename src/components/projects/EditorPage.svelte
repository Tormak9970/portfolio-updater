<script>
	import { config } from "../../store";
	import Entry from "./Entry.svelte";
	import Editor from "./Editor.svelte";
</script>

<div id="entries">
    <div class="wrapper">
		{#each Object.entries($config.projects) as projCat}
			{#each Object.entries(projCat[1]) as proj}
				<Entry project={proj[1]} category={projCat[0]} key={proj[0]}/>
			{/each}
		{/each}
	</div>
	<Editor />
</div>

<style lang="scss">
	$font-color: rgb(231, 231, 231);
	$grey-primary: #252525;
    $grey-primary__hover: #3a3a3a;
    $grey-primary__hover-2: #303030;
	$grey-secondary: #383838;
	$grey-secondary__hover: rgb(71, 71, 71);
    $grey-black: #1a1a1a;
	$bud-green: #82b74bff;
    $bud-green__hover: rgb(138, 194, 78);
    $warning-red: #e24a4a;

	#entries {
		width: 100%;
		height: calc(100% - 30px);

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		color: $font-color;

		overflow: hidden;

		.wrapper {
			height: auto;

			overflow: auto;

			overflow: scroll;
		}
	}
</style>