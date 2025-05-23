// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(() => {
  // Vercel 上では import.meta.env.VERCEL が "1" など truthy
  const isVercel = Boolean(import.meta.env.VERCEL)
  return {
    base: isVercel ? '/' : '/Connect4/',
    plugins: [vue()],
  }
})
