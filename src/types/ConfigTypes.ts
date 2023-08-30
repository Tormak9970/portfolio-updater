import type { OutputData } from "@editorjs/editorjs";

export type ProjectEntry = {
  index: number,
  category: string,
  name: string,
  time: string,
  status: string,
  difficulty: string,
  description: string,
  content: OutputData | any,
  link: string,
  isRelative: boolean,
  image: string,
  organization: string
}

export type ArtEntry = {
  index: number,
  name: string,
  image: string,
  description: string
}

export type ExperienceEntry = {
  index: number,
  company: string,
  image: string,
  position: string,
  description: string
}

export type OrganizationEntry = {
  index: number,
  name: string,
  image: string,
  about: string,
  description: string,
  projects: { name: string, linkId: string }[],
  link: string
}

export type EntryUnion = ProjectEntry | ArtEntry | ExperienceEntry | OrganizationEntry;

export type EntryState<T extends EntryUnion> = {
  original: string,
  key: string,
  data: T
}

export type Config = {
  projects: {
    [id: string]: ProjectEntry
  },
  art: {
    [id: string]: ArtEntry
  },
  experience: {
    [id: string]: ExperienceEntry
  },
  organizations: {
    [id: string]: OrganizationEntry
  },
  archive: {
    [id: string]: ProjectEntry
  }
}