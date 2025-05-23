import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vercel 上では process.env.VERCEL が "1" になる想定
const isVercel = !!process.env.VERCEL

export default defineConfig(({ command }) => ({
  base:
    // 開発サーバー（npm run dev）とプレビュー（npm run preview）のときはルート配下
    command === 'serve'
      ? '/'
      // ビルド（npm run build）して GitHub Pages に deploy するときのみ `/Connect4/`
      : isVercel
        ? '/'        // Vercel 本番はルート
        : '/Connect4/',
  plugins: [vue()],
}))
