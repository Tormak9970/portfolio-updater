<script>
    export let title;
    export let minimize;

    function minWin() {
        window.api.send('window', ['minimize', title]);
    }

    function closeWin() {
        window.api.send('window', ['close', title]);
    }

    let maxResWinBtn;

    function maxRes() {
        if (maxResWinBtn.classList.contains('is-max-mode')) {
            window.api.send('window', ['restore', title]);
            maxResWinBtn.innerHTML = `
                <svg width="10" height="10" viewbox="0 0 10 10">
                    <path d="m10-1.667e-6v10h-10v-10zm-1.001 1.001h-7.998v7.998h7.998z" strokeWidth=".25" style="stroke: white;"/>
                </svg>
            `;
        } else {
            window.api.send('window', ['maximize', title]);
            maxResWinBtn.innerHTML = `
            <svg width="11" height="11" viewBox="0 0 11 11">
                <path d="m11 8.7978h -2.2021v 2.2022h -8.7979v -8.7978h 2.2021v -2.2022h 8.7979z m-3.2979 -5.5h -6.6012v 6.6011h 6.6012z m2.1968 -2.1968h -6.6012v 1.1011h 5.5v 5.5h 1.1011z" stroke-width=".275" style="fill: white;"/>
            </svg>
            `;
        }
        maxResWinBtn.classList.toggle('is-max-mode');
    }
</script>

<div id="windowBar">
    <div class="window-header">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="./logo.ico" height="15" class="window-img"/>
        <div class="window-name">{title}</div>
        <div class="window-btns-wrapper">
            <div class="title-btn{minimize ? ' title-btn-disabled' : ''}" on:click="{minWin}">
                <svg width="11" height="2" viewbox="0 0 11 2">
                    <path d="m11 0v1h-11v-1z" strokeWidth=".26208" style="stroke: white;"/>
                </svg>
            </div>
            <div class="title-btn" bind:this="{maxResWinBtn}" on:click="{maxRes}">
                <svg width="10" height="10" viewbox="0 0 10 10">
                    <path d="m10-1.667e-6v10h-10v-10zm-1.001 1.001h-7.998v7.998h7.998z" strokeWidth=".25" style="stroke: white;"/>
                </svg>
            </div>
            <div class="title-btn close-win-btn" on:click="{closeWin}">
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src="./img/CloseWindow.png" height="20"/>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @font-face {
        font-family: Eurofont;
        src: url("./fonts/Hayward-SmBd.eot");
        src: url("./fonts/Hayward-SmBd.eot?#iefix") format("embedded-opentype"), url("./fonts/Hayward-SmBd.woff2") format("woff2"), url("./fonts/Hayward-SmBd.woff") format("woff"), url("./fonts/Hayward-SmBd.ttf") format("truetype");
        font-weight: normal;
    }

    $font-color: rgb(231, 231, 231);
    $grey-dark: #1a1a1a;
    $grey-dark-hover: #353535;
    $warning-red: #e24a4a;
    
    #windowBar {
        width: 100%;
        height: 30px;
        background-color: $grey-dark;
        color: $font-color;
        font-family: 'Eurofont';
        font-size: 12px;
        font-weight: lighter;
        -webkit-app-region: drag;

        .window-header {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            .window-img {
                padding: 0px 7.5px
            }

            .window-name { color: white; }

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
                    color: $font-color;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    -webkit-app-region: no-drag;

                    &:hover {
                        background-color: $grey-dark-hover;
                        cursor: pointer;
                    }
                }

                .close-win-btn {
                    font-size: 18px;

                    &:hover {
                        background-color: $warning-red;
                    }
                }
            }
        }
    }
</style>