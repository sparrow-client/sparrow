const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs").promises;

class IOAPI {
  async saveFile(event, { filename, content }) {
    const { filePath } = await dialog.showSaveDialog({
      title: "Save File",
      defaultPath: filename,
      filters: [{ name: "Text Files", extensions: ["json"] }],
    });

    if (filePath) {
      await fs.writeFile(filePath, content, "utf8");
      return filePath;
    }
  }

  async openFile() {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Text Files", extensions: ["json"] }],
    });

    if (result.canceled) {
      return null;
    }

    const filepath = result.filePaths[0];
    const content = await fs.readFile(filepath, "utf8");

    return { filepath, content };
  }
}

module.exports = { IOAPI };
