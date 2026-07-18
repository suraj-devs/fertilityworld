import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: rootDir,
  resolve: {
    alias: {
      '~bootstrap': path.resolve(rootDir, 'node_modules/bootstrap'),
    },
  },
  server: {
    port: 8080,
    hot: true,
  },
  watch: {
    ignored: ['**/public/assets/fonts/**'],
  },
})