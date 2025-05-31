const { app, BrowserWindow, ipcMain, nativeTheme, dialog } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Logging setup
log.transports.file.level = 'info';
autoUpdater.logger = log;
log.info("----Started Logging----");
log.info("Started at: " + new Date());

// Window reference
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

// Unified dialog handler for error/info from renderer
ipcMain.handle('show-dialog', (event, type, options = {}) => {
  let dialogOptions = {
    type: 'info',
    buttons: ['OK'],
    defaultId: 0,
    title: '',
    message: '',
    detail: ''
  };

  switch (type) {
    case 'error':
      dialogOptions = {
        ...dialogOptions,
        type: 'error',
        title: options.title || 'Error',
        message: options.message || 'An error occurred.',
        detail: options.detail || ''
      };
      break;
    case 'info':
    default:
      dialogOptions = {
        ...dialogOptions,
        type: 'info',
        title: options.title || 'Info',
        message: options.message || '',
        detail: options.detail || ''
      };
      break;
  }

  return dialog.showMessageBox(win, dialogOptions);
});

// Handle autoUpdater events with dialogs inside main process

autoUpdater.on('update-available', async () => {
  log.info("AutoUpdater: Update available");
  if (!win) return;

  const result = await dialog.showMessageBox(win, {
    type: 'info',
    buttons: ['Download', 'Later'],
    defaultId: 0,
    cancelId: 1,
    title: 'Update Available',
    message: 'A new update is available.',
    detail: 'Would you like to download and install it now?'
  });

  if (result.response === 0) {
    autoUpdater.downloadUpdate();
  } else {
    // User deferred update
    win.webContents.send('update-deferred');
  }
});

autoUpdater.on('update-downloaded', async () => {
  log.info("AutoUpdater: Update downloaded");
  if (!win) return;

  const result = await dialog.showMessageBox(win, {
    type: 'info',
    buttons: ['Restart Now', 'Later'],
    defaultId: 0,
    cancelId: 1,
    title: 'Update Ready',
    message: 'Update downloaded',
    detail: 'Restart the application to apply the update.'
  });

  if (result.response === 0) {
    autoUpdater.quitAndInstall();
  } else {
    win.webContents.send('restart-later');
  }
});

// Extra CLI flag
app.commandLine.appendSwitch("enable-features", "OverlayScrollbar");

// Theme toggle handler
ipcMain.handle('dark-mode:toggle', () => {
  nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark';
  return nativeTheme.shouldUseDarkColors;
});

// Restart app after update (called from renderer)
ipcMain.on('restart_app', () => {
  log.info("AutoUpdater: quitting and installing update");
  autoUpdater.quitAndInstall();
});

// Check for updates for main.js
ipcMain.handle('check-for-updates', () => {
  log.info("AutoUpdater: Checking for updates");
  autoUpdater.checkForUpdates();
});

// Standard Electron app lifecycle
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
