import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'public',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://usermanagementsystem-z2sv.onrender.com', // Your backend server address
        changeOrigin: true,
      },
    },
  },
})





