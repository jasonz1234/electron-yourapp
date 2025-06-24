const { contextBridge, nativeTheme, ipcRenderer } = require('electron/renderer');

// app infomation
contextBridge.exposeInMainWorld('appInfo', {
  getVersion: () => ipcRenderer.invoke('get-app-version')
});

// theme handler
contextBridge.exposeInMainWorld('darkMode', {

})

// exposing apis
contextBridge.exposeInMainWorld('electronAPI', {
  // Update handles
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update_not_available', callback),
  // mac comfirmation
  mac: () => ipcRenderer.invoke('mac'),
  // dev handling
  devtools: () => ipcRenderer.invoke('devtools'),
  devbuild: () =>ipcRenderer.invoke('devbuild'),
  // theme handling
  themeToggle: () => ipcRenderer.invoke('dark-mode:toggle'),
});

// theme handler 2.0 idk which is used
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => {
    const isDark = nativeTheme.shouldUseDarkColors;
    nativeTheme.themeSource = isDark ? 'light' : 'dark';
    return !isDark;
  },
  system: () => {
    nativeTheme.themeSource = 'system';
  }
});