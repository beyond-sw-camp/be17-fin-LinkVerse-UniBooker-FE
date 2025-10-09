import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 전역 스타일
import './app.css'
import Button from '@/components/Button.vue' // 버튼 컴포넌트 전역 등록
import Input from '@/components/Input.vue' // input 컴포넌트 전역 등록

const app = createApp(App)

app.component('Button', Button) // 버튼 컴포넌트 전역 등록
app.component('Input', Input) // 버튼 컴포넌트 전역 등록

app.use(createPinia())
app.use(router)
app.mount('#app')