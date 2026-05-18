import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // Riconosce automaticamente se sei sul PC in locale o se compili per GitHub online
    base: command === 'build' ? '/retro-arcade/' : '/',
  }
})
