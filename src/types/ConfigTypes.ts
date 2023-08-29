import type { OutputData } from "@editorjs/editorjs";

export type ProjectEntry = {
  category: string,
  name: string,
  time: string,
  status: string,
  difficulty: string,
  description: string,
  content: OutputData | any,
  link: string,
  isRelative: boolean,
  img: string,
  org: string
}

export type ArtEntry = {
  name: string,
  img: string,
  description: string
}

export type ExperienceEntry = {
  company: string,
  img: string,
  position: string,
  description: string
}

export type OrganizationEntry = {
  name: string,
  img: string,
  about: string,
  description: string,
  projects: { name: string, linkId: string }[],
  link: string
}

export type EntryState<T extends ProjectEntry | ArtEntry | ExperienceEntry | OrganizationEntry> = {
  original: string,
  key: string,
  data: T
}