import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
