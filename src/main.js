import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/UseStore'

// 전역 스타일
import './app.css'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Modal from '@/components/Modal.vue'

const app = createApp(App)

app.component('Button', Button)
app.component('Input', Input)
app.component('Modal', Modal)

// Pinia 먼저 등록
const pinia = createPinia()
app.use(pinia)

// Store 초기화 (Router Guard 실행 전에 인증 상태 복원)
const authStore = useAuthStore()
authStore.checkAuth()

// Router 등록 (Store 초기화 후)
app.use(router)

app.mount('#app')
