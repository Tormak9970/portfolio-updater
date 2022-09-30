<script lang="ts">
    import { toast } from "@zerodevx/svelte-toast";
    import { writeConfig } from "../../Utils";
    import { config, state } from "../../stores";

    export let toastId:string;
    export let properties:string[];

    async function onConfirm() {
        delete $config[properties[0]][properties[1]];

        switch (properties[0]) {
            case "experience":
                $state[properties[0]] = {
                    "oExp": "",
                    "key": "",
                    "data": {
                        "company": "",
                        "img": "",
                        "position": "",
                        "description": ""
                    }
                }
                break;
            case "projects":
                $state[properties[0]] = {
                    "oProj": "",
                    "key": "",
                    "data": {
                        "category": "",
                        "name": "",
                        "time": "",
                        "status": "",
                        "difficulty": "",
                        "description": "",
                        "content": {},
                        "link": "",
                        "isRelative": false,
                        "img": "",
                        "org": ""
                    }
                }
                break;
            case "organizations":
                $state[properties[0]] = {
                    "oOrg": "",
                    "key": "",
                    "data": {
                        "name": "",
                        "img": "",
                        "about": "",
                        "description": "",
                        "projects": []
                    }
                }
                break;
            case "art":
                $state[properties[0]] = {
                    "oArt": "",
                    "key": "",
                    "data": {
                        "name": "",
                        "img": "",
                        "description": ""
                    }
                }
                break;
        }

        await writeConfig(JSON.stringify($config, null, '\t'));
    }

    const clicked = (canceled: boolean) => {
      toast.pop(toastId);
      toast.push({
        msg: canceled ? 'Canceled!' : 'Deleted!',
        theme: {
          '--toastBackground': canceled ? '#82b74b' : '#e24a4a',
          '--toastBarBackground': canceled ? '#405d27' : '#e13525'
        }
      });
      if (!canceled) onConfirm();
    }
    const canceled = () => clicked(true)
    const deleted = () => clicked(false)
</script>

<div id="confirmDelete">
    <div>Are you sure you want to delete this entry? You can't undo this action!</div>
    <div class="btn-cont">
        <div class="btn" on:click="{canceled}">
            <div>Cancel</div>
        </div>
        <div class="btn warn" on:click="{deleted}">
            <div>Delete</div>
        </div>
    </div>
</div>

<style>
    @import "/theme.css";
    
    #confirmDelete {
        width: 80%;
        padding: 10px;
        border-radius: 4px;

        background-color: var(--foreground);
        box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.85);

        display: flex;
        flex-direction: column;
        align-items: center;

        margin: 20px;
    }

    .btn-cont {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        margin-top: 14px;
    }

    .btn {
        height: 30px;
        width: 60px;

        cursor: pointer;
        background-color:var(--highlight);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        border-radius: 10px;

		margin-right: 10px;
    }
    .btn:hover { background-color: var(--highlight-hover); }
    .warn { background-color:var(--warning); }
    .btn:hover { background-color: var(--warning-hover); }
</style>
