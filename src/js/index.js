import fs from 'fs'
import path from 'path'
import url from 'url'
import { BrowserWindow, Menu, MenuItem, Tray, app, ipcMain } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { enableLiveReload } from 'electron-compile'
import ELECTRON_SQUIRREL_STARTUP from 'electron-squirrel-startup'
import Positioner from 'electron-positioner'
import minimist from 'minimist'
import { ICON } from './constant.js'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray

const flags = minimist(process.argv, {
  boolean: true,
  default: {
    dev    : !!process.execPath.match(/[\\/]electron/),
    testing: false,
    hidden : false,
    debug  : false,
    log    : app.getPath('home'),
  },
})

if (flags.debug) {
  process.on('uncaughtException', (err) => {
    fs.appendFileSync(path.join(flags.log, 'recta-error.log'), err)
  })
}

if (flags.dev) enableLiveReload()

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized())
      mainWindow.restore()

    mainWindow.focus()
  }
})

if (isSecondInstance) {
  app.isQuiting = true
  app.quit()
}

if (ELECTRON_SQUIRREL_STARTUP) {
  app.isQuiting = true
  app.quit()
}

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width : 400,
    height: 600,
    show  : !flags.hidden,
    icon  : path.join(__dirname, '../img/icons/png/32x32.png'),
  })

  const positioner = new Positioner(mainWindow)

  positioner.move('topRight')

  const mainMenu = Menu.buildFromTemplate([
    {
      label  : 'File',
      submenu: [
        {
          label: 'Minimize to Tray',
          click () {
            mainWindow.hide()
          },
        },
        { type: 'separator' },
        {
          label: 'Quit',
          click () {
            app.isQuiting = true
            app.quit()
          },
        },
      ],
    },
  ])

  if (flags.dev) {
    mainMenu.items[0].submenu.insert(1, new MenuItem({ type: 'separator' }))
    mainMenu.items[0].submenu.insert(2, new MenuItem({
      label: 'Toggle Developer Tools',
      role : 'toggledevtools',
    }))
  }

  Menu.setApplicationMenu(mainMenu)

  // Show tray icon
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click () {
        mainWindow.show()
      },
    },
    { type: 'separator' },
    {
      label: 'Start',
      click () {
        mainWindow.webContents.send('start')
      },
    },
    {
      label  : 'Stop',
      enabled: false,
      click () {
        mainWindow.webContents.send('stop')
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click () {
        app.isQuiting = true
        app.quit()
      },
    },
  ])

  tray = new Tray(path.join(__dirname, ICON))
  tray.setToolTip('Recta Print')
  tray.setContextMenu(trayMenu)

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    protocol: 'file',
    slashes : true,
    pathname: path.join(__dirname, '../html/index.html'),
  }))

  // Open the DevTools.
  if (flags.dev) {
    await installExtension(VUEJS_DEVTOOLS)
    mainWindow.webContents.openDevTools()
  }

  // Emitted when minimize clicked
  mainWindow.on('minimize', (e) => {
    e.preventDefault()

    mainWindow.hide()
  })

  // Emitted when close clicked
  mainWindow.on('close', (e) => {
    if (!app.isQuiting && !flags.testing) {
      e.preventDefault()

      mainWindow.hide()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  ipcMain.on('started', () => {
    trayMenu.items[2].enabled = false
    trayMenu.items[3].enabled = true

    tray.setContextMenu(trayMenu)
  })

  ipcMain.on('stoped', () => {
    trayMenu.items[2].enabled = true
    trayMenu.items[3].enabled = false

    tray.setContextMenu(trayMenu)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null)
    createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
