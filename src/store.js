import { writable } from "svelte/store";

export const renderIdx = writable(0);
export const config = writable({});
export const currentProj = writable({
    project: {},
    category: "",
    key: "",
});