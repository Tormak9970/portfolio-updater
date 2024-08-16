import { fs, path, tauri } from "@tauri-apps/api";

const DEFAULT_SETTINGS = {
  "configPath": "",
  "selectedCategory": "Projects",
  "currentProject": {
    "original": "",
    "key": "",
    "data": {
      "index": 0,
      "name": "",
      "category": "",
      "tech": [],
      "description": "",
      "content": {},
      "link": "",
      "image": "",
    }
  },
  "currentExperience": {
    "original": "",
    "key": "",
    "data": {
      "index": 0,
      "company": "",
      "position": "",
      "duration": "",
      "companyLink": "",
      "description": ""
    }
  }
}

export let settingsPath = "";
export let configPath = "";

export async function setSettingsPath() {
  const appDir = await path.appConfigDir();
  if (!(await fs.exists(appDir))) await fs.createDir(appDir);

  const setsPath = await path.join(appDir, "settings.json");
  if (!(await fs.exists(setsPath))) {
    await fs.writeTextFile(setsPath, JSON.stringify(DEFAULT_SETTINGS));
  }

  settingsPath = setsPath;
}

export async function updateSettings(data: { prop: string, data: any }) {
  if (data.prop == "configPath") {
    configPath = data.data;
  }

  const settingsData = await fs.readTextFile(settingsPath);

  const settings = JSON.parse(settingsData);
  settings[data.prop] = data.data;

  await fs.writeTextFile(settingsPath, JSON.stringify(settings));
}
export async function getConfig(cfgPath: string) {
  if (cfgPath !== "" && await fs.exists(cfgPath)) {
    const contents = await fs.readTextFile(cfgPath);
    configPath = cfgPath;
    const config = JSON.parse(contents);

    return config;
  } else {
    return null;
  }
}
export async function writeConfig(data: string) {
  try {
    await fs.writeTextFile(configPath, data);
  } catch (e) {
    console.log(e);
  }
}

export async function uploadUrl(url: string) {
  const name = url.substring(url.lastIndexOf("/") + 1);

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  const imagesWebsiteDir = await path.join('images', "projects");
  const preFinalPath = await path.join(imagesWebsiteDir, name);
  const finalPath = await path.join(await path.dirname(configPath), preFinalPath);

  await fs.writeBinaryFile({
    path: finalPath,
    contents: new Uint8Array(buffer)
  });

  return JSON.stringify({ success: 1, file: { url: tauri.convertFileSrc(finalPath) } });
}

export async function uploadFile(name:string, buffer: ArrayBuffer) {
  const imagesWebsiteDir = await path.join('images', "projects");
  const preFinalPath = await path.join(imagesWebsiteDir, name);
  const finalPath = await path.join(await path.dirname(configPath), preFinalPath);

  await fs.writeBinaryFile({
    path: finalPath,
    contents: new Uint8Array(buffer)
  });

  return JSON.stringify({ success: 1, file: { url: tauri.convertFileSrc(finalPath) } });
}

export function getKeyFromName(name: string): string {
  return name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "");
}

export function genExperienceKey(company: string, position: string): string {
  return [getKeyFromName(company), getKeyFromName(position)].join("-");
}