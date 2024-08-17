import { writable } from "svelte/store";
import type { Config, EntryState, ExperienceEntry, PortfolioCategory, ProjectEntry } from "./lib/types/ConfigTypes";

export const showInfoSnackbar = writable<(data: ShowInfoOptions) => void>();
export const showErrorSnackbar = writable<(data: ShowInfoOptions) => void>();

export const themePrimaryColor = writable("#dd5527");

export const canSave = writable(false);

export const showSideNav = writable(false);
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
    "description": "",
    "content": {}
  }
});

export const projectsList = writable<{ key: string, data: ProjectEntry }[]>([]);
export const experienceList = writable<{ key: string, data: ExperienceEntry }[]>([]);

export const showUnsavedChangesModal = writable(false);
export const showConfirmDeleteModal = writable(false);