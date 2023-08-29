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
});
export const currentArt = writable<EntryState<ArtEntry>>({
  "original": "",
  "key": "",
  "data": {
    "name": "",
    "img": "",
    "description": ""
  }
});
export const currentExperience = writable<EntryState<ExperienceEntry>>({
  "original": "",
  "key": "",
  "data": {
    "company": "",
    "img": "",
    "position": "",
    "description": ""
  }
});
export const currentOrganization = writable<EntryState<OrganizationEntry>>({
  "original": "",
  "key": "",
  "data": {
    "name": "",
    "img": "",
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
});

export const projectsList = writable([]);
export const artList = writable([]);
export const experienceList = writable([]);
export const organizationsList = writable([]);
export const archiveList = writable([]);

export const showUnsavedChangesModal = writable(false);
export const showConfirmDeleteModal = writable(false);
export const showCrtProjModal = writable(false);
export const showCrtArtModal = writable(false);
export const showCrtExpModal = writable(false);
export const showCrtOrgModal = writable(false);