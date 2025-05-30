const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');


//Log stuff
log.transports.file.level = 'info';
autoUpdater.logger = log;
log.info("----Started Logging----");
log.info("Started at: "+new Date());

//window 
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

//some extras
app.commandLine.appendSwitch("enable-features", "OverlayScrollbar");

//theme handler
ipcMain.handle('dark-mode:toggle', () => {
  nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark';
  return nativeTheme.shouldUseDarkColors;
});

//Auto updater restart stuff
ipcMain.on('restart_app', () => {
  log.info("AutoUpdater: quiting and now installing");
  autoUpdater.quitAndInstall();
});

//Autoupdater checking for updates
ipcMain.handle('check-for-updates', () => {
  log.info("AutoUpdater: Checking for updates");
  autoUpdater.checkForUpdates();
});

//autoupdater update is avaible block
autoUpdater.on('update-available', () => {
  log.info("AutoUpdater: Sending update available to win")
  if (win) win.webContents.send('update_available');
});

//Auto updater the "restart to update" block
autoUpdater.on('update-downloaded', () => {
  log.info("AutoUpdater: Send update downloaded and ask to restart or not")
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
