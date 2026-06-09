import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      ignored: ['**/server/**'],
    },
    proxy: {
      '/api': {
        target: 'https://visiting-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
