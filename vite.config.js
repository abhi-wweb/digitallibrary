import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",            // 👈 VERY IMPORTANT for hosting
  plugins: [react()],
  build: {
    outDir: "dist",     // ensure build goes to "dist"
  },
})
