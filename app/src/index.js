const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ChildProcess = require('child_process');
const fs = require('fs');

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true,
});

if (handleSquirrelEvent()) {
  return;
}

const devBuild = true;
process.env.ELECTRON_ENABLE_LOGGING = devBuild;

app.whenReady().then(() => {
  app.setAppUserModelId('com.github.tormak9970');
  initMain();
  
  app.on('activate', function () { if (BrowserWindow.getAllWindows().length === 0) initMain(); });
});
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit(); });

//main window
function initMain () {
  const mainWindow = new BrowserWindow({
    width: 716,
    height: 545,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: "src/img/Logo.ico",
    show: false
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.removeMenu();

  mainWindow.webContents.openDevTools();

  mainWindow.loadFile(path.join(__dirname, '../public/index.html'));

  mainWindow.on('close', () => { app.quit(); });

  initMainListeners();
}
function initMainListeners() {
  ipcMain.on('minimizeWindow', (event, data) => { mainWindow.minimize(); });
  ipcMain.on('maximizeWindow', (event, data) => { mainWindow.maximize(); });
  ipcMain.on('restoreWindow', (event, data) => { mainWindow.restore(); });
  ipcMain.on('closeWindow', (event, data) => { mainWindow.close(); });
  ipcMain.on('readFile', (event, data) => { const res = fs.readFileSync(data); event.reply(res); });
  ipcMain.on('writeFile', (event, data) => { fs.writeFileSync(data[0], data[1]); });
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
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
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

