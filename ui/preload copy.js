const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  downloadBlob: (data) => ipcRenderer.send('download-blob', data)
});
