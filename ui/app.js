const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs');

handleSquirrelEvent();

const url = require("url");
const path = require("path");

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    mainWindow.maximize()
    mainWindow.show()

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `index.html`),
            protocol: "file:",
            slashes: true
        })
    );

    mainWindow.on('closed', function () {
        mainWindow = null
    })
    
    mainWindow.webContents.on('did-fail-load', async (event, errorCode, errorDescription) => {
        console.error(`Load failed: ${errorDescription} (Code: ${errorCode})`);
        await mainWindow.loadFile(path.join(__dirname, 'index.html'));
    });

    mainWindow.on('render-process-gone', (event, detailed) => {
        if (detailed.reason === 'crashed') {
            mainWindow.webContents.reload();
        }
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

ipcMain.on('download-blob', function (event, { blob, filename, extension }) {
    const data = blob.replace(/^data:.+;base64,/, '');
    const buffer = Buffer.from(data, 'base64');

    dialog.showSaveDialog({
        title: 'Save File',
        defaultPath: `${filename}.${extension}`
    }).then(({ filePath }) => {
        if (filePath) {
            fs.writeFile(filePath, buffer, (err) => {
                if (err) throw err;
            });
        }
    });
})

function handleSquirrelEvent () {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');
    const package = require('./package.json');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.resolve(path.join(rootAtomFolder,'app-'+package.version+'/application.exe'));
    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            // explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
}