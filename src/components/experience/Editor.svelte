<script lang="ts">
	import { state, config, changedKey } from '../../stores';
	import { updateSettings, writeConfig } from '../../Utils';
    import TextAreaInput from '../universal/edit/TextAreaInput.svelte';
	import EditorInput from '../universal/edit/EditorInput.svelte';
	import ImagePreview from '../universal/edit/ImagePreview.svelte';

	async function inputHandler(e:Event, fieldName:string) {
		const value = (e.currentTarget as HTMLInputElement).value;

        $state.experience.data[fieldName.toLowerCase()] = value;
        $changedKey = $state.experience.data.company.toLocaleLowerCase().concat("-").concat($state.experience.data.position.toLocaleLowerCase()).replaceAll(" ", "-");
		$state.experience.oExp = $state.experience.data.position;
        
        $state.experience.data.company = value;

        $state = $state;
        await updateSettings({prop: "state", data: $state});
	}

	async function descHandler(e:Event, fieldName:string) {
        const value = (e.currentTarget as HTMLTextAreaElement).value;
        
        $state.experience.data.description = value;

        $state = $state;
        await updateSettings({prop: "state", data: $state});
	}

	async function imageHandler(e:Event, fieldName:string) {
		const value = (e.currentTarget as HTMLInputElement).value;
        
        $state.experience.data.img = value;

        $state = $state;
        await updateSettings({prop: "state", data: $state});
	}

	async function save() {
		const cfg = $config;

        if ($changedKey) {
			// @ts-ignore
			cfg.experience[$changedKey] = cfg.experience[$state.experience.key];

			// @ts-ignore
			delete cfg.experience[$state.experience.key];

			$state.experience.key = $changedKey;
        	await updateSettings({prop: "state", data: $state});
			$changedKey = null;
		}

		// @ts-ignore
		cfg.experience[$state.experience.key] = $state.experience.data;

		await writeConfig(JSON.stringify(cfg, null, '\t'));

		$config = cfg;
	}
</script>

<div id="editor">
	<div class:hide = "{$state.experience.oExp == ""}" style="overflow: scroll; min-height: 100%;">
		<h1>Editing: {$state.experience.oExp}</h1>
		<div class="info-cont">
			<EditorInput fieldName={"Company"} cVal={$state.experience.data.company} handler={inputHandler} />
			<EditorInput fieldName={"Position"} cVal={$state.experience.data.position} handler={inputHandler} />
            <ImagePreview fieldName={"Image"} cVal={$state.experience.data.img} handler={imageHandler}/>
            <TextAreaInput fieldName={"Description"} cVal={$state.experience.data.description} handler={descHandler}/>
		</div>
		<button id="save" on:click="{save}">Save Content</button>
	</div>
	<div class:hide = "{$state.experience.oExp != ""}">
		<div class="welcome-msg">Select an Experience entry to get started</div>
	</div>
</div>

<style>
	@import "/theme.css";

	#editor {
		width: calc(100% - 325px - 2em - 40px);
		margin: 0px 20px;
		height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: var(--font-color);

		position: relative;
	}

	#save {
		font-family: 'Source Sans Pro', sans-serif;
		font-size: 16px;
		color: var(--font-color);
		background-color: var(--foreground);
		padding: 4px;
		border: 1px solid #000;
		box-shadow: 0 0 4px rgb(0 0 0 / 50%);
		border-radius: 3px;
	}
	#save:hover { cursor: pointer; background-color: var(--hover); }
	#save:focus { outline: 1px solid var(--highlight); }

	.info-cont {
		width: fit-content;

		display: flex;
		flex-direction: column;
        align-items: center;
	}

	#editor > .hide { display: none; }

	#editor > div {
		width: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: var(--font-color);

		position: relative;
	}

	#editor > div > .welcome-msg { color: var(--font-color); font-size: 30px; }
</style>