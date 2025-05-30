const { contextBridge, nativeTheme, ipcRenderer } = require('electron/renderer');
const log = require('electron-log');

//theme handler
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

//Auto update stuff
contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  sendRestart: () => ipcRenderer.send('restart_app'),
});

//logging stuff
contextBridge.exposeInMainWorld('log', {
  info: (...args) => log.info(...args),
  warn: (...args) => log.warn(...args),
  error: (...args) => log.error(...args),
});


//theme handler 2.0 idk which is used
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