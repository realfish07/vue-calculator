import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import './styles/index.scss'
import App from './App.vue'

const intervalMS = 60 * 60 * 1000

// check the service worker every hour
const updateSW = registerSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})

createApp(App).mount('#app')
updateSW()
