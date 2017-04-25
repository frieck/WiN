// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu, Tray, ipcMain } from 'electron';
import devMenuTemplate from './helpers/menu_template';
import { createWindow, MainWindow } from './helpers/window';
import schedulesMenu from './helpers/scheduler_menu_template';


// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow: MainWindow;
var menu: Electron.Menu;
var tray: Electron.Tray;
var schedulesData: any;

var setApplicationMenu = function (mw: Electron.BrowserWindow) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(devMenuTemplate(mw)));
};

var closeMenu;

app.on('ready', function () {

    mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
        frame: true
    });

    closeMenu = {
        label: 'Sair',
        click: function () {
            mainWindow.forceClose = true;
            app.quit();
        }
    };

    setApplicationMenu(mainWindow);

    const iconName = process.platform === 'win32' ? 'tray.ico' : 'tray.png'
    tray = new Tray(__dirname + '/icons/' + iconName);
    const contextMenu = schedulesMenu(app, mainWindow);
    var menus = [contextMenu, closeMenu];
    tray.setToolTip('WiN');
    tray.on('click', () => {
        mainWindow.show();
    });

    mainWindow.loadURL(__dirname + '/index.html');

    if (env.name !== 'production') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.webContents.on('did-finish-load', function () {
        mainWindow.webContents.send('scheduler-load', app.getPath('userData'), 'schedules-main.json');
        mainWindow.webContents.send('scheduler-tray-click', 'hey!');
    });

    mainWindow.on('close', (e) => {
        if (mainWindow.forceClose) return;
        e.preventDefault();
        mainWindow.hide();
    });

});

app.on('window-all-closed', function () {
    app.quit();
});

ipcMain.on('schedules-loaded', (event, arg) => {
    schedulesData = arg;
    const contextMenu = schedulesMenu(app, mainWindow, arg);
    var menus = [contextMenu, closeMenu];
    tray.setContextMenu(Menu.buildFromTemplate(menus));
});