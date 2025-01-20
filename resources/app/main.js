const electron = require('electron')
const {app, BrowserWindow} = electron
const electronReload = require('electron-reload')

const path = require('path')
const url = require('url')

let win



function createWindow(){
	win = new BrowserWindow ({width: 1280, height:720})
	win.setMenuBarVisibility(false)
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true
	}))

	//win.webContents.openDevTools()
}

app.on('ready', createWindow)




