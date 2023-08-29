<script lang="ts">
	import { SvelteToast } from "@zerodevx/svelte-toast";
	import { showConfirmDeleteModal, showCrtArtModal, showCrtExpModal, showCrtOrgModal, showCrtProjModal, showSetup } from "./stores";

	import Titlebar from "./components/Titlebar.svelte";
	import Setup from "./components/Setup.svelte";
  import Core from "./components/Core.svelte";

	import CrtProjModal from "./components/modals/CrtProjModal.svelte";
	import CrtArtModal from "./components/modals/CrtArtModal.svelte";
	import CrtExpModal from "./components/modals/CrtExpModal.svelte";
	import CrtOrgModal from "./components/modals/CrtOrgModal.svelte";
    import ConfirmDelete from "./components/modals/ConfirmDelete.svelte";
</script>

<div class="wrap">
	<SvelteToast target="top" options={{ initial: 0, intro: { y: -64 } }} />
</div>
<main>
	<Titlebar />
	<div class="content">
		<svelte:component this={$showSetup ? Setup : Core}/>
	
    {#if $showConfirmDeleteModal}
      <ConfirmDelete />
    {/if}
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