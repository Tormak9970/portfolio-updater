<script lang="ts">
    import { config, showCrtArtModal, state } from "../../stores";
    import { writeConfig } from "../../Utils";
    import CImageInput from "../universal/create/CImageInput.svelte";
    import CTextArea from "../universal/create/CTextArea.svelte";
    import CTextInput from "../universal/create/CTextInput.svelte";

    let name:string;
    let img:string;
    let desc:string;

    async function close(e:Event) {
        $showCrtArtModal = false;
    }

    function validateFields(): boolean {
        return name !== "" &&
            img !== "" &&
            desc !== "";
    }

    async function saveNew(e:Event) {
        if (validateFields()) {
            const newPiece = {
                "name": name,
				"img": img,
				"description": desc
            }

            const cfg = $config;
            const key = name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "");

            // @ts-ignore
            cfg.art[key] = newPiece;

            $config = cfg;
            await writeConfig(JSON.stringify(cfg));

            $state.art = {
                "oArt": name,
                "key": key,
                "data": {
                    "name": name,
                    "img": img,
                    "description": desc
                }
            }

            $showCrtArtModal = false;
        }
    }
</script>

<div class="backdrop" on:click="{close}">
    <div class="modal" on:click|stopPropagation="{() => {}}">
        <div class="content">
            <h2>Create a New Art Piece</h2>
            <div class="input-wrapper">
                <div class="sub">
                    <CTextInput fieldName="Name" cVal="something new" bind:value={name}/>

                    <CImageInput fieldName="Image" cVal="" bind:value={img}/>
                </div>

                <CTextArea fieldName="Description" cVal={""} bind:value={desc}/>
            </div>

            <div class="btns-cont">
                <div class="btn" on:click="{saveNew}">Create</div>
            </div>
        </div>
    </div>
</div>

<style>
    @import '/theme.css';

    .backdrop {
        z-index: 10;

        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        padding: 14px;
        max-width: 70vw;
        border-radius: 8px;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: var(--background);
        border: 1px solid var(--highlight);
        
        overflow: hidden;

        box-shadow: -2px 2px 8px 1px #000;
    }

    .input-wrapper {
        width: auto;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .sub {
        width: 100%;
    }

    .content {
        max-height: 50vh;
        overflow: auto;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .btns-cont {
        margin-top: 20px;
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .btn {
        padding: 6px 20px;
        border-radius: 8px;
        border: 1px solid var(--highlight);

        background-color: var(--foreground);
    }
    .btn:hover { background-color: var(--hover); cursor: pointer; }
    .btn:focus { background-color: var(--highlight); }
</style>
