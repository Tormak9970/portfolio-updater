import { writable } from "svelte/store";
import type { Config, EntryState, ExperienceEntry, ProjectEntry } from "./types/ConfigTypes";

export const windowIsMaximized = writable(false);

export const canSave = writable(false);

export const showSetup = writable(true);
export const config = writable<Config>(null);
export const selectedCategory = writable<PortfolioCategory>("Projects");
export const selectedKey = writable("");

export const currentProject = writable<EntryState<ProjectEntry>>({
  "original": "",
  "key": "",
  "data": {
    "index": 0,
    "name": "",
    "tech": [],
    "description": "",
    "content": {},
    "link": "",
    "image": ""
  }
});
export const currentExperience = writable<EntryState<ExperienceEntry>>({
  "original": "",
  "key": "",
  "data": {
    "index": 0,
    "company": "",
    "position": "",
    "companyLink": "",
    "duration": "",
    "description": ""
  }
});

export const projectsList = writable([]);
export const experienceList = writable([]);

export const showUnsavedChangesModal = writable(false);
export const showConfirmDeleteModal = writable(false);