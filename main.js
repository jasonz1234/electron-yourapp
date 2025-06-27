const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// dev stuff whatever it is
const devbuild = false;
const allowDevTools = false;

// Logging setup and extra debug info
log.transports.file.level = 'info';
autoUpdater.logger = log;
log.info("----Started Logging----");
log.info("Started at: " + new Date());
log.info('App version: ' + app.getVersion);
log.info("Devbuild?....." + devbuild);
log.info("allowdevtools." + allowDevTools);
log.info("isPackaged...." + app.isPackaged);
log.info('----Ended Debugging Info----');

// Window making stuff
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    title: 'YourApp',
    roundedCorners: true,
    icon: './renderer/icon.png',
    titleBarStyle: "hidden",
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
      nodeIntegration: false,
      accessibleTitle: "Your App",
      safeDialogs: true,
      scrollBounce: true,
      spellcheck: false,
      javascript: true
    }
  });
  //load app page
  win.loadFile('renderer/index.html');

  //Auto updater checking for updates
  win.webContents.on('did-finish-load', () => {
    log.info("Autoupdater: Checking for Updates");
    autoUpdater.checkForUpdatesAndNotify();
  });
  //Open devtools msg
  win.webContents.on('devtools-opened', () => {
    win.webContents.executeJavaScript(`console.warn(
      "Computer or App Safety\\n%c⚠️ STOP!!!! %c\\nWARNING: Do not paste code here unless you know exactly what you're doing.\\nIt can compromise your computer or worse",
      "background: red; width: 100%; position: relative; color: white; font-size: 40px; font-weight: bold; padding: 20px 50px; border-radius: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.6);",
      "font-weight: bolder; font-size: 20px; padding: 10px 0 0 10px;"
    );`);
  });
  //auto opening if devbuild to make life easier
  if (devbuild != false) {
    win.webContents.openDevTools();
  };
  //force close devtools
  win.webContents.on('devtools-opened', () => {
    if (allowDevTools != true) {
      win.webContents.closeDevTools();
    }
  });
}

// macos checker
ipcMain.handle('mac', async () => {
  return process.platform === 'darwin';
});
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
    log.info('Autoupdater: now downloading update');
  } else {
    // User deferred update
    win.webContents.send('update-deferred');
    log.info('Autoupdater: Update ignored')
  }
});

//Update downloaded duh
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
    log.info('Autoupdater: now restarting to update')
  } else {
    win.webContents.send('restart-later');
  }
});

// Extra CLI flag hope have good scroll bars
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
  if (app.isPackaged) {
    log.info("AutoUpdater: Checking for updates");
    autoUpdater.checkForUpdates();
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    console.log('AutoUpdater skipped: not packaged.');
  }
  autoUpdater.on('update-not-available', () => {
    if (win) win.webContents.send('update_not_available');
  });
});

// Respond to version request
ipcMain.handle('get-app-version', () => {
  return "YourApp Version: " + app.getVersion();
});

// Devtools controller thing
ipcMain.handle('devtools', () => {
  if (!allowDevTools) {
    allowDevTools = true;
  } else allowDevTools = false;
  return allowDevTools;
});

// return if devbuild
ipcMain.handle('devbuild', () => {
  return devbuild;
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

//macos thing again
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
