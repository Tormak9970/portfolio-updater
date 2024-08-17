<script lang="ts">
  import type { OutputData } from "@editorjs/editorjs";
  import Embed from "@editorjs/embed";
  import Header from "@editorjs/header";
  import ImageTool from "@editorjs/image";
  import List from "@editorjs/nested-list";
  import Paragraph from "@editorjs/paragraph";
  import { path, tauri } from "@tauri-apps/api";

  import { createEditor } from 'svelte-editorjs';

  import { configPath, uploadFile, uploadUrl } from "@utils";

  export let onChange: (content: OutputData) => Promise<void> = async () => {};
  export let content: OutputData;

  let hasReadiedOnce = false;

  const { editor, data: editorData, isReady } = createEditor({
    // @ts-ignore
    logLevel: "ERROR",
    tools: {
      header: { class: Header, inlineToolbar: true },
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
            uploadByUrl: async (url: string) => {
              const uploadRes = await uploadUrl(url);
              return JSON.parse(uploadRes);
            },
          },
        },
      },
      list: { class: List, inlineToolbar: true },
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
					if (block.type === "image" && !block.data.file.url.startsWith("https://asset.localhost")) {
            const configPathDir = await path.dirname(configPath);
            const imagePath = await path.join(configPathDir, "images", "projects", block.data.file.url);
            const converted = tauri.convertFileSrc(imagePath);
            
            block.data.file.url = converted;
            
            return block;
          }
        })
			);
		}

		return data;
	}

	function convertToWeb(data: OutputData) {
		data.blocks = data.blocks.map((block) => {
			if (block.type == "image" && block.data.file.url.startsWith("https://asset.localhost")) {
        const lastSplitIdx = block.data.file.url.lastIndexOf("%5C");
        block.data.file.url = block.data.file.url.substring(lastSplitIdx + 3);
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
				`<a target=\\"_blank\\" rel=\\"noreferrer\\" href`
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
    width: 100%;
		margin: 0px;
		padding-bottom: 7px;

		display: flex;
		flex-direction: column;
		align-items: center;

		color: rgb(var(--m3-scheme-on-background));

		position: relative;
	}
	.editorjs-container > div {
		width: 100%;
		background-color: transparent;
	}

  :global(a) {
    color: rgb(var(--m3-scheme-primary));
    font-weight: bold;
    text-decoration: none;
  }
  :global(a:hover, a:visited) {
    color: rgb(var(--m3-scheme-on-primary-container));
    text-decoration: underline;
  }

  :global(::selection) {
    background-color: #4f6e85;
  }

	:global(.codex-editor) {
		width: 100%;
	}
	:global(.codex-editor__redactor) {
    width: calc(100% - 30px);
		padding-bottom: 60px !important;
    margin-right: 30px !important;
	}
	:global(.ce-block) {
    width: 100%
	}

  :global(.codex-editor--narrow .ce-toolbar__actions) {
    right: 2px;
  }

  :global(.codex-editor--narrow .ce-block--focused) {
    margin-right: 0;
    padding-right: 0;
  }
	
  :global(.ce-toolbar__settings-btn) {
    border-radius: 4px;
    background-color: rgb(var(--m3-scheme-surface-container-lowest));
    color: rgb(var(--m3-scheme-on-background));
    transition: background-color 0.2s ease-in-out;
  }
  :global(.ce-toolbar__settings-btn:hover) {
    background-color: rgb(var(--m3-scheme-surface-container-lowest) / 0.7);
    color: rgb(var(--m3-scheme-on-background));
  }

  :global(.ce-block--selected .ce-block__content) {
    background: #4f6e85;
  }


  :global(.codex-editor--narrow .ce-toolbox) {
    background-color: rgb(var(--m3-scheme-background));
    border-radius: 10px;
    overflow: hidden;
  }
  
  :global(.ce-toolbar__plus, .ce-toolbox__button) {
    color: rgb(var(--m3-scheme-on-background));
  }
  :global(.ce-toolbox--opened .ce-toolbox__button) {
    color: rgb(var(--m3-scheme-on-background));
    background-color: rgb(var(--m3-scheme-surface-container-lowest));
  }
  :global(.ce-toolbox__button:hover) {
    color: rgb(var(--m3-scheme-on-background));
    background-color: rgb(var(--m3-scheme-surface-container-low)) !important;
  }
  :global(.ce-toolbar__plus--active, .ce-toolbar__plus:hover) {
    color: rgb(var(--m3-scheme-primary));
  } 
  :global(.ce-toolbox__button.ce-toolbox__button--active) {
    color: rgb(var(--m3-scheme-primary));
    background-color: rgb(var(--m3-scheme-surface-container-low));
  }
  :global(.ce-toolbar__plus, .ce-toolbox__button.ce-toolbox__button--active) {
    color: rgb(var(--m3-scheme-primary));
  }

  :global(.ce-settings) {
    background-color: rgb(var(--m3-scheme-surface-container-lowest));
    border: 1px solid transparent;
  }
  :global(.ce-settings__button) {
    color: rgb(var(--m3-scheme-on-background));
  }
  :global(.ce-settings__button:hover) {
    background-color: rgb(var(--m3-scheme-surface-container-low));
  }
  :global(.cdx-settings-button) {
    color: rgb(var(--m3-scheme-on-background));
  }
  :global(.cdx-settings-button--active) {
    color: rgb(var(--m3-scheme-primary));
  }
  :global(.cdx-settings-button:hover) {
    background-color: rgb(var(--m3-scheme-surface-container-low));
  }

  :global(.ce-conversion-toolbar) {
    background-color: rgb(var(--m3-scheme-surface-container-lowest));
    border: 1px solid transparent;
  }

  :global(.ce-inline-toolbar) {
    background-color: rgb(var(--m3-scheme-surface-container-lowest));
    border: 1px solid transparent;
  }

  :global(.ce-inline-toolbar__dropdown:hover) {
    background-color: rgb(var(--m3-scheme-surface-container-low));
  }
  :global(.ce-conversion-toolbar__label) {
    color: rgb(var(--m3-scheme-on-background));
  }

  :global(.ce-conversion-tool:hover) {
    background-color: rgb(var(--m3-scheme-surface-container-low));
  }

  :global(.ce-conversion-tool__icon) {
    background-color: rgb(var(--m3-scheme-surface-container-highest));
    border: 1px solid transparent;
  }

  :global(.ce-inline-tool) {
    color: rgb(var(--m3-scheme-on-background));
  }
  :global(.ce-inline-tool:hover) {
    background-color: rgb(var(--m3-scheme-surface-container-low));
  }

  :global(.ce-inline-tool-input) {
    background-color: rgb(var(--m3-scheme-surface-container-lowest));
    color: rgb(var(--m3-scheme-on-background));
  }

  :global(.ct:before, .ct:after) {
    background-color: rgb(var(--m3-scheme-surface-container-highest));
  }
  :global(.ct__content) {
    color: rgb(var(--m3-scheme-on-background));
  }
</style>
