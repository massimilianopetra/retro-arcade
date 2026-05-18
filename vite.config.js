import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // Se compili per l'online usa la sottocartella, altrimenti usa la radice locale
    base: command === 'build' ? '/retro-arcade/' : '/',
  }
})
