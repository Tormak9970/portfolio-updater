<script lang="ts">
	import { onMount } from "svelte";
import Editor from "./components/Editor.svelte";
	import EntriesList from "./components/EntriesList.svelte";
	import Setup from "./components/Setup.svelte";
	import { componentRender } from "./Store";

	let settings:Settings;
	const components = [ Editor, EntriesList, Setup ];

	onMount(async () => {
		settings = await fetch('./settings.json').then(response => { return response.json(); });

		$componentRender = (settings.configDir != "" && settings.openProj != "") ? 0 : (settings.configDir != "") ? 1 : 2;
	});
</script>

<main>
	<svelte:component this={components[$componentRender]} settings={settings} />
</main>

<style lang="scss">
	$grey-primary: #252525;
	$grey-secondary: #383838;
	$grey-secondary__hover: rgb(71, 71, 71);
	$font-color: rgb(231, 231, 231);
	$bud-green: #82b74bff;
    $bud-green__hover: rgb(138, 194, 78);

	main {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		color: $font-color;
	}
</style>