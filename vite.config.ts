// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages では /Connect4/、それ以外（Vercel やローカルプレビュー）ではルート参照
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/Connect4/',
  plugins: [vue()],
})
