import { app, BrowserWindow, shell, ipcMain, screen } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { sshConnect, executeCommand, sshDisconnect } from './ssh'
import { update } from './update'
import { unpackTarFromBuffer, readDirRecursive, readFileContent } from './fs'
import { filterStateFlow } from './regex'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  // 1. 取主显示器可用区域尺寸
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;

  // 2. 让窗口高度占屏幕高度 75 %，并按 4:3 算出宽度
  const winH = Math.round(sh * 0.75);
  const winW = Math.round(winH * 4 / 3);

  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    frame: false,            // 整个窗口无边框（包括默认的 titlebar）
    autoHideMenuBar: true,   // 隐藏 “Alt” 才出现的菜单
    // width:  winW,
    // height: winH,
    center: true,          // 初次显示即居中
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)

  // 自定义菜单
  ipcMain.on('window-minimize', () => win?.minimize());
  ipcMain.on('window-maximize', () => win?.maximize());
  ipcMain.on('window-unmaximize', () => win?.unmaximize());
  ipcMain.on('window-close', () => win?.close());

  ipcMain.handle('window-is-maximized', () => win?.isMaximized());

  win.on('maximize', () => win?.webContents.send('window-maximized'));
  win.on('unmaximize', () => win?.webContents.send('window-unmaximized'));
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// 处理SSH连接请求
ipcMain.handle('ssh-connect', async (event, { host, username, password }) => {
  try {
    const result = await sshConnect(host, username, password);
    return result;
  } catch (error) {
    return `Error: ${error}`;
  }
});

// 处理执行命令请求
ipcMain.handle('execute-command', async (event, { command }) => {
  try {
    const result = await executeCommand(command);
    return result;
  } catch (error) {
    return `Error: ${error}`;
  }
});

// 处理SSH断开连接请求
ipcMain.handle('ssh-disconnect', () => {
  return sshDisconnect();
});

// 处理解压缩
ipcMain.handle('unpack-tar-buffer', async (_event, buffer: Uint8Array, destPath: string) => {
  try {
    await unpackTarFromBuffer(buffer, destPath);
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
});

// 读取目录所有文件路径
ipcMain.handle('read-dir-recursive', async (_e, dirPath: string) => {
  try {
    return { success: true, data: await readDirRecursive(dirPath) };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
});

// 读取文件内容
ipcMain.handle('read-file-content', async (_e, filePath: string) => {
  try {
    return { success: true, data: await readFileContent(filePath) };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
});

// 筛选状态流程
ipcMain.handle('filter-state-flow', async (_e, fileContent: string) => {
  try {
    return { success: true, data: await filterStateFlow(fileContent) };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
});