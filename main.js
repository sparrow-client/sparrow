const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs').promises;

const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('frontend/index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('open-file-dialog', async() => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Text Files', extensions: ['json'] }
      ]
    });

    if (result.canceled) {
      return null;
    }

    const filepath = result.filePaths[0];
    const content = await fs.readFile(filepath, 'utf8');

    return { filepath, content };
  });
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindow().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit()
  }
})
