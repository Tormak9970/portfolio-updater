<script lang="ts">
    import { ipcRenderer } from "electron";

    let status:boolean = true;

    function minimizeWindow() { ipcRenderer.send('minimizeWindow'); }

    function minMaxWindow(e: Event) {
        const elem:HTMLDivElement = <HTMLDivElement>e.currentTarget;

        if (status) {
            ipcRenderer.send('restoreWindow');
            elem.innerHTML = `
                <svg width="10" height="10" viewbox="0 0 10 10">
                    <path d="m10-1.667e-6v10h-10v-10zm-1.001 1.001h-7.998v7.998h7.998z" strokeWidth=".25" style="stroke: rgb(231, 231, 231);"/>
                </svg>
            `;
        } else {
            ipcRenderer.send('maximizeWindow');
            elem.innerHTML = `
            <svg width="11" height="11" viewBox="0 0 11 11">
                <path d="m11 8.7978h -2.2021v 2.2022h -8.7979v -8.7978h 2.2021v -2.2022h 8.7979z m-3.2979 -5.5h -6.6012v 6.6011h 6.6012z m2.1968 -2.1968h -6.6012v 1.1011h 5.5v 5.5h 1.1011z" stroke-width=".275" style="fill: rgb(231, 231, 231);"/>
            </svg>
            `;
        }
        status = !status;
    }

    function closeWindow() { ipcRenderer.send('closeWindow'); }

    export let winName:string;
</script>

<div id="bar">
	<div class="window-header">
        <img src="./img/Logo.ico" alt="favicon" class="window-img">
        <div class="window-name">{winName}</div>
        <div class="window-btns-wrapper">
            <div class="title-btn" on:click|stopPropagation="{minimizeWindow}">
                <svg width="11" height="2" viewBox="0 0 11 2">
                    <path d="m11 0v1h-11v-1z" stroke-width=".26208" style="stroke: rgb(231, 231, 231);"/>
                </svg>
            </div>
            <div class="title-btn" on:click="{minMaxWindow}">
                <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="m10-1.667e-6v10h-10v-10zm-1.001 1.001h-7.998v7.998h7.998z" stroke-width=".25" style="stroke: rgb(231, 231, 231);"/>
                </svg>
            </div>
            <div class="title-btn close-win-btn"on:click|stopPropagation="{closeWindow}">
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src="./img/CloseWindow.png" height="20">
            </div>
        </div>
    </div>
</div>

<style lang="scss">
	$grey-primary: #252525;
	$grey-secondary: #383838;
	$grey-secondary__hover: rgb(71, 71, 71);
	$font-color: rgb(231, 231, 231);
	$bud-green: #82b74bff;
    $bud-green__hover: rgb(138, 194, 78);

	#bar {
		position: relative;
        z-index: 100;
        
        width: 100%;
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        background-color: #1a1a1a;
        color: white;
        font-family: 'Eurofont';
        font-size: 12px;
        font-weight: lighter;
        -webkit-app-region: drag;

        .window-img {
            padding: 0px 7.5px
        }

        .window-name {
            /* any styles for window title go here */
            color: white;
        }

        .window-btns-wrapper {
            height: 100%;
            width: auto;
            margin-left: auto;
            display: flex;
            flex-direction: row;
            align-items: center;

            .title-btn {
                height: 100%;
                width: 40px;
                color: white;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                -webkit-app-region: no-drag;
            }

            .title-btn:hover {
                background-color: #353535;
                cursor: pointer;
            }

            .close-win-btn {
                font-size: 18px;
            }

            .close-win-btn:hover {
                background-color: red;
            }
        }
	}
</style>