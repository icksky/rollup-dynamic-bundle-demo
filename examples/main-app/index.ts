import { createApp } from 'vue'
import App from './app.vue'
import { setupMicroApp } from '@/index'

createApp(App).mount('#app')
setupMicroApp()
