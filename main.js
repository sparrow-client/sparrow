const { CoreApi } = require("./core/core-api.js");
const { IOAPI } = require("./io-api.js");

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs").promises;

const path = require("node:path");

const io = new IOAPI();
const core = new CoreApi();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("frontend/index.html");
};

app.whenReady().then(() => {
  ipcMain.handle("open-file-dialog", io.openFile);
  ipcMain.handle("save-file", io.saveFile);

  ipcMain.handle("core-run-usecase", (event, { json }) => {
    return core.runUsecase({ usecaseJson: json })
  }
  );

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindow().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});
