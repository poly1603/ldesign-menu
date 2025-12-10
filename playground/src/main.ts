import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'

// 导入菜单样式
import '@ldesign/menu-vue/styles/index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
