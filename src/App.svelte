<script lang="ts">
	import Experience from "./components/experience/Experience.svelte";
	import PIdx from "./components/projects/PIdx.svelte";
	import Organizations from "./components/organizations/Organizations.svelte";
	import AIdx from "./components/art/AIdx.svelte";
	import Setup from "./components/Setup.svelte";
	import { renderIdx, showCrtProjModal } from "./stores";
	import CrtProjModal from "./components/projects/CrtProjModal.svelte";
	import Titlebar from "./components/window/Titlebar.svelte";

	const components = [ Setup, Experience, PIdx, Organizations, AIdx ];
</script>

<main>
	<Titlebar />
	<div class="content">
		<svelte:component this={components[$renderIdx]}/>
	
		{#if $showCrtProjModal}
			<CrtProjModal />
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