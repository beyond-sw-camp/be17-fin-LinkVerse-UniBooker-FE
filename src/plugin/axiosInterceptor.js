/**
 * Axios 인터셉터 설정
 * - 요청/응답 인터셉터
 * - 쿠키 자동 전송 (withCredentials)
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
  withCredentials: true, // 쿠키 자동 전송 (CORS credentials)
})

// 요청 인터셉터: 추가 설정 (필요시)
axiosInstance.interceptors.request.use(
  (config) => {
    // Authorization 헤더는 제거 (쿠키로 자동 전송됨)
    // 필요한 경우 다른 헤더 추가 가능
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
      
      // ✅ 현재 페이지가 비밀번호 재설정 페이지가 아닐 때만 로그아웃 처리
      const currentPath = window.location.pathname
      
      if (!currentPath.includes('/admin/firstPassword')) {
        authStore.logout()
        alert('로그인이 필요합니다.')
        
        // 관리자 페이지면 관리자 로그인으로, 아니면 홈으로
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/admin/login'
        } else {
          window.location.href = '/'
        }
      }
    }

    // 403 Forbidden: 권한 없음
    if (error.response?.status === 403) {
      console.error('접근 권한이 없습니다.')
      alert('접근 권한이 없습니다.')
    }

    // 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('서버 오류가 발생했습니다.')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance