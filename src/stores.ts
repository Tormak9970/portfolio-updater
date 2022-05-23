import { writable } from "svelte/store";

export const renderIdx = writable(0);
export const config = writable(null);
export const selCat = writable("Projects");

// Projects stores
export const jSwitchProj = writable(false);
export const state = writable({
    "experience": {
        "oExp": "",
        "data": {}
    },
    "projects": {
        "oProj": "",
        "cat": "",
        "key": "",
        "data": {
            "name": "",
            "time": "",
            "status": "",
            "difficulty": "",
            "description": "",
            "content": {},
            "link": "",
            "isRelative": false,
            "imgs": []
        }
    },
    "organizations": {
        "oOrg": "",
        "data": {}
    },
    "art": {
        "oArt": "",
        "data": {}
    }
});
export const changedCat = writable(null);
export const changedKey = writable(null);
export const showCreateNewModal = writable(false);