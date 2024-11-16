import vuetify from './utils/vuetify'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia();
app.use(pinia).use(vuetify).use(router).mount('#app')
