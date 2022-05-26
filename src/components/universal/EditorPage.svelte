<script lang="ts">
import OpenCrtModal from "./OpenCrtModal.svelte";

	type Data = {
		props:any
	}

	export let crtModal:string;
	export let main:any;
	export let entry:any;
	export let data:Data[];
</script>

<div id="entries">
    <div class="wrapper">
		<OpenCrtModal modal={crtModal}/>
		<div class="wrap-inner">
			{#each data as datEntr}
				<svelte:component this={entry} {...datEntr.props}/>
			{/each}
		</div>
	</div>
	<svelte:component this={main} />
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

		overflow: auto;

		overflow: scroll;
	}
</style>