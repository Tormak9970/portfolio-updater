import { writable } from "svelte/store";

export const renderIdx = writable(0);
export const config = writable({});
export const selCat = writable("Projects");
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
        "data": {}
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