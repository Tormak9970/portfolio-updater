<script lang="ts">
	import { componentRender, config } from "../store";

    const reader = new FileReader();
    reader.onload = onReaderLoad;

    async function handleClick(e: Event) {
        const elem:HTMLInputElement = <HTMLInputElement>e.currentTarget;
        const file:File = elem.files[0];

        reader.readAsText(file);
    }

    function onReaderLoad(event){
        $config = JSON.parse(event.target.result);
        $componentRender = 1;
    }
</script>

<div id="setup">
    <input type="file" id="configInput" on:change="{handleClick}">
	<button id="configPath" on:click="{() => { document.getElementById("configInput").click(); }}">Select Config File</button>
</div>

<style lang="scss">
	$grey-primary: #252525;
	$grey-secondary: #383838;
	$grey-secondary__hover: rgb(71, 71, 71);
	$font-color: rgb(231, 231, 231);
	$bud-green: #82b74bff;
    $bud-green__hover: rgb(138, 194, 78);

	#setup {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		color: $font-color;

        #configInput { display: none; }

        #configPath {
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 16px;
            color: $font-color;
            background-color: $grey-secondary;
            padding: 4px;
            border: 1px solid #000;
            box-shadow: 0 0 4px rgb(0 0 0 / 50%);
            border-radius: 3px;
            cursor: pointer;

            &:hover { background-color: $grey-secondary__hover; }
            &:focus { outline: 1px solid $bud-green; }
        }
	}
</style>