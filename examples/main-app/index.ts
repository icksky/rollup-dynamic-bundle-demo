import { createApp } from 'vue'
import microApp from '@micro-zoe/micro-app'
import App from './app.vue'
import { setupMicroApp } from '@/index'

createApp(App).mount('#app')
setupMicroApp(microApp)
