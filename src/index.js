const { app, BrowserWindow, autoUpdater, dialog } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const server = "https://update.electronjs.org";
const feed = `${server}/hajime-u/electron-update-demo/${process.platform}-${process.arch}/${app.getVersion()}`;

if (app.isPackaged) {
  autoUpdater.setFeedURL({url: feed});
}
autoUpdater.checkForUpdates();

autoUpdater.on('update-downloaded', async () => {
  const returnValue = await dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version of the app is available. Do you want to update now?',
    buttons: ['Update', 'Later']
  });
  if (returnValue.response === 0) autoUpdater.quitAndInstall();
});

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    message: "New version is available",
    buttons: ["OK"]
  })
});

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    message: "No updates available",
    buttons: ["OK"]
  })
});

autoUpdater.on('error', (error) => {
  console.error(error);
});
