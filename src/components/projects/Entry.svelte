<script>
    import { renderIdx } from "../../store";

	export let project;
	export let key;
    export let category;

    function setProject(e) {
        // $currentProj = { project: project, category: category, key: key }
        $renderIdx = 0;
    }
</script>

<div id="entry-{project.name}" class="entry">
    <div class="info">
        <div class="field">{project.name}</div>
        <div class="category">{category}</div>
    </div>
    <div class="btn-cont">
        <div class="btn" on:click="{setProject}">
            <div>{project.content.time ? "Edit" : "Create"}</div>
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

	.entry {
		width: 500px;
		height: 60px;

        background-color: $grey-secondary;
        color: $font-color;

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

        border-radius: 8px;

        margin-bottom: 7px;

        .info {
            margin-left: 7px;

            display: flex;
            flex-direction: column;
            justify-content: start;

            .field {
                font-size: 20px;
            }
            .category {
                font-size: 16px;
            }
        }
        .btn-cont {
            margin-right: 7px;

            .btn {
                height: 30px;
                width: 60px;

                cursor: pointer;
                background-color: $bud-green;

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                border-radius: 10px;

                &:hover { background-color: $bud-green__hover; }
            }
        }
	}
</style>