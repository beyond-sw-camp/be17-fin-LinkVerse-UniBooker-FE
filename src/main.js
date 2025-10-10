import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 버튼, 인풋 컴포넌트 전역 등록
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'

// CSS imports
import './assets/styles/index.css'

const app = createApp(App)

app.component('Button', Button)
app.component('Input', Input)

app.use(createPinia())
app.use(router)
app.mount('#app')