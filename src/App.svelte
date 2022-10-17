<script lang="ts">
	import { SvelteToast } from "@zerodevx/svelte-toast";
	import { renderIdx, showCrtArtModal, showCrtExpModal, showCrtOrgModal, showCrtProjModal } from "./stores";

	import Titlebar from "./components/window/Titlebar.svelte";
	import Setup from "./components/Setup.svelte";

	import PIdx from "./components/projects/PIdx.svelte";
	import AIdx from "./components/art/AIdx.svelte";
	import EIdx from "./components/experience/EIdx.svelte";
	import OIdx from "./components/organizations/OIdx.svelte";

	import CrtProjModal from "./components/projects/CrtProjModal.svelte";
	import CrtArtModal from "./components/art/CrtArtModal.svelte";
	import CrtExpModal from "./components/experience/CrtExpModal.svelte";
	import CrtOrgModal from "./components/organizations/CrtOrgModal.svelte";
    import ArchIdx from "./components/archive/ArchIdx.svelte";

	const components = [ Setup, PIdx, AIdx, EIdx, OIdx, ArchIdx ];
</script>

<div class="wrap">
	<SvelteToast target="top" options={{ initial: 0, intro: { y: -64 } }} />
</div>
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
<SvelteToast />

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

	.wrap {
		--toastContainerTop: 0.5rem;
		--toastContainerRight: 0.5rem;
		--toastContainerBottom: auto;
		--toastContainerLeft: 0.5rem;
		--toastWidth: 100%;
		--toastMinHeight: 100px;
		--toastPadding: 0 0.5rem;
		font-size: 0.875rem;
	}
	@media (min-width: 40rem) {
		.wrap {
			--toastContainerRight: auto;
			--toastContainerLeft: calc(50vw - 20rem);
			--toastWidth: 40rem;
		}
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