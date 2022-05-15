<script>
</script>

<div id="setup">
	<button id="configPath" on:click="{() => { window.api.send("showDialog", "config"); }}">Select Config File</button>
</div>

<style>
	@import "../theme.css";

	#setup {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		color: var(--font-color);
	}

    #configPath {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 16px;
        color: var(--font-color);
        background-color: var(--foreground);
        padding: 4px;
        border: 1px solid #000;
        box-shadow: 0 0 4px rgb(0 0 0 / 50%);
        border-radius: 3px;
        cursor: pointer;
    }

    #configPath:hover { background-color: var(--hover); }
    #configPath:focus { outline: 1px solid var(--highlight); }
</style>