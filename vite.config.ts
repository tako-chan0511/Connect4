import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vercel上では process.env.VERCEL が "1" になります
const isVercel = !!process.env.VERCEL

export default defineConfig(({ command }) => {
  return {
    base:
      command === 'serve'
        ? '/'                      // 開発サーバー時は絶対パス
        : isVercel
          ? '/'                    // Vercel 本番ビルド時はルート配下
          : '/Connect4/',          // GitHub Pages 時
    plugins: [vue()],
  }
})
