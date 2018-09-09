// "Import" the app and BrowserWindow objects from the electron library.
const {app, BrowserWindow} = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

app.on('ready', createWindow);

// For OS X
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// For OS X
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
