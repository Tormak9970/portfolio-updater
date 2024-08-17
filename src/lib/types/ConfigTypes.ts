import type { OutputData } from "@editorjs/editorjs";

export type PortfolioCategory = "Projects" | "Experience";

export type ProjectEntry = {
  index: number,
  name: string,
  description: string,
  tech: string[],
  content: OutputData | any,
  link?: string,
  image: string
}

export type ExperienceEntry = {
  index: number,
  company: string,
  duration: string,
  position: string,
  companyLink: string,
  description: string,
  content: OutputData | any,
}

export type EntryUnion = ProjectEntry | ExperienceEntry;

export type EntryState<T extends EntryUnion> = {
  original: string,
  key: string,
  data: T
}

export type Config = {
  projects: {
    [id: string]: ProjectEntry
  },
  experience: {
    [id: string]: ExperienceEntry
  }
}

export type EntryData<T extends EntryUnion> = {
  key: string,
  data: T
}