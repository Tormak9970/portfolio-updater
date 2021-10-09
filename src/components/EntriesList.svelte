<script lang="ts">
	import { config } from "../store";
	import Entry from "./Entry.svelte";

    function typeConfirmer(entr:[string, unknown]): [string, Project] { return [entr[0], entr[1] as Project]; }
</script>

<div id="entries">
    <div class="wrapper">
		{#each Object.entries($config.projects) as projCat}
			{#each Object.entries(projCat[1]).map(typeConfirmer) as proj}
				<Entry project={proj[1]} category={projCat[0]} key={proj[0]}/>
			{/each}
		{/each}
	</div>
</div>

<style lang="scss">
	$grey-primary: #252525;
	$grey-secondary: #383838;
	$grey-secondary__hover: rgb(71, 71, 71);
	$font-color: rgb(231, 231, 231);
	$bud-green: #82b74bff;
    $bud-green__hover: rgb(138, 194, 78);

	#entries {
		width: 100%;
		height: 80%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		color: $font-color;

		overflow: hidden;

		.wrapper {
			height: auto;

			overflow: auto;
		}
	}
</style>