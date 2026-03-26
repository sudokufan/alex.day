import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import draftsPlugin from './src/vite-plugin-drafts'
import { copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    tailwindcss(),
    draftsPlugin(),
    react(),
    {
      name: 'copy-index-to-404',
      closeBundle() {
        const dist = resolve(__dirname, 'dist')
        if (existsSync(resolve(dist, 'index.html'))) {
          copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
        }
      },
    },
  ],
})
