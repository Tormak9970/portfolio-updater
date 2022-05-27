import { fs, path, tauri } from "@tauri-apps/api";

export let settingsPath = "";
export let configPath = "";

export async function setSettingsPath() { settingsPath = import.meta.env.DEV ? await path.resolve('../public/settings.json') : await path.join(await path.resourceDir(), "settings.json"); }

export async function updateSettings(data: { prop: string, data: any }) {
  if (data.prop == "configPath") {
    configPath = data.data;
  }
  const settingsData = await fs.readTextFile(settingsPath);

  const settings = JSON.parse(settingsData);
  settings[data.prop] = data.data;

  await fs.writeFile({
    path: settingsPath, 
    contents: JSON.stringify(settings)
  });
}
export async function getConfig(cfgPath: string) {
  const res = await fs.readTextFile(cfgPath).then((contents) => {
    configPath = cfgPath;
    const config = JSON.parse(contents);

    return config;
  }, () => {
    return null;
  });
  return res;
}
export async function writeConfig(data: string) {
  try {
    await fs.writeFile({
      path: configPath, 
      contents: data
    })
  } catch (e) {
    console.log(e);
  }
}
export async function uploadUrl(url: string) {
  const name = url.substring(url.lastIndexOf("/") + 1);

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  const imagesWebsiteDir = await path.join('img', 'projs');
  const preFinalPath = await path.join(imagesWebsiteDir, name);
  const finalPath = await path.join(await path.dirname(configPath), preFinalPath);

  await fs.writeBinaryFile({
    path: finalPath,
    contents: new Uint8Array(buffer)
  });

  return JSON.stringify({ success: 1, file: { url: tauri.convertFileSrc(finalPath), webUrl: preFinalPath } });
}
export async function uploadFile(filePath: string) {
  const imagesWebsiteDir = await path.join(await path.dirname(configPath), 'img', 'projs');
  const preFinalPath = await path.join(imagesWebsiteDir, await path.basename(filePath));
  const finalPath = await path.join(await path.dirname(configPath), preFinalPath);

  await fs.copyFile(filePath, finalPath);

  return JSON.stringify({ success: 1, file: { url: tauri.convertFileSrc(finalPath), webUrl: preFinalPath } });
}