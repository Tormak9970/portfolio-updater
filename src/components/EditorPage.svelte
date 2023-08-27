<script lang="ts">
	import Entry from "./Entry.svelte";
  import OpenCrtModal from "./modals/OpenCrtModal.svelte";

	type Data = {
		props:any
	}

	let wrapper:HTMLDivElement;

	export let field: LowercaseCategory;
	export let editor:any;
	export let data:Data[];
</script>

<div id="entries">
	<div class="wrapper" bind:this={wrapper}>
		{#if field != "archive"}
			<OpenCrtModal modal={field}/>
		{/if}
		<div class="wrap-inner">
			{#each data as datEntr}
				<Entry data={datEntr.props.data} key={datEntr.props.key} field={field} />
			{/each}
		</div>
	</div>
	<div class="editor-cont" style="width: calc(100% - {wrapper?.clientWidth}px);">
		<svelte:component this={editor} />
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