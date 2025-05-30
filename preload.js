const { contextBridge, nativeTheme, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  sendRestart: () => ipcRenderer.send('restart_app'),
});

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