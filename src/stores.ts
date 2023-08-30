import { writable } from "svelte/store";
import type { ArtEntry, Config, EntryState, ExperienceEntry, OrganizationEntry, ProjectEntry } from "./types/ConfigTypes";

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
    "category": "",
    "name": "",
    "time": "",
    "status": "",
    "difficulty": "",
    "description": "",
    "content": {},
    "link": "",
    "isRelative": false,
    "image": "",
    "organization": ""
  }
});
export const currentArt = writable<EntryState<ArtEntry>>({
  "original": "",
  "key": "",
  "data": {
    "index": 0,
    "name": "",
    "image": "",
    "description": ""
  }
});
export const currentExperience = writable<EntryState<ExperienceEntry>>({
  "original": "",
  "key": "",
  "data": {
    "index": 0,
    "company": "",
    "image": "",
    "position": "",
    "description": ""
  }
});
export const currentOrganization = writable<EntryState<OrganizationEntry>>({
  "original": "",
  "key": "",
  "data": {
    "index": 0,
    "name": "",
    "image": "",
    "about": "",
    "description": "",
    "projects": [],
    "link": ""
  }
});
export const currentArchive = writable<EntryState<ProjectEntry>>({
  "original": "",
  "key": "",
  "data": {
    "index": 0,
    "category": "",
    "name": "",
    "time": "",
    "status": "",
    "difficulty": "",
    "description": "",
    "content": {},
    "link": "",
    "isRelative": false,
    "image": "",
    "organization": ""
  }
});

export const projectsList = writable([]);
export const artList = writable([]);
export const experienceList = writable([]);
export const organizationsList = writable([]);
export const archiveList = writable([]);

export const showUnsavedChangesModal = writable(false);
export const showConfirmDeleteModal = writable(false);