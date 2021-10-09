import { Writable, writable } from "svelte/store";

export const componentRender = writable(0);
export const config = writable(<Config>{});
export const currentProj = writable(<Project>{});