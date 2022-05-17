<script>
    import { renderIdx } from "../../stores";

	export let project;
	export let key;
    export let category;

    function setProject(e) {
        // $currentProj = { project: project, category: category, key: key }
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

<style>
	@import "/theme.css";

	.entry {
		height: 60px;

        background-color: var(--foreground);
        color: var(--font-color);

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

        border-radius: 8px;

        margin-bottom: 7px;
	}

    .entry > .info {
        margin-left: 7px;

        display: flex;
        flex-direction: column;
        justify-content: start;
    }
    .entry > .info > .field { font-size: 20px; }
    .entry > .info > .category { font-size: 16px; }

    .entry > .btn-cont { margin-right: 7px; }
    .entry > .btn-cont > .btn {
        height: 30px;
        width: 60px;

        cursor: pointer;
        background-color:var(--highlight);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        border-radius: 10px;
    }
    .entry > .btn-cont > .btn:hover { background-color: var(--highlight-hover); }
</style>