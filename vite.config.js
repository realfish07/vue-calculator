import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [vue()],
    base: process.env.PROD ? '/vue-calculator/' : '/',
    server: {
      port: 8081,
      open: true,
      host: '0.0.0.0',
      hmr: {
        overlay: true // display server error overlay
      }
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, 'src')
        }
      ]
    }
  })
}
