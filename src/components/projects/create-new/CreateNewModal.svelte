<script lang="ts">
    import { showCreateNewModal } from "../../../stores";

    async function close(e:Event) {
        $showCreateNewModal = false;
    }
</script>

{#if $showCreateNewModal}
    <div class="backdrop">
        <div class="modal" on:click|stopPropagation="{close}">
            <div class="content">
                

                <div class="btns-cont">
                    <div class="btn" on:click="{close}">Main Menu</div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    @import '../../themes.css';

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
