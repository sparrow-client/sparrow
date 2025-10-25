const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs').promises;

const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
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

  ipcMain.handle('save-file', async(event, { filename, content }) => {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save File',
      defaultPath: filename,
      filters: [
        {name: 'Text Files', extensions: ['json']}
      ]
    })

    if (filePath) {
      await fs.writeFile(filePath, content, 'utf8');
      return filePath;
    }
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
