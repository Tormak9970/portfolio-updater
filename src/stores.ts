import { writable } from "svelte/store";

export const showSetup = writable(true);
export const config = writable(null);
export const selectedCategory = writable<PortfolioCategory>("Projects");
export const state = writable({
  "experience": {
    "original": "",
    "key": "",
    "data": {
      "company": "",
      "img": "",
      "position": "",
      "description": ""
    }
  },
  "projects": {
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
  },
  "organizations": {
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
  },
  "art": {
    "original": "",
    "key": "",
    "data": {
      "name": "",
      "img": "",
      "description": ""
    }
  },
  "archive": {
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