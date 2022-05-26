<script lang="ts">
	import { renderIdx, showCrtArtModal, showCrtExpModal, showCrtOrgModal, showCrtProjModal } from "./stores";

	import Titlebar from "./components/window/Titlebar.svelte";
	import Setup from "./components/Setup.svelte";

	import PIdx from "./components/projects/PIdx.svelte";
	import AIdx from "./components/art/AIdx.svelte";
	import Experience from "./components/experience/Experience.svelte";
	import Organizations from "./components/organizations/Organizations.svelte";

	import CrtProjModal from "./components/projects/CrtProjModal.svelte";
	import CrtArtModal from "./components/art/CrtArtModal.svelte";
	import CrtExpModal from "./components/experience/CrtExpModal.svelte";
	import CrtOrgModal from "./components/organizations/CrtOrgModal.svelte";

	const components = [ Setup, Experience, PIdx, Organizations, AIdx ];
</script>

<main>
	<Titlebar />
	<div class="content">
		<svelte:component this={components[$renderIdx]}/>
	
		{#if $showCrtProjModal}
			<CrtProjModal />
		{/if}
		{#if $showCrtArtModal}
			<CrtArtModal />
		{/if}
		{#if $showCrtExpModal}
			<CrtExpModal />
		{/if}
		{#if $showCrtOrgModal}
			<CrtOrgModal />
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