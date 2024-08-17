<script lang="ts">
  import { LogLevels, type OutputData } from "@editorjs/editorjs";
  import Embed from "@editorjs/embed";
  import Header from "@editorjs/header";
  import ImageTool from "@editorjs/image";
  import List from "@editorjs/nested-list";
  import Paragraph from "@editorjs/paragraph";
  import { path, tauri } from "@tauri-apps/api";
  
  import "./editor.css";

  import { createEditor, scrollShadow } from "@directives";
  import { configPath, uploadFile, uploadUrl } from "@utils";

  export let onChange: (content: OutputData) => Promise<void> = async () => {};
  export let content: OutputData;

  let hasReadiedOnce = false;

  const { editor, editorStore, data: editorData, isReady } = createEditor({
    logLevel: LogLevels.WARN,
    tools: {
      header: {
        // @ts-expect-error The type is correct
        class: Header,
        inlineToolbar: true
      },
      image: {
        // @ts-expect-error The type is correct
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile: async (file: File) => {
              const uploadRes = await uploadFile(file.name, await file.arrayBuffer());
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
      $editorStore.save();
      content = cleanEditorContent($editorData);
      onChange(content);
    }
  });

  $: if ($isReady && !hasReadiedOnce) {
    hasReadiedOnce = true;
    if (content.blocks) {
      convertToTauri(content).then((parsedContent) => {
        $editorStore.render(parsedContent);
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

<div class="editor-wrapper">
  <div class="scroll-wrapper styled-scrollbar" use:scrollShadow={{ background: "--m3-scheme-surface-container-lowest" }}>
    <div class="editorjs-container" use:editor>
    </div>
  </div>
</div>

<style>
  .editor-wrapper {
    width: 100%;
    height: calc(100% - 100px - 0.5rem);

    flex-grow: 1;
    
    overflow: hidden;
    position: relative;
    
    border-radius: 10px;
    background-color: rgb(var(--m3-scheme-surface-container-lowest));
  }

  .scroll-wrapper {
    width: 100%;
    height: 100%;

    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>
