<script>
	import { onMount } from "svelte";
	import Experience from "./components/experience/Experience.svelte";
	import EditorPage from "./components/projects/EditorPage.svelte";
	import Organizations from "./components/organizations/Organizations.svelte";
	import Art from "./components/art/Art.svelte";
	import Setup from "./components/Setup.svelte";
	import { config, renderIdx, state } from "./store";
	import WindowTitleBar from "./utils/WindowTitleBar.svelte";

	let settings;
	const components = [ Setup, Experience, EditorPage, Organizations, Art ];

	onMount(async () => {
		const settingsPath = await window.api.invoke("getSettingsPath");
		settings = await fetch(settingsPath).then(response => { return response.json(); });

		window.api.send("getConfig", settings.articlesFile);
	});

	window.api.receive("config", (data) => {
		if (data[0]) {
			$config = JSON.parse(data[0]);
			$state = JSON.parse(data[2]);

			if (data[1]) {
				switch (data[1]) {
					case "Experience":
						$renderIdx = 1;
						break;
					case "Projects":
						$renderIdx = 2;
						break;
					case "Organizations":
						$renderIdx = 3;
						break;
					case "Art":
						$renderIdx = 4;
						break;
				}
			}
		} else {
			$renderIdx = 0;
		}
	})
</script>

<main>
	<WindowTitleBar title={"Portfolio Site Editor"}/>
	<svelte:component this={components[$renderIdx]}/>
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
		justify-content: flex-start;
		align-items: center;

		color: $font-color;
	}
</style>