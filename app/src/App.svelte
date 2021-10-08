<script lang="ts">
	import { onMount } from "svelte";
	import AppBar from "./AppBar.svelte";
	import Editor from "./components/Editor.svelte";
	import EntriesList from "./components/EntriesList.svelte";
	import Setup from "./components/Setup.svelte";
	import { componentRender, resourcePath, readFileSync } from "./store";
	
	import path from 'path';

	let settings:Settings;
	const components = [ Editor, EntriesList, Setup ];

	onMount(async () => {
		const fileData = readFileSync(path.join(resourcePath, 'settings.json'));
		settings = fileData.toJSON() as unknown as Settings;

		$componentRender = (settings.configDir != "" && settings.openProj != "") ? 0 : (settings.configDir != "") ? 1 : 2;
	});
</script>

<main>
	<AppBar winName="Portfolio Updator"/>
	<div class="content">
		<svelte:component this={components[$componentRender]}/>
	</div>
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
		align-items: center;

		.content {
			width: 100%;
			height: calc(100% - 30px);

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			color: $font-color;
		}
	}
</style>