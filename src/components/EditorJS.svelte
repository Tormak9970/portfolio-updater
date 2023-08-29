<script lang="ts">
	import type { OutputData } from "@editorjs/editorjs";
	import Header from "@editorjs/header";
	import Code from "@editorjs/code";
	import List from "@editorjs/nested-list";
	import ImageTool from "@editorjs/image";
	import Delimiter from "@editorjs/delimiter";
	import Paragraph from "@editorjs/paragraph";
	import Embed from "@editorjs/embed";

  import { createEditor } from 'svelte-editorjs';

	import { path, tauri } from "@tauri-apps/api";
  import { addPathToScope, configPath, uploadFile, uploadUrl } from "../lib/Utils";

  export let onChange: (content: OutputData) => Promise<void> = async () => {};
  export let content: OutputData;

  let hasReadiedOnce = false;

  const { editor, data: editorData, isReady } = createEditor({
    // @ts-ignore
    logLevel: "ERROR",
    tools: {
      header: { class: Header, inlineToolbar: true },
      code: { class: Code, inlineToolbar: true },
      image: {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile: async (file: File) => {
              const uploadRes = await uploadFile(
                file.name,
                await file.arrayBuffer()
              );
              return JSON.parse(uploadRes);
            },
            uploadByUrl: async (url) => {
              const uploadRes = await uploadUrl(url);
              return JSON.parse(uploadRes);
            },
          },
        },
      },
      list: { class: List, inlineToolbar: true },
      delimiter: { class: Delimiter, inlineToolbar: true },
      paragraph: { class: Paragraph, inlineToolbar: true },
      embed: { class: Embed, inlineToolbar: true },
    },
    onChange: () => {
      $editor.save();
      content = cleanEditorContent($editorData);
      onChange(content);
    }
  });

  $: if ($isReady && !hasReadiedOnce) {
    hasReadiedOnce = true;
    if (content.blocks) {
      convertToTauri(content).then((parsedContent) => {
        $editor.render(parsedContent);
      });
    }
  }

	async function convertToTauri(data: any) {
		if (data) {
			await Promise.all(
				data.blocks.map(async (block: any) => {
					if (block.type == "image" && block.data.file.url.indexOf("./") == 0) {
						block.data.file.webUrl = block.data.file.url;

            const targetPath = await path.join(await path.dirname(configPath), block.data.file.url);
            
            await addPathToScope(targetPath);
            
						block.data.file.url = tauri.convertFileSrc(targetPath);
					}

					return block;
				})
			);
		}

		return data;
	}

	function convertToWeb(data: OutputData) {
		data.blocks = data.blocks.map((block) => {
			if (block.type == "image") {
				if (block.data.file.webUrl) {
					block.data.file.url = block.data.file.webUrl;
					delete block.data.file.webUrl;
				}
			}

			return block;
		});

		return data;
	}

	function cleanEditorContent(outputData: OutputData) {
		const content = convertToWeb(outputData);
		const contentStr = JSON.stringify(content);

		return JSON.parse(
			contentStr.replaceAll(
				`<a href`,
				`<a target=\\"_blank\\" rel=\\"noreferrer noopener\\" href`
			)
		);
	}
</script>

<div class="editorjs-container">
	<div use:editor />
</div>

<!-- svelte-ignore css-unused-selector -->
<style>
	.editorjs-container {
		margin: 0px 20px;
		padding-bottom: 7px;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: var(--font-color);

		position: relative;
	}
	.editorjs-container > div {
		width: 100%;
		background-color: transparent;
	}

	:global(.codex-editor) {
		width: 100%;
	}
	:global(.codex-editor__redactor) {
		padding-bottom: 60px !important;
	}
	/* :global(.ce-block__content) {
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

	:global(.cdx-settings-button) { background-color: transparent; }
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
	:global(.ce-settings.ce-settings--opened) {
		background-color: var(--foreground) !important;
	}
	:global(.ce-block--selected .ce-block__content) {
		background-color: var(--selection-color) !important;
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

	:global(.ce-popover) {
		color: var(--font-color);
		background-color: var(--foreground);
		border: 1px solid black;
		box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.85);
	}
	:global(.cdx-search-field) {
		color: var(--font-color);
		fill: var(--font-color);
		background-color: var(--foreground);
		border: 1px solid black;
	}
	:global(.cdx-search-field__icon .icon) {
		color: var(--font-color);
	}
	:global(.cdx-search-field__input) {
		color: var(--font-color);
	}

	:global(.ce-popover__item:hover) {
		background-color: var(--hover);
	}
	:global(.ce-popover__item-icon) {
		background-color: var(--hover);
		border: 1px solid black;
	} */
</style>
