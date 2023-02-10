<script lang="ts">
	import OpenCrtModal from "./OpenCrtModal.svelte";

	type Data = {
		props:any
	}

	let wrapper:HTMLDivElement;

	export let crtModal:string;
	export let main:any;
	export let entry:any;
	export let data:Data[];
</script>

<div id="entries">
	<div class="wrapper" bind:this={wrapper}>
		{#if crtModal != ""}
			<OpenCrtModal modal={crtModal}/>
		{/if}
		<div class="wrap-inner">
			{#each data as datEntr}
				<svelte:component this={entry} {...datEntr.props}/>
			{/each}
		</div>
	</div>
	<div class="editor-cont" style="width: calc(100% - {wrapper?.clientWidth}px);">
		<svelte:component this={main} />
	</div>
</div>

<style>
	@import "/theme.css";
	#entries {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		color: var(--font-color);

		overflow: hidden;
	}

	#entries > .wrapper {
		height: calc(100% - 40px);
		min-width: 320px;

		margin-left: 20px;
	}

	#entries > .wrapper > .wrap-inner {
		height: calc(100% - 60px);
		min-width: 100%;

		overflow-y: scroll;

		overflow-x: none;
	}

	#entries > .editor-cont {
		height: 100%;
		width: auto;
	}
</style>