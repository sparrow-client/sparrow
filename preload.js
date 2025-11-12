const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  saveFile: ({filepath, content}) => ipcRenderer.invoke('save-file', {filepath, content})
});

contextBridge.exposeInMainWorld('appCore', {
  updateState: (state) => ipcRenderer.invoke('update-app-state')
})
