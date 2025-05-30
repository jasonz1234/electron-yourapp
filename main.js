const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

log.transports.file.level = 'info';
autoUpdater.logger = log;

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './renderer/icon.png',
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
    titleBarOverlay: {
      color: '#00000000',
      symbolColor: '#808080',
      height: 38,
      width: 38
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      devTools: true,
      spellcheck: false,
      safeDialogs: true
    }
  });

  win.loadFile('renderer/index.html');
  win.webContents.openDevTools();

  win.webContents.on('did-finish-load', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.commandLine.appendSwitch("enable-features", "OverlayScrollbar");

ipcMain.handle('dark-mode:toggle', () => {
  nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark';
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('check-for-updates', () => {
  autoUpdater.checkForUpdates();
});


autoUpdater.on('update-available', () => {
  if (win) win.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  if (win) win.webContents.send('update_downloaded');
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
