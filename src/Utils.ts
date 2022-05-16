import { dialog, fs, path } from "@tauri-apps/api";

const devBuild = true;
export let settingsPath = "";
export let settingsCache = {
  "configPath": "",
  "selCat": "",
  "state": {
    "experience": {
      "oExp": "",
      "data": {}
    },
    "projects": {
      "oProj": "",
      "cat": "",
      "key": "",
      "data": {}
    },
    "organizations": {
      "oOrg": "",
      "data": {}
    },
    "art": {
      "oArt": "",
      "data": {}
    }
  }
}

export async function setSettingsPath() { settingsPath = await path.resolve(devBuild ? './public/settings.json' : "./resources/app/public/settings.json"); }

export async function updateSettings(data: { prop: string, data: Object }) {
  const settingsData = await fs.readTextFile(settingsPath);

  const settings = JSON.parse(settingsData);
  settings[data.prop] = data.data;
  settingsCache[data.prop] = data.data;

  await fs.writeFile({
    path: settingsPath, 
    contents: JSON.stringify(settings)
  });
}
export async function getConfig(data: string) {
  await fs.readTextFile(data).then((contents) => {
    const config = JSON.parse(contents);

    return [JSON.stringify(config), settingsCache.selCat, JSON.stringify(settingsCache.state)];
  }, () => {
    return [null, settingsCache.selCat, null]
  });
}
export async function writeConfig(data: string) {
  try {
    await fs.writeFile({
      path: settingsCache.configPath, 
      contents: data
    })
  } catch (e) {
    console.log(e);
  }
}
export async function uploadUrl(event, data) {
  const url = data;
  const name = url.substring(url.lastIndexOf("/") + 1);

  const response = await fetch(url);
  const buffer = await response.buffer();

  const imagesWebsiteDir = path.join(path.dirname(settingsCache.articlesFile), 'img', 'articles');
  if (fs.existsSync(imagesWebsiteDir)) fs.mkdirSync(imagesWebsiteDir, { recursive: true });
  fs.writeFileSync(path.join(imagesWebsiteDir, name), buffer);

  // TODO: remove need for this
  // const imagesEditorDir = path.join(path.dirname(settingsPath), 'img', 'articles');
  // if (fs.existsSync(imagesEditorDir)) fs.mkdirSync(imagesEditorDir, { recursive: true });
  // fs.writeFileSync(path.join(imagesEditorDir, name), buffer);

  return JSON.stringify({ success: 1, file: { url: `./img/articles/${name}` } });
}
export async function uploadFile(event, data) {
  const filePath = data;
  const file = {
    name: path.basename(filePath),
    data: fs.readFileSync(filePath)
  };

  const imagesWebsiteDir = path.join(path.dirname(settingsCache.articlesFile), 'img', 'articles');
  if (fs.existsSync(imagesWebsiteDir)) fs.mkdirSync(imagesWebsiteDir, { recursive: true });
  fs.writeFileSync(path.join(imagesWebsiteDir, file.name), file.data);

  // TODO: remove need for this
  // const imagesEditorDir = path.join(path.dirname(settingsPath), 'img', 'articles');
  // if (fs.existsSync(imagesEditorDir)) fs.mkdirSync(imagesEditorDir, { recursive: true });
  // fs.writeFileSync(path.join(imagesEditorDir, file.name), file.data);

  return JSON.stringify({ success: 1, file: { url: `./img/articles/${file.name}` } });
}