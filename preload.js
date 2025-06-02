const { contextBridge, nativeTheme, ipcRenderer } = require('electron/renderer');

// app infomation
contextBridge.exposeInMainWorld('appInfo', {
  getVersion: () => ipcRenderer.invoke('get-app-version')
});

// theme handler
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

// Auto update stuff
contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update_not_available', callback),
});

contextBridge.exposeInMainWorld('mac', {
  yes: () => ipcRenderer.invoke('mac'),
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