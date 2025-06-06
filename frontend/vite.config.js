import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/quiz': 'http://localhost:5000',  // Proxy /quiz API calls to backend
      '/api': 'http://localhost:5000',   // Proxy other API calls if any
    },
  },
})
