import { writable } from "svelte/store";
import { ipcRenderer } from 'electron';
import path from 'path';

export const componentRender = writable(0);
export const config = writable(<Config>{});
export const currentProj = writable(<Project>{});

export const devBuild:boolean = true;
export const resourcePath:string = (devBuild) ? path.join(__dirname, "../", "resources") : process.resourcesPath;

export function readFileSync(loc:string) { return ipcRenderer.sendSync('readFile', loc); }
export function writeFileSync(loc:string, data:any) { ipcRenderer.send('writeFile', [loc, data]); }