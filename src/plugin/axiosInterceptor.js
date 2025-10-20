/**
 * Axios 인터셉터 설정
 * - 요청/응답 인터셉터
 * - 토큰 자동 첨부
 * - 에러 처리
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/UseStore'

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: Authorization 헤더 자동 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 에러 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 401 Unauthorized: 토큰 만료 또는 인증 실패
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      
      // 로그인 페이지로 리다이렉트 (선택사항)
      // window.location.href = '/admin/login'
    }

    // 403 Forbidden: 권한 없음
    if (error.response?.status === 403) {
      console.error('접근 권한이 없습니다.')
    }

    // 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('서버 오류가 발생했습니다.')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance