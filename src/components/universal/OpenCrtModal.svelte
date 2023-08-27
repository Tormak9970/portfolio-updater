<script lang="ts">
    import { showCrtArtModal, showCrtExpModal, showCrtOrgModal, showCrtProjModal } from "../../stores";

    export let modal:string;

    function showModal(e) {
        switch(modal) {
            case "proj":
                $showCrtProjModal = true;
                break;
            case "art":
                $showCrtArtModal = true;
                break;
            case "exp":
                $showCrtExpModal = true;
                break;
            case "org":
                $showCrtOrgModal = true;
                break;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="createNew" on:click="{showModal}">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"/>
    </svg>
</div>

<style>
	@import "/theme.css";

	#createNew {
		height: 60px;
        min-width: 300px;

        background-color: var(--foreground);
        color: var(--font-color);

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

        border-radius: 8px;

        margin-bottom: 7px;

        border: 1px dashed var(--highlight);
	}
    #createNew:hover {
		background-color: var(--hover);
        
        border-color: var(--highlight-hover);

        cursor: pointer;
	}

    svg {
        width: 30px;
        height: 30px;
    }
    path {
        fill: var(--font-color);
    }
</style>