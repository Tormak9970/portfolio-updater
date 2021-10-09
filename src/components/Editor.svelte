<script lang="ts">
	import EditorJs from '@editorjs/editorjs';
	import Header from '@editorjs/header';
	import Code from '@editorjs/code';
	import Image from '@editorjs/image';
	import Link from '@editorjs/link';
	import List from '@editorjs/nested-list';
	import Delimiter from '@editorjs/delimiter';
	import Paragraph from '@editorjs/paragraph';
	import Embed from '@editorjs/embed';
	
	import { onMount } from 'svelte';
	import { renderIdx, config, currentProj } from '../store';

	let editor:EditorJs;
	let saved = true;
	let showSave = false;

	onMount(() => {
		editor = new EditorJs({
			holder : 'editorjs',
			tools: {
				header: { class: Header, inlineToolbar : true },
				code: { class: Code, inlineToolbar : true },
				image: {
					config: {
						uploader: {
							/**
							 * Upload file to the server and return an uploaded image data
							 * @param {File} file - file selected from the device or pasted by drag-n-drop
							 * @return {Promise.<{success, file: {url}}>}
							 */
							uploadByFile(file:File){
								return {
									success: 1,
									file: {
										url: `./img/projs/${file.name}`
									}
								}
							}
						}
					},
					class: Image,
					inlineToolbar : true
				},
				link: { class: Link, inlineToolbar : true },
				list: { class: List, inlineToolbar : true },
				delimiter: { class: Delimiter, inlineToolbar : true },
				paragraph: { class: Paragraph, inlineToolbar : true },
				embed: { class: Embed, inlineToolbar : true },
			},
			onChange: () => { if (saved) saved = false; },
			data: $currentProj.project.content
		});
	});

	async function getEditorContent() { return await editor.save().then((outputData) => { return outputData; }); }

	async function save(): Promise<void> {
		const content = await getEditorContent();
		const updatedConfig = $config;

		updatedConfig.projects[$currentProj.category][$currentProj.key].content = content;

		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(updatedConfig));
		const dynDwnld = document.getElementById('dynDwnld');
		dynDwnld.setAttribute("href", dataStr);
		dynDwnld.setAttribute("download", "config.json");
		dynDwnld.click();
		$config = updatedConfig;
		saved = true;
	}

	function quitHandler() { $renderIdx = 1; }
</script>

<div id="editor">
	<div class="back-arrow" on:click|stopPropagation="{() => { if (!saved) showSave = true; else quitHandler(); }}">
		<i class="fas fa-arrow-left"></i>
	</div>
	<h1>Editing: {$currentProj.project.name}</h1>
	<div id="editorjs"></div>
	<button id="save" on:click="{save}">Save Content</button>
	<div class="save-modal{showSave ? '' : ' hide-modal'}">
		<div class="modal">
			<div class="modal-msg">
				<p>You have not saved the current changes. Do you want to save before exiting?</p>
			</div>
			<div class="modal-btns">
				<button id="saveBtn" class="modal-btn" on:click|stopPropagation="{save}">Save</button>
				<button id="quitBtn" class="modal-btn" on:click|stopPropagation="{quitHandler}">Quit</button>
				<button class="modal-btn" on:click|stopPropagation="{() => { showSave = false; }}">Cancel</button>
			</div>
		</div>
	</div>

	<!-- svelte-ignore a11y-invalid-attribute -->
	<!-- svelte-ignore a11y-missing-content -->
	<a href="#" id="dynDwnld" style="display: none;"></a>
</div>

<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
	$grey-primary: #252525;
	$grey-primary__hover: rgb(51, 51, 51);
	$grey-secondary: #383838;
	$grey-secondary__hover: rgb(71, 71, 71);
	$font-color: rgb(231, 231, 231);
	$bud-green: #82b74bff;
    $bud-green__hover: rgb(138, 194, 78);
	$warning-red: #e24a4a;

	#editor {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: $font-color;

		position: relative;

		.back-arrow {
			position: absolute;
			top: 14px;
			left: 14px;

			.fa-arrow-left {
				color: $font-color;
				cursor: pointer;

				&:hover {
					color: $bud-green;
				}
			}
		}

		#editorjs {
			width: 650px;
			padding: 7px 50px;
			background-color:  $grey-secondary;

			:global(.cdx-block) {
				background-color: $grey-secondary;
			}
			:global(.cdx-button) {
				background-color: $grey-primary;
			}
			// Block Settings elements
			:global(.cdx-settings-button) {
				background-color: $grey-secondary;
			}
			:global(.cdx-settings-button--active) {
				background-color: $grey-secondary;
			}
			// Block Settings elements
			:global(.ce-toolbar__settings-btn) {
				color: $font-color !important;
				background-color: $grey-secondary !important;
				box-shadow: -3px 2px 8px 2px black;
				background: $grey-secondary !important;
			}
			:global(.ce-settings) {
				color: $font-color !important;
				background-color: $grey-secondary !important;
				box-shadow: -3px 2px 8px 2px black;
				background: $grey-secondary !important;
				border: 1px solid $grey-primary;
			}
			:global(.ce-settings__button) {
				color: $font-color !important;
				background-color: $grey-secondary;
				background: $grey-secondary;
			}
			:global(.ce-settings__button:hover) {
				color: $font-color !important;
				background-color: $grey-secondary__hover;
				background: $grey-secondary__hover;
			}
			:global(.cdx-settings-button) {
				color: $font-color !important;
				background-color: $grey-secondary;
				background: $grey-secondary;
			}
			:global(.cdx-settings-button:hover) {
				color: $font-color !important;
				background-color: $grey-secondary__hover;
				background: $grey-secondary__hover;
			}
			:global(.ce-settings__button--confirm) {
				background-color: $warning-red !important;
			}
			:global(.ce-settings__default-zone) {
				color: $font-color;
				background-color: $grey-secondary;
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
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			
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
					#quitBtn:hover { background-color: $warning-red;}
				}
			}
		}

		.hide-modal { display: none; }
	}
</style>