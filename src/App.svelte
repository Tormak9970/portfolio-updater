<script lang="ts">
	import { onMount } from "svelte";
	import Experience from "./components/experience/Experience.svelte";
	import EditorPage from "./components/projects/EditorPage.svelte";
	import Organizations from "./components/organizations/Organizations.svelte";
	import Art from "./components/art/Art.svelte";
	import Setup from "./components/Setup.svelte";
	import { config, renderIdx, state } from "./stores";
	import { dialog, fs } from "@tauri-apps/api";
	import { getConfig, setSettingsPath, settingsCache, settingsPath, updateSettings } from "./Utils";

	let settings;
	const components = [ Setup, Experience, EditorPage, Organizations, Art ];

	onMount(async () => {
		await setSettingsPath();
		settings = await fetch(settingsPath).then(response => { return response.json(); });

		const cfg = getConfig(settings.articlesFile);

		if (!cfg) {
			await dialog.open({ directory: true }).then(async (dir) => {
				if (dir) {
					const files = await fs.readDir(dir as string);
					const configFile = files.find((file) => file.name == "config.json");
					
					if (configFile) {
						const contents = await fs.readTextFile(configFile.path);
						const cfg = JSON.parse(contents);

						await updateSettings({prop: "configPath", data: configFile.path});

						const data = [JSON.stringify(cfg), settingsCache.selCat, JSON.stringify(settingsCache.state)]
						if (data[0]) {
							$config = JSON.parse(data[0]);
							$state = JSON.parse(data[2]);

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
						} else {
							$renderIdx = 0;
						}
					}
				}
			});
		}
	});
</script>

<main>
	<svelte:component this={components[$renderIdx]}/>
</main>

<style>
	@import "./theme.css";

	main {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		color: var(--font-color);
	}
</style>