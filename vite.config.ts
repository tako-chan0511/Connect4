// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  // `mode` は 'development' や 'production'（Vercel では production）
  // ここで .env や .env.production の内容を読み込み
  const env = loadEnv(mode, process.cwd(), '')

  // Vercel 上では process.env.VERCEL に "1" がセットされる
  const isVercel = env.VERCEL === '1'

  // 開発サーバーでは必ずルート
  if (command === 'serve') {
    return {
      base: '/',
      plugins: [vue()],
    }
  }

  // build 時
  return {
    // Vercel: '/', GitHub Pages: '/Connect4/'
    base: isVercel ? '/' : '/Connect4/',
    plugins: [vue()],
  }
})
