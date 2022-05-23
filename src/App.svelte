<script lang="ts">
	import { onMount } from "svelte";
	import Experience from "./components/experience/Experience.svelte";
	import EditorPage from "./components/projects/EditorPage.svelte";
	import Organizations from "./components/organizations/Organizations.svelte";
	import Art from "./components/art/Art.svelte";
	import Setup from "./components/Setup.svelte";
	import { config, renderIdx, selCat, showCreateNewModal, state } from "./stores";
	import { fs } from "@tauri-apps/api";
	import { getConfig, setSettingsPath, settingsPath } from "./Utils";
	import CreateNewModal from "./components/projects/create-new/CreateNewModal.svelte";
	import Titlebar from "./components/window/Titlebar.svelte";

	const components = [ Setup, Experience, EditorPage, Organizations, Art ];

	onMount(async () => {
		await setSettingsPath();
		let settings = JSON.parse(await fs.readTextFile(settingsPath));
		$selCat = settings.selCat;
		$state = settings.state

		const cfg = await getConfig(settings.configPath);

		if (!cfg) {
			$renderIdx = 0;
		} else {
			$config = cfg;

			switch ($selCat) {
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
	});
</script>

<main>
	<Titlebar />
	<div class="content">
		<svelte:component this={components[$renderIdx]}/>
	
		{#if $showCreateNewModal}
			<CreateNewModal />
		{/if}
	</div>
</main>

<style>
	@import "/theme.css";

	main {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		color: var(--font-color);
	}

	.content {
		width: 100%;
		height: calc(100% - 30px);

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
</style>