// src/stores/UseStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 상태
  const isLoggedIn = ref(false)
  const user = ref(null)

  // 액션
  const login = (userData) => {
    isLoggedIn.value = true
    user.value = userData
    // 실제로는 localStorage에 토큰 저장 등의 로직 추가
    localStorage.setItem('isLoggedIn', 'true')
  }

  const logout = () => {
    isLoggedIn.value = false
    user.value = null
    localStorage.removeItem('isLoggedIn')
    // 실제로는 토큰 제거 등의 로직 추가
  }

  const checkAuth = () => {
    // 페이지 새로고침 시 로그인 상태 복원
    const savedAuthState = localStorage.getItem('isLoggedIn')
    if (savedAuthState === 'true') {
      isLoggedIn.value = true
      // 실제로는 토큰 검증 등의 로직 추가
    }
  }

  return {
    isLoggedIn,
    user,
    login,
    logout,
    checkAuth
  }
})