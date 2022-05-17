<script lang="ts">
	import EditorJs from '@editorjs/editorjs';
	import Header from '@editorjs/header';
	import Code from '@editorjs/code';
	import List from '../../libs/nestedList';
	import Delimiter from '@editorjs/delimiter';
	import Paragraph from '@editorjs/paragraph';
	import Embed from '@editorjs/embed';
	import ImageTool from '../../libs/imagePlugin';
	
	import { onMount } from 'svelte';
	import { state, jSwitchProj, config } from '../../stores';
	import { uploadFile, uploadUrl, writeConfig } from '../../Utils';
import EditorInput from './EditorInput.svelte';

	let editor;
	let saved = true;
	let showSave = false;
	let wasProgramatic = false;

	onMount(() => {
		editor = new EditorJs({
			holder : 'editorjs',
			// @ts-ignore
			logLevel: 'ERROR',
			tools: {
				header: { class: Header, inlineToolbar : true },
				code: { class: Code, inlineToolbar : true },
				image: {
					class: ImageTool,
					config: {
						uploader: {
							uploadByFile: async (file) => {
								await file;
								const uploadRes = await uploadFile(file.path);
								return JSON.parse(uploadRes);
							},
							uploadByUrl: async (url) => {
								const uploadRes = await uploadUrl(url);
								return JSON.parse(uploadRes);
							}
						}
					}
				},
				list: { class: List, inlineToolbar : true },
				delimiter: { class: Delimiter, inlineToolbar : true },
				paragraph: { class: Paragraph, inlineToolbar : true },
				embed: { class: Embed, inlineToolbar : true },
			},
			onChange: async () => {
				if (!wasProgramatic) {
					if (saved) saved = false;
					const content = await getEditorContent();
					wasProgramatic = true;
					// @ts-ignore
					$state.projects.data.content = content;
				} else {
					wasProgramatic = false;
				}
			},
			// @ts-ignore
			data: $state.projects.data.content
		});
	});

	$: {
		// @ts-ignore
		renderNewContent($state.projects.data.content);
	}

	const renderNewContent = (data) => {
		if (editor && $jSwitchProj) {
			wasProgramatic = true;
			$jSwitchProj = false;
			if (data.time && data.blocks?.length > 0 && data.version) {
				console.log("updating editor");
				editor.render(data);
			} else {
				editor.clear();
			}
		}
	};

	async function getEditorContent() {
		const content = await editor.save().then((outputData) => { return outputData; });
		const contentStr = JSON.stringify(content);
		return JSON.parse(contentStr.replaceAll(`<a href`, `<a target=\\"_blank\\" rel=\\"noreferrer noopener\\" href`));
	}

	async function handleTextInput(e:Event) {

	}

	async function save() {
		const content = await getEditorContent();
		const cfg = $config;

		// @ts-ignore
		cfg.projects[$state.projects.cat][$state.projects.key].content = content;
		// @ts-ignore
		cfg.projects[$state.projects.cat][$state.projects.key].description = content.blocks[1].data.text;

		await writeConfig(JSON.stringify(cfg));

		$config = cfg;
		saved = true;
	}
</script>

<div id="editor">
	<div class:hide = "{$state.projects.oProj == ""}" style="overflow: scroll; min-height: 100%;">
		<h1>Editing: {$state.projects.oProj}</h1>
		<EditorInput fieldName={"Category"} cVal={$state.projects.cat} />
		<EditorInput fieldName={"Name"} cVal={$state.projects.data.name} />
		<EditorInput fieldName={"Time"} cVal={$state.projects.data.time} />
		<EditorInput fieldName={"Status"} cVal={$state.projects.data.status} />
		<EditorInput fieldName={"Difficulty"} cVal={$state.projects.data.difficulty} />
		<EditorInput fieldName={"Link"} cVal={$state.projects.data.link} />
		<!-- "isRelative": true
		"project Image": "./img/projs/Minesweeper.png"
		"Organization Image": "" (Personal) -->
		<div id="editorjs"></div>
		<button id="save" on:click="{save}">Save Content</button>
	</div>
	<div class:hide = "{$state.projects.oProj != ""}">
		<div class="welcome-msg">Select an Project to get started</div>
	</div>
	<div class="save-modal{showSave ? '' : ' hide-modal'}">
		<div class="modal">
			<div class="modal-msg">
				<p>You have not saved the current changes. Do you want to save before exiting?</p>
			</div>
			<div class="modal-btns">
				<button id="saveBtn" class="modal-btn" on:click|stopPropagation="{save}">Save</button>
				<button class="modal-btn" on:click|stopPropagation="{() => { showSave = false; }}">Cancel</button>
			</div>
		</div>
	</div>
</div>

<!-- svelte-ignore css-unused-selector -->
<style>
	@import "/theme.css";

	#editor {
		width: calc(100% - 272px - 2em - 40px);
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

	#editor > .save-modal {
		z-index: 10;
		position: absolute;

		top: 0;
		left: 0;

		width: 100%;
		height: 100%;

		background-color: rgba(0, 0, 0, 0.7);

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	#editor > .save-modal > .modal {
		width: 300px;

		background-color: var(--foreground);
		border-radius: 8px;
		border: 1px solid black;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}
	#editor > .save-modal > .modal > .modal-msg {
		margin: 10px;
		width: calc(100% - 20px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 18px;
	}
	#editor > .save-modal > .modal > .modal-msg > p { margin: 0px; }
	#editor > .save-modal > .modal > .modal-btns {
		margin: 10px;

		width: 100%;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}
	#editor > .save-modal > .modal > .modal-btns > .modal-btn {
		height: 24px;
		min-width: 40px;

		cursor: pointer;
		color: var(--font-color);
		background-color: var(--foreground);

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		border-radius: 2px;
		border: 1px solid black;
	}
	#editor > .save-modal > .modal > .modal-btns > .modal-btn:hover { background-color: var(--hover); }
	#editor > .save-modal > .modal > .modal-btns > #saveBtn:hover { background-color: var(--highlight-hover);}

	#editor > .hide-modal { display: none; }
	#editor > .hide { display: none; }

	#editor > div {
		width: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: var(--font-color);

		position: relative;
	}

	#editor > div > #editorjs {
		width: calc(100% - 100px);
		padding: 7px 50px;
		background-color:  transparent;
	}
	:global(.codex-editor) {
		width: 100%;
	}
	:global(.codex-editor__redactor) {
		padding-bottom: 60px !important;
	}
	:global(.ce-block__content) {
		max-width: calc(100% - 20px);
		background-color: transparent;
	}

	:global(.ce-block a) {
		color: #58a6ff;
	}
	:global(::selection) {
		background-color: #1982d582;
	}

	:global(.ce-toolbar__content) {
		max-width: calc(100% - 20px);
	}

	:global(.cdx-block) {
		background-color: transparent;
	}
	:global(.cdx-button) {
		background-color: var(--foreground);
	}
	
	:global(.cdx-settings-button) {
		background-color: transparent;
	}
	:global(.cdx-settings-button:hover) {
		background-color: var(--hover) !important;
	}
	:global(.cdx-settings-button--active) {
		background-color: var(--hover) !important;
	}
	
	:global(.ce-toolbar__settings-btn) {
		color: var(--font-color) !important;
		background-color: transparent !important;
		box-shadow: -3px 2px 8px 2px black;
		background: transparent !important;
	}
	:global(.ce-toolbar__settings-btn:hover) {
		background-color: var(--hover) !important;
		box-shadow: -3px 2px 8px 2px black;
		background: var(--hover) !important;
	}
	:global(.ce-toolbar__settings-btn:active) {
		background-color: var(--hover) !important;
		box-shadow: -3px 2px 8px 2px black;
		background: var(--hover) !important;
	}
	:global(.ce-toolbar__plus) {
		color: var(--font-color);
		background-color: transparent !important;
		background: transparent !important;
	}
	:global(.ce-toolbar__plus:hover) {
		background-color: var(--hover) !important;
		background: var(--hover) !important;
	}
	:global(.ce-toolbox__button) {
		color: var(--font-color);
		background-color: transparent !important;
		background: transparent !important;
	}
	:global(.ce-toolbox__button:hover) {
		background-color: var(--hover) !important;
		background: var(--hover) !important;
	}
	:global(.codex-editor--narrow .ce-toolbox) {
		background-color: transparent !important;
	}
	:global(.ce-settings) {
		color: var(--font-color) !important;
		background-color: transparent !important;
		box-shadow: -3px 2px 8px 2px black;
		background: transparent !important;
		border: 1px solid var(--foreground);
	}
	:global(.ce-settings__button) {
		color: var(--font-color) !important;
		background-color: transparent !important;
		background: transparent !important;
	}
	:global(.ce-settings__button:hover) {
		color: var(--font-color) !important;
		background-color: var(--hover) !important;
		background: var(--hover) !important;
	}
	:global(.cdx-settings-button) {
		color: var(--font-color) !important;
		background-color: transparent !important;
		background: transparent !important;
	}
	:global(.cdx-settings-button:hover) {
		color: var(--font-color) !important;
		background-color: var(--hover) !important;
		background: var(--hover) !important;
	}
	:global(.ce-settings__button--confirm) {
		background-color: var(--warning-red) !important;
	}
	:global(.ce-settings__default-zone) {
		color: var(--font-color) !important;
		background-color: transparent !important;
	}
	:global(.ce-code__textarea) {
		color: var(--font-color) !important;
		background-color: rgb(20, 18, 44);
		background: rgb(20, 18, 44);
		border: 1px solid black;
	}
	:global(.link-tool__input) {
		background-image: url("data:image/svg+xml,%3Csvg width='13' height='14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.567 13.629c.728.464 1.581.65 2.41.558l-.873.873A3.722 3.722 0 1 1 4.84 9.794L6.694 7.94a3.722 3.722 0 0 1 5.256-.008L10.484 9.4a5.209 5.209 0 0 1-.017.016 1.625 1.625 0 0 0-2.29.009l-1.854 1.854a1.626 1.626 0 0 0 2.244 2.35zm2.766-7.358a3.722 3.722 0 0 0-2.41-.558l.873-.873a3.722 3.722 0 1 1 5.264 5.266l-1.854 1.854a3.722 3.722 0 0 1-5.256.008L9.416 10.5a5.2 5.2 0 0 1 .017-.016 1.625 1.625 0 0 0 2.29-.009l1.854-1.854a1.626 1.626 0 0 0-2.244-2.35z' fill='rgba(231, 231, 231)' transform='translate(-3.667 -2.7)'/%3E%3C/svg%3E%0A");
	}
	:global(.ce-inline-toolbar) {
		color: var(--font-color) !important;
		background-color: transparent;
		background: transparent;
		box-shadow: -3px 2px 8px 2px black;
		border: 1px solid var(--foreground);
	}
	:global(.ce-inline-toolbar__buttons > button > svg) {
		fill: var(--font-color) !important;
	}
	:global(.ce-inline-toolbar__buttons > button:hover) {
		background-color: var(--hover) !important;
		background: var(--hover) !important;
	}
	:global(.ce-inline-toolbar__dropdown) {
		margin: 0px;
	}
	:global(.ce-inline-toolbar__dropdown:hover) {
		background-color: var(--hover) !important;
		background: var(--hover) !important;
	}
	:global(.ce-conversion-toolbar) {
		color: var(--font-color) !important;
		background-color: var(--foreground) !important;
		box-shadow: -3px 2px 8px 2px black;
		border: 1px solid var(--foreground);
	}
	:global(.ce-inline-toolbar__toggler-and-button-wrapper) {
		color: var(--font-color) !important;
		background-color: var(--foreground) !important;
		box-shadow: -3px 2px 8px 2px black;
		border: 1px solid var(--foreground);
		padding: 0px;
	}
	:global(.ce-conversion-tool:hover) {
		background-color: var(--hover) !important;
		background: var(--hover) !important;
	}
	:global(.ce-conversion-tool > .ce-conversion-tool__icon > svg) {
		fill: var(--font-color) !important;
	}
	:global(.ce-conversion-tool__icon) {
		background-color: transparent !important;
		background: transparent !important;
		border: 1px solid var(--foreground);
	}
	:global(.ce-conversion-toolbar__label) {
		color: var(--font-color) !important;
	}

	#editor > div > .welcome-msg { color: var(--font-color); font-size: 30px; }
</style>