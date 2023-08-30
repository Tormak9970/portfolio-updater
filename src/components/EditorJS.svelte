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
					if (block.type === "image") {
            if (block.data.file.url.indexOf("./") === 0) {
              block.data.file.webUrl = block.data.file.url;

              const targetPath = await path.join(await path.dirname(configPath), block.data.file.url);
              
              await addPathToScope(targetPath);
              console.log(`added ${targetPath} to scope.`)
              
              block.data.file.url = tauri.convertFileSrc(targetPath);
            } else {
              const targetPath = await path.join(await path.dirname(configPath), block.data.file.webUrl);
                
              await addPathToScope(targetPath);
            }

            return block;
          }
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
		margin: 0px;
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

  :global(::selection) {
    background-color: #4f6e85;
  }

	:global(.codex-editor) {
		width: 100%;
	}
	:global(.codex-editor__redactor) {
		padding-bottom: 60px !important;
	}
	
  :global(.ce-toolbar__settings-btn) {
    border-radius: 4px;
    background-color: var(--foreground);
    color: var(--font-color);
    transition: background-color 0.2s ease-in-out;
  }
  :global(.ce-toolbar__settings-btn:hover) {
    background-color: var(--foreground-hover);
    color: var(--font-color);
  }

  :global(.ce-block--selected .ce-block__content) {
    background: #4f6e85;
  }

  :global(.ce-toolbar__plus, .ce-toolbox__button) {
    color: var(--font-color);
  }
  :global(.ce-toolbar__plus--active, .ce-toolbar__plus:hover) {
    color: var(--srcery-bright-blue);
  }
  :global(.ce-toolbox__button--active) {
    color: var(--srcery-bright-blue);
  }

  :global(.ce-settings) {
    background-color: var(--foreground);
    border: 1px solid transparent;
  }
  :global(.ce-settings__button) {
    color: var(--font-color);
  }
  :global(.ce-settings__button:hover) {
    background-color: var(--foreground-hover);
  }
  :global(.cdx-settings-button) {
    color: var(--font-color);
  }
  :global(.cdx-settings-button--active) {
    color: var(--srcery-bright-blue);
  }
  :global(.cdx-settings-button:hover) {
    background-color: var(--foreground-hover);
  }

  :global(.ce-conversion-toolbar) {
    background-color: var(--foreground);
    border: 1px solid transparent;
  }

  :global(.ce-inline-toolbar) {
    background-color: var(--foreground);
    border: 1px solid transparent;
  }

  :global(.ce-inline-toolbar__dropdown:hover) {
    background-color: var(--foreground-hover);
  }
  :global(.ce-conversion-toolbar__label) {
    color: var(--font-color);
  }

  :global(.ce-conversion-tool:hover) {
    background-color: var(--foreground-hover);
  }

  :global(.ce-conversion-tool__icon) {
    background-color: var(--foreground-light);
    border: 1px solid transparent;
  }

  :global(.ce-inline-tool) {
    color: var(--font-color);
  }
  :global(.ce-inline-tool:hover) {
    background-color: var(--foreground-hover);
  }

  :global(.ce-inline-tool-input) {
    background-color: var(--foreground);
    color: var(--font-color);
  }

  :global(.ct:before, .ct:after) {
    background-color: var(--foreground-light);
  }
  :global(.ct__content) {
    color: var(--font-color);
  }
</style>
