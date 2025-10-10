import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// 전역 스타일
import './app.css'
// 버튼 컴포넌트 전역 등록
import Button from './components/Button.vue'

// CSS imports
import './assets/styles/tailwind.css'
import './assets/styles/index.css'

const app = createApp(App)

// 버튼 컴포넌트 전역 등록
app.component('Button', Button)
app.use(createPinia())
app.use(router)

app.mount('#app')

