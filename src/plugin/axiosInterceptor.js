/**
 * Axios 인터셉터 설정
 * - 요청/응답 인터셉터
 * - 쿠키 자동 전송 (withCredentials)
 * - 401 에러 시 자동 토큰 갱신
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

// ========== 토큰 갱신 관련 변수 ==========

/** 토큰 갱신 진행 중 여부 */
let isRefreshing = false

/** 토큰 갱신 대기 중인 요청 큐 */
let refreshSubscribers = []

/**
 * 토큰 갱신 완료 후 대기 중인 요청들 재시도
 */
const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback())
  refreshSubscribers = []
}

/**
 * 토큰 갱신 실패 시 대기 중인 요청들 거부
 */
const onRefreshFailed = () => {
  refreshSubscribers = []
}

/**
 * 대기 중인 요청을 큐에 추가
 */
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

// ========== 요청 인터셉터 ==========

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

// ========== 응답 인터셉터 ==========

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const currentPath = window.location.pathname

    // ===== 401 Unauthorized: 토큰 만료 또는 인증 실패 =====
    if (error.response?.status === 401) {
      
      // 비밀번호 재설정 페이지는 예외 처리 (기존 로직 유지)
      if (currentPath.includes('/admin/firstPassword')) {
        return Promise.reject(error)
      }

      // refresh 요청 자체가 실패한 경우 → 즉시 로그아웃
      if (originalRequest.url === '/api/auth/refresh') {
        console.error('Refresh Token 만료 - 로그아웃 처리')
        handleLogout(currentPath)
        return Promise.reject(error)
      }

      // 이미 재시도한 요청이면 → 로그아웃
      if (originalRequest._retry) {
        console.error('토큰 갱신 후에도 401 발생 - 로그아웃 처리')
        handleLogout(currentPath)
        return Promise.reject(error)
      }

      // 재시도 플래그 설정
      originalRequest._retry = true

      // ===== 토큰 갱신 로직 =====
      
      if (!isRefreshing) {
        // 최초 401 에러 발생 → refresh 시작
        isRefreshing = true
        console.log('Access Token 만료 감지 - Refresh Token으로 갱신 시도...')

        try {
          // /api/auth/refresh 호출 (백엔드 Phase 2에서 생성된 공통 엔드포인트)
          await axiosInstance.post('/api/auth/refresh')
          
          console.log('토큰 갱신 성공 - 대기 중인 요청 재시도')
          isRefreshing = false
          
          // 대기 중인 모든 요청 재시도
          onRefreshed()
          
          // 원래 요청 재시도
          return axiosInstance(originalRequest)
          
        } catch (refreshError) {
          // refresh 실패 → 로그아웃
          console.error('토큰 갱신 실패:', refreshError)
          isRefreshing = false
          onRefreshFailed()
          handleLogout(currentPath)
          return Promise.reject(refreshError)
        }
        
      } else {
        // 이미 다른 요청이 refresh 중 → 대기열에 추가
        console.log('토큰 갱신 대기 중...')
        
        return new Promise((resolve, reject) => {
          addRefreshSubscriber(() => {
            // refresh 성공 시 원래 요청 재시도
            axiosInstance(originalRequest)
              .then(resolve)
              .catch(reject)
          })
        })
      }
    }

    // ===== 403 Forbidden: 권한 없음 =====
    if (error.response?.status === 403) {
      console.error('접근 권한이 없습니다.')
      alert('접근 권한이 없습니다.')
    }

    // ===== 500 Internal Server Error =====
    if (error.response?.status === 500) {
      console.error('서버 오류가 발생했습니다.')
    }

    return Promise.reject(error)
  }
)

// ========== 헬퍼 함수 ==========

/**
 * 로그아웃 처리 및 리다이렉트
 */
const handleLogout = (currentPath) => {
  const authStore = useAuthStore()
  authStore.logout()
  alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
  
  // 권한별 리다이렉트
  if (currentPath.startsWith('/admin')) {
    window.location.href = '/admin/login'
  } else if (currentPath.startsWith('/super')) {
    window.location.href = '/super/login'
  } else if (currentPath.startsWith('/c/')) {
    // 일반 사용자: 현재 company slug 유지
    const slugMatch = currentPath.match(/\/c\/([^/]+)/)
    const slug = slugMatch ? slugMatch[1] : ''
    window.location.href = `/c/${slug}/`
  } else {
    window.location.href = '/'
  }
}

export default axiosInstance