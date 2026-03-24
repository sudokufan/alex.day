import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import draftsPlugin from './src/vite-plugin-drafts'

export default defineConfig({
  plugins: [tailwindcss(), draftsPlugin(), react()],
})
