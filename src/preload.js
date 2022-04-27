// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
          // whitelist channels
          let validChannels = ["window", "showDialog", "updateSettings", "getConfig", "writeConfig"];
          if (validChannels.includes(channel)) ipcRenderer.send(channel, data);
        },
        invoke: (channel, data) => {
          // whitelist channels
          let validChannels = ["getSettingsPath", "uploadFile", "uploadUrl"];
          if (validChannels.includes(channel)) return ipcRenderer.invoke(channel, data);
        },
        sendSync: (channel, data) => {
          // whitelist channels
          let validChannels = [];
          if (validChannels.includes(channel)) return ipcRenderer.sendSync(channel, data);
        },
        receive: (channel, func) => {
          // whitelist channels
          let validChannels = ["fromMain", "config"];
          if (validChannels.includes(channel)) ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
);

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
