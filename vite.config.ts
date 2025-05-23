// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  // env ファイルも含めて読み込む
  const env = loadEnv(mode, process.cwd(), '')

  // Vercel のビルド環境では VERCEL=1 が渡されます
  const isVercel = env.VERCEL === '1'

  // 開発サーバー時は常にルート '/', ビルド時だけ GitHub Pages 用に '/Connect4/'
  const base =
    command === 'serve'
      ? '/'
      : isVercel
        ? '/'
        : '/Connect4/'

  return {
    base,
    plugins: [vue()],
  }
})
