// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',      // ← ここを絶対パスから相対パスに
  plugins: [vue()],
})
