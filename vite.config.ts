import preact from '@preact/preset-vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import rewriteAll from 'vite-plugin-rewrite-all'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    // devtools({
    //   autoname: true,
    // }),
    preact(),
    tsconfigPaths(),
    // NOTE - fixes '.' in URLs issue: https://github.com/remix-run/react-router/issues/2143
    rewriteAll(),
    Icons({ compiler: 'jsx', jsx: 'preact' }),
  ],

  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },

  optimizeDeps: {
    include: ['preact/devtools', 'preact/debug', 'preact/jsx-dev-runtime'],
  },

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
