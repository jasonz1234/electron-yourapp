const { contextBridge, nativeTheme, ipcRenderer } = require('electron/renderer');

//theme handler
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

//Auto update stuff
contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
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