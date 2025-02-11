import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import type { Router } from 'vue-router'

import App from './App.vue'
import router from './router'
import { setRouter } from './utils/navigation'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
setRouter(router as Router)

// Wrap initialization in an async IIFE
;(async () => {
  try {
    const authStore = useAuthStore(pinia)
    await authStore.initializeAuth()
    app.mount('#app')
  } catch (error) {
    console.error('Failed to initialize app:', error)
    // Mount the app anyway to show error states/login screen
    app.mount('#app')
  }
})()
