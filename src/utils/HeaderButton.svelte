<script>
    import {selCat} from "../store";

    export let category;

    function handleClick() {
        $selCat = category;
        window.api.send("updateSettings", ["selCat", category]);
    }
</script>

<div class="header-btn" class:selected={$selCat == category} on:click="{handleClick}">
    <div class="header-inner">{category}</div>
</div>

<style lang="scss">
	$grey-primary: #252525;
    $grey-primary__hover: #3a3a3a;
    $grey-primary__hover-2: #303030;
	$grey-secondary: #383838;
	$grey-secondary__hover: rgb(71, 71, 71);
    $grey-black: #1a1a1a;
	$slicers-yellow: #ffce00;
    $slicers-yellow__hover: #fbff29;
    $warning-red: #e24a4a;

    .header-btn {
        -webkit-app-region: no-drag;

        background-color: $grey-black;

        height: 100%;

        padding: 0px 5px;

        display: flex;
        align-items: center;

        &:hover {
            background-color: $grey-primary__hover;
            cursor: pointer;
        }
    }

    .selected {
        background-color: $grey-primary__hover;
    }
</style>