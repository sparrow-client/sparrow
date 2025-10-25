const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  saveFile: ({filepath, content}) => ipcRenderer.invoke('save-file', {filepath, content})
});
