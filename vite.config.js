import { defineConfig } from 'vite'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['calculator.ico', 'robots.txt', 'calculator_120.png', 'calculator_180.png'],  
      manifest: {
        name: 'Vue Calculator',
        short_name: 'Calculator',
        description: 'A calculator built with Vue3',
        start_url: '/vue-calculator/',
        display: 'standalone',
        background_color: '#EFF6FF',
        theme_color: '#EFF6FF',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'calculator.ico',
            sizes: '16x16 32x32 48x48 64x64 96x96 128x128'
          },
          {
            src: 'calculator_72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'calculator_144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'calculator_152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: 'calculator_384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'calculator_192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'calculator_256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'calculator_512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: process.env.NODE_ENV === 'production' ? '/vue-calculator/' : '/',
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
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/mixins.scss";`
      }
    }
  }
})
