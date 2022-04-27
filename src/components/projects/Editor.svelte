<script>
	import EditorJs from '@editorjs/editorjs';
	import Header from '@editorjs/header';
	import Code from '@editorjs/code';
	import List from '../../libs/nestedList';
	import Delimiter from '@editorjs/delimiter';
	import Paragraph from '@editorjs/paragraph';
	import Embed from '@editorjs/embed';
	import ImageTool from '../../libs/imagePlugin';
	
	import { onMount } from 'svelte';
	import { state, jSwitchProj, config } from '../../store';

	let editor;
	let saved = true;
	let showSave = false;
	let wasProgramatic = false;

	onMount(() => {
		editor = new EditorJs({
			holder : 'editorjs',
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
								const uploadRes = await window.api.invoke("uploadFile", file.path);
								return JSON.parse(uploadRes);
							},
							uploadByUrl: async (url) => { const uploadRes = await window.api.invoke("uploadUrl", url); return JSON.parse(uploadRes); }
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
					$state.projects.data = content;
				} else {
					wasProgramatic = false;
				}
			},
			data: $state.projects.data
		});
	});

	$: {
		renderNewContent($state.projects.data);
	}

	const renderNewContent = (data) => {
		if (editor && $jSwitchProj) {
			wasProgramatic = true;
			$jSwitchProj = false;
			if (data.time && data.blocks?.length > 0 && data.version) {
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

	async function save() {
		const content = await getEditorContent();
		const cfg = $config;

		cfg.projects[$state.projects.cat][$state.projects.key].content = content;
		cfg.projects[$state.projects.cat][$state.projects.key].description = content.blocks[1].data.text;

		window.api.send("writeConfig", JSON.stringify(cfg));

		$config = cfg;
		saved = true;
	}
</script>

<div id="editor">
	<div class:active = "{$state.projects.oProj != ""}" style="overflow: scroll; min-height: 100%;">
		<h1>Editing: {$state.projects.oProj}</h1>
		<div id="editorjs"></div>
		<button id="save" on:click="{save}">Save Content</button>
	</div>
	<div class:active = "{$state.projects.oProj == ""}">
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
<style lang="scss">
	$font-color: rgb(231, 231, 231);
	$grey-primary: #252525;
    $grey-primary__hover: #3a3a3a;
    $grey-primary__hover-2: #303030;
	$grey-secondary: #383838;
	$grey-secondary__hover: rgb(71, 71, 71);
    $grey-black: #1a1a1a;
	$bud-green: #82b74bff;
    $bud-green__hover: rgb(138, 194, 78);
    $warning-red: #e24a4a;

	#editor {
		width: calc(100% - 272px - 2em - 40px);
		margin: 0px 20px;
		height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: $font-color;

		position: relative;

		div {
			width: 100%;

			display: flex;
			flex-direction: column;
			align-items: center;

			color: $font-color;

			position: relative;

			#editorjs {
				width: calc(100% - 100px);
				padding: 7px 50px;
				background-color:  transparent;

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
					background-color: $grey-primary;
				}
				// Block Settings elements
				:global(.cdx-settings-button) {
					background-color: transparent;
				}
				:global(.cdx-settings-button:hover) {
					background-color: $grey-secondary__hover !important;
				}
				:global(.cdx-settings-button--active) {
					background-color: $grey-secondary__hover !important;
				}
				// Block Settings elements
				:global(.ce-toolbar__settings-btn) {
					color: $font-color !important;
					background-color: transparent !important;
					box-shadow: -3px 2px 8px 2px black;
					background: transparent !important;
				}
				:global(.ce-toolbar__settings-btn:hover) {
					background-color: $grey-secondary__hover !important;
					box-shadow: -3px 2px 8px 2px black;
					background: $grey-secondary__hover !important;
				}
				:global(.ce-toolbar__settings-btn:active) {
					background-color: $grey-secondary__hover !important;
					box-shadow: -3px 2px 8px 2px black;
					background: $grey-secondary__hover !important;
				}
				:global(.ce-toolbar__plus) {
					color: $font-color;
					background-color: transparent !important;
					background: transparent !important;
				}
				:global(.ce-toolbar__plus:hover) {
					background-color: $grey-secondary__hover !important;
					background: $grey-secondary__hover !important;
				}
				:global(.ce-toolbox__button) {
					color: $font-color;
					background-color: transparent !important;
					background: transparent !important;
				}
				:global(.ce-toolbox__button:hover) {
					background-color: $grey-secondary__hover !important;
					background: $grey-secondary__hover !important;
				}
				:global(.codex-editor--narrow .ce-toolbox) {
					background-color: transparent !important;
				}
				:global(.ce-settings) {
					color: $font-color !important;
					background-color: transparent !important;
					box-shadow: -3px 2px 8px 2px black;
					background: transparent !important;
					border: 1px solid $grey-primary;
				}
				:global(.ce-settings__button) {
					color: $font-color !important;
					background-color: transparent !important;
					background: transparent !important;
				}
				:global(.ce-settings__button:hover) {
					color: $font-color !important;
					background-color: $grey-secondary__hover !important;
					background: $grey-secondary__hover !important;
				}
				:global(.cdx-settings-button) {
					color: $font-color !important;
					background-color: transparent !important;
					background: transparent !important;
				}
				:global(.cdx-settings-button:hover) {
					color: $font-color !important;
					background-color: $grey-secondary__hover !important;
					background: $grey-secondary__hover !important;
				}
				:global(.ce-settings__button--confirm) {
					background-color: $warning-red !important;
				}
				:global(.ce-settings__default-zone) {
					color: $font-color !important;
					background-color: transparent !important;
				}
				:global(.ce-code__textarea) {
					color: $font-color !important;
					background-color: rgb(20, 18, 44);
					background: rgb(20, 18, 44);
					border: 1px solid black;
				}
				:global(.link-tool__input) {
					background-image: url("data:image/svg+xml,%3Csvg width='13' height='14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.567 13.629c.728.464 1.581.65 2.41.558l-.873.873A3.722 3.722 0 1 1 4.84 9.794L6.694 7.94a3.722 3.722 0 0 1 5.256-.008L10.484 9.4a5.209 5.209 0 0 1-.017.016 1.625 1.625 0 0 0-2.29.009l-1.854 1.854a1.626 1.626 0 0 0 2.244 2.35zm2.766-7.358a3.722 3.722 0 0 0-2.41-.558l.873-.873a3.722 3.722 0 1 1 5.264 5.266l-1.854 1.854a3.722 3.722 0 0 1-5.256.008L9.416 10.5a5.2 5.2 0 0 1 .017-.016 1.625 1.625 0 0 0 2.29-.009l1.854-1.854a1.626 1.626 0 0 0-2.244-2.35z' fill='rgba(231, 231, 231)' transform='translate(-3.667 -2.7)'/%3E%3C/svg%3E%0A");
				}
				:global(.ce-inline-toolbar) {
					color: $font-color !important;
					background-color: transparent;
					background: transparent;
					box-shadow: -3px 2px 8px 2px black;
					border: 1px solid $grey-primary;
				}
				:global(.ce-inline-toolbar__buttons > button > svg) {
					fill: $font-color !important;
				}
				:global(.ce-inline-toolbar__buttons > button:hover) {
					background-color: $grey-secondary__hover !important;
					background: $grey-secondary__hover !important;
				}
				:global(.ce-inline-toolbar__dropdown) {
					margin: 0px;
				}
				:global(.ce-inline-toolbar__dropdown:hover) {
					background-color: $grey-secondary__hover !important;
					background: $grey-secondary__hover !important;
				}
				:global(.ce-conversion-toolbar) {
					color: $font-color !important;
					background-color: $grey-primary !important;
					box-shadow: -3px 2px 8px 2px black;
					border: 1px solid $grey-primary;
				}
				:global(.ce-inline-toolbar__toggler-and-button-wrapper) {
					color: $font-color !important;
					background-color: $grey-primary !important;
					box-shadow: -3px 2px 8px 2px black;
					border: 1px solid $grey-primary;
					padding: 0px;
				}
				:global(.ce-conversion-tool:hover) {
					background-color: $grey-secondary__hover !important;
					background: $grey-secondary__hover !important;
				}
				:global(.ce-conversion-tool > .ce-conversion-tool__icon > svg) {
					fill: $font-color !important;
				}
				:global(.ce-conversion-tool__icon) {
					background-color: transparent !important;
					background: transparent !important;
					border: 1px solid $grey-primary;
				}
				:global(.ce-conversion-toolbar__label) {
					color: $font-color !important;
				}
			}

			.welcome-msg {
				color: $font-color;
				font-size: 30px;
			}
		}

		#save {
			font-family: 'Source Sans Pro', sans-serif;
			font-size: 16px;
			color: $font-color;
			background-color: $grey-secondary;
			padding: 4px;
			border: 1px solid #000;
			box-shadow: 0 0 4px rgb(0 0 0 / 50%);
			border-radius: 3px;

			
			&:hover {
				cursor: pointer;
				background-color: $grey-secondary__hover;
			}
			&:focus {
				outline: 1px solid $bud-green;
			}
		}

		.save-modal {
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

			.modal {
				width: 300px;

				background-color: $grey-secondary;
				border-radius: 8px;
				border: 1px solid black;

				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;

				.modal-msg {
					margin: 10px;
					width: calc(100% - 20px);
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					text-align: center;
					font-size: 18px;

					p {
						margin: 0px;
					}
				}

				.modal-btns {
					margin: 10px;

					width: 100%;

					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-around;

					.modal-btn {
						height: 24px;
						min-width: 40px;

						cursor: pointer;
						color: $font-color;
						background-color: $grey-primary;

						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						border-radius: 2px;
						border: 1px solid black;

						&:hover { background-color: $grey-primary__hover; }
					}
					#saveBtn:hover { background-color: $bud-green__hover;}
				}
			}
		}

		.hide-modal { display: none; }

		.active { display: none; }
	}
</style>