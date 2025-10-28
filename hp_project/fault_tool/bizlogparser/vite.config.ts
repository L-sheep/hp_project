// vite.config.ts
import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      },
    },
    plugins: [
      react(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: 'electron/main/index.ts',
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              args.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                // 外部化所有依赖，包括 ssh2
                external: [
                  ...Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
                  'ssh2',  // 添加 ssh2 为外部依赖
                ],
              },
            },
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`。
          // Preload 脚本可能包含 Web 资产，因此使用 `build.rollupOptions.input` 代替 `build.lib.entry`。
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                // 外部化所有依赖，包括 ssh2
                external: [
                  ...Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
                  'ssh2',  // 添加 ssh2 为外部依赖
                ],
              },
            },
          },
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // 如果你想在渲染进程中使用 Node.js，`nodeIntegration` 需要在主进程中启用。
        // 详情 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {},
      }),
    ],
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        host: url.hostname,
        port: +url.port,
      }
    })(),
    clearScreen: false,
  }
})
