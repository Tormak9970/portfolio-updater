import { dialog, fs, path } from "@tauri-apps/api";

const devBuild = true;
const settingsPath = await path.resolve(devBuild ? './public/settings.json' : "./resources/app/public/settings.json");
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

export async function updateSettings(event, data) {
    await updateSettings(data.prop, data.value);
}
export async function getConfig(event, data) {
    if (fs.existsSync(data)) {
        const contents = fs.readFileSync(data);
        const config = JSON.parse(contents);

        window.webContents.send("config", [JSON.stringify(config), settingsCache.selCat, JSON.stringify(settingsCache.state)]);
    } else {
        window.webContents.send("config", [null, settingsCache.selCat, null]);
    }
}
export function writeConfig(event, data) {
    if (fs.existsSync(settingsCache.configPath)) {
        fs.writeFileSync(settingsCache.configPath, data);
    }
}
export async function getSettingsPath(event, data) { return settingsPath; });
export async function uploadUrl(event, data) {
    const url = data;
    const name = url.substring(url.lastIndexOf("/") + 1);

    const response = await fetch(url);
    const buffer = await response.buffer();

    const imagesWebsiteDir = path.join(path.dirname(settingsCache.articlesFile), 'img', 'articles');
    if (fs.existsSync(imagesWebsiteDir)) fs.mkdirSync(imagesWebsiteDir, { recursive: true });
    fs.writeFileSync(path.join(imagesWebsiteDir, name), buffer);

    const imagesEditorDir = path.join(path.dirname(settingsPath), 'img', 'articles');
    if (fs.existsSync(imagesEditorDir)) fs.mkdirSync(imagesEditorDir, { recursive: true });
    fs.writeFileSync(path.join(imagesEditorDir, name), buffer);

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

    const imagesEditorDir = path.join(path.dirname(settingsPath), 'img', 'articles');
    if (fs.existsSync(imagesEditorDir)) fs.mkdirSync(imagesEditorDir, { recursive: true });
    fs.writeFileSync(path.join(imagesEditorDir, file.name), file.data);

    return JSON.stringify({ success: 1, file: { url: `./img/articles/${file.name}` } });
}