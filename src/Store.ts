import { writable } from "svelte/store";

export const renderIdx = writable(0);
export const config = writable(<Config>{});
export const currentProj = writable(<ProjectCache>{
    project: {},
    category: "",
    key: "",
});