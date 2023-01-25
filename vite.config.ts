import solidLabels from 'babel-plugin-solid-labels'
import devtools from 'solid-devtools/vite'
import solidStart from 'solid-start/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    devtools({
      autoname: true,
      locator: {
        targetIDE: 'vscode',
        componentLocation: true,
        jsxLocation: true,
      },
    }),
    solidStart({
      ssr: false,
      babel: {
        plugins: [[solidLabels, { dev: process.env.NODE_ENV !== 'production' }]],
      },
    }),
    Icons({ compiler: 'solid' }),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
