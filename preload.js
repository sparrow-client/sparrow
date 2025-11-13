const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  openFile: () => ipcRenderer.invoke("open-file-dialog"),
  saveFile: ({ filename, content }) =>
    ipcRenderer.invoke("save-file", { filename, content }),
});

contextBridge.exposeInMainWorld("coreApi", {
  updateState: (state) => ipcRenderer.invoke("update-app-state"),
  runUsecase: ({ usecaseJson }) =>
    ipcRenderer.invoke("core-run-usecase", { usecaseJson }),
});
