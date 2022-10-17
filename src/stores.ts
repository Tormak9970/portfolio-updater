import { writable } from "svelte/store";

export const renderIdx = writable(0);
export const config = writable(null);
export const selCat = writable("Projects");
export const state = writable({
    "experience": {
        "oExp": "",
        "key": "",
        "data": {
            "company": "",
            "img": "",
            "position": "",
            "description": ""
        }
    },
    "projects": {
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
    },
    "organizations": {
        "oOrg": "",
        "key": "",
        "data": {
            "name": "",
			"img": "",
			"about": "",
			"description": "",
			"projects": [],
            "link": ""
        }
    },
    "art": {
        "oArt": "",
        "key": "",
        "data": {
            "name": "",
            "img": "",
            "description": ""
        }
    }
});
export const changedKey = writable(null);

// Projects stores
export const jSwitchProj = writable(false);
export const showCrtProjModal = writable(false);

// Art stores
export const showCrtArtModal = writable(false);

// Experience stores
export const showCrtExpModal = writable(false);

// Organization stores
export const showCrtOrgModal = writable(false);