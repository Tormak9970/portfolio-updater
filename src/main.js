const { app, BrowserWindow, ipcMain, screen, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const fetch = require('node-fetch');
const child_process = require('child_process');

if (handleSquirrelEvent()) return;

const devBuild = true;
process.env.ELECTRON_ENABLE_LOGGING = devBuild;
process.env.ELECTRON_ENABLE_STACK_DUMPING = devBuild;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

const settingsPath = path.resolve(devBuild ? './public/settings.json' : "./resources/app/public/settings.json");
let settingsCache = {
  "configDir": "",
  "openProj": {}
}

app.on("ready", () => {
  app.setAppUserModelId('dev.tormak.portfolio-site-editor');
  initMain();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initMain();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function initMain() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../public/logo.ico"),
  });

  mainWindow.on('ready-to-show', () => mainWindow.show());
  mainWindow.removeMenu();

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const settingsData = fs.readFileSync(settingsPath);
  const settings = JSON.parse(settingsData);
  settingsCache = settings;

  initMainListeners(mainWindow);
}
/**
 * @param  {BrowserWindow} window window to apply the listeners to.
 */
function initMainListeners(window) {
  ipcMain.on('window', (event, data) => {
    if (data[0] === 'close') {
      app.quit();
    } else if (data[0] === 'minimize') {
      window.minimize();
    } else if (data[0] === 'maximize') {
      window.maximize();
    } else if (data[0] === 'restore') {
      window.restore();
    }
  });
  ipcMain.on("showDialog", async (event, data) => {
    dialog.showOpenDialog(window, { properties: ['openFile'] }).then(async (dir) => {
      if (!dir.canceled) {
        switch (data) {
          case "articles":
            if (fs.statSync(dir.filePaths[0]).isFile()) {
              const contents = fs.readFileSync(dir.filePaths[0]);
              const articles = JSON.parse(contents);
          
              await updateSettings("articlesFile", dir.filePaths[0]);

              window.webContents.send("articles", [JSON.stringify(articles), (settingsCache.openArticle.name) ? JSON.stringify(settingsCache.openArticle) : null]);
            }
            break;
        }
      }
    });
  });
  ipcMain.on("updateSettings", async (event, data) => { await updateSettings(data.prop, data.value); });
  ipcMain.on("getArticles", (event, data) => {
    if (fs.existsSync(data)) {
      const contents = fs.readFileSync(data);
      const articles = JSON.parse(contents);

      window.webContents.send("articles", [JSON.stringify(articles), (settingsCache.openArticle.name) ? JSON.stringify(settingsCache.openArticle) : null]);
    } else {
      window.webContents.send("articles", [null, (settingsCache.openArticle.name) ? JSON.stringify(settingsCache.openArticle) : null]);
    }
  });
  ipcMain.on("writeProjects", (event, data) => {
    if (fs.existsSync(settingsCache.articlesFile)) fs.writeFileSync(settingsCache.articlesFile, data);
  });
  ipcMain.handle("getSettingsPath", async (event, data) => { return settingsPath; });
  ipcMain.handle("uploadUrl", async (event, data) => {
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
  });
  ipcMain.handle("uploadFile", (event, data) => {
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
  });
}

async function updateSettings(prop, data) {
  const settingsData = fs.readFileSync(settingsPath);
  const settings = await JSON.parse(settingsData);
  settings[prop] = data;
  settingsCache[prop] = data;
  fs.writeFileSync(settingsPath, JSON.stringify(settings));
}

//handles installation events
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = child_process.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};