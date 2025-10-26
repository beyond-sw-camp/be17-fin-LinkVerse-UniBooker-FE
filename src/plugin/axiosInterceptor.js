/**
 * Axios 인터셉터 설정
 * - 요청/응답 인터셉터
 * - 쿠키 자동 전송 (withCredentials)
 * - 401 에러 시 자동 토큰 갱신
 * - Silent Auth 모드 지원 (헤더 인증 검증용)
 * - 에러 처리
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/UseStore'
import router from '@/router'

// ===== Axios 인스턴스 생성 =====

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 자동 전송 (CORS credentials)
})

// ===== 토큰 갱신 관련 변수 =====

/** 토큰 갱신 진행 중 여부 */
let isRefreshing = false

/** 토큰 갱신 대기 중인 요청 큐 */
let refreshSubscribers = []

/** 로그아웃 처리 진행 중 여부 (중복 방지) */
let isLoggingOut = false

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

// ===== 요청 인터셉터 =====

axiosInstance.interceptors.request.use(
  (config) => {
    // Authorization 헤더는 제거 (쿠키로 자동 전송됨)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ===== 응답 인터셉터 =====

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const currentPath = window.location.pathname

    // ===== 401 Unauthorized: 토큰 만료 또는 인증 실패 =====
    if (error.response?.status === 401) {
      
      // Silent Auth 모드 (헤더 인증 검증용)
      // - 알림 표시하지 않음
      // - 리다이렉트하지 않음
      // - 토큰 갱신 시도하지 않음
      if (originalRequest._silentAuth) {
        console.log('🔇 Silent Auth 실패 - 알림 없이 처리')
        return Promise.reject(error)
      }
      
      // 현재 페이지가 로그인/회원가입 페이지인 경우
      // - 알림 표시하지 않음
      // - 로그아웃 처리하지 않음
      if (currentPath.endsWith('/') || 
          currentPath.includes('/signup') ||
          currentPath.includes('/login')) {
        console.log('🔇 인증 페이지 - 401 알림 생략')
        return Promise.reject(error)
      }
      
      // 이미 로그아웃 처리 중이면 중복 실행 방지
      if (isLoggingOut) {
        return Promise.reject(error)
      }
      
      // 비밀번호 재설정 페이지는 예외 처리
      if (currentPath.includes('/admin/firstPassword')) {
        return Promise.reject(error)
      }

      // refresh 요청 자체가 실패한 경우 → 즉시 로그아웃
      if (originalRequest.url === '/api/auth/refresh') {
        console.error('🚫 Refresh Token 만료 - 로그아웃 처리')
        await handleLogout(currentPath)
        return Promise.reject(error)
      }

      // 이미 재시도한 요청이면 → 로그아웃
      if (originalRequest._retry) {
        console.error('🚫 토큰 갱신 후에도 401 발생 - 로그아웃 처리')
        await handleLogout(currentPath)
        return Promise.reject(error)
      }

      // 재시도 플래그 설정
      originalRequest._retry = true

      // ===== 토큰 갱신 로직 =====
      
      if (!isRefreshing) {
        // 최초 401 에러 발생 → refresh 시작
        isRefreshing = true
        console.log('🔄 Access Token 만료 감지 - Refresh Token으로 갱신 시도...')

        try {
          // /api/auth/refresh 호출
          await axiosInstance.post('/api/auth/refresh')
          
          console.log('✅ 토큰 갱신 성공 - 대기 중인 요청 재시도')
          isRefreshing = false
          
          // 대기 중인 모든 요청 재시도
          onRefreshed()
          
          // 원래 요청 재시도
          return axiosInstance(originalRequest)
          
        } catch (refreshError) {
          // refresh 실패 → 로그아웃
          console.error('❌ 토큰 갱신 실패:', refreshError)
          isRefreshing = false
          onRefreshFailed()
          await handleLogout(currentPath)
          return Promise.reject(refreshError)
        }
        
      } else {
        // 이미 다른 요청이 refresh 중 → 대기열에 추가
        console.log('⏳ 토큰 갱신 대기 중...')
        
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
      console.error('🚫 접근 권한이 없습니다.')
      alert('접근 권한이 없습니다.')
    }

    // ===== 500 Internal Server Error =====
    if (error.response?.status === 500) {
      console.error('💥 서버 오류가 발생했습니다.')
    }

    return Promise.reject(error)
  }
)

// ===== 헬퍼 함수 =====

/**
 * 로그아웃 처리 및 리다이렉트 (중복 방지)
 * - Store 초기화
 * - localStorage 완전 삭제
 * - 권한별 로그인 페이지로 리다이렉트
 * - 알림 표시 (한 번만)
 */
const handleLogout = async (currentPath) => {
  // 중복 실행 방지
  if (isLoggingOut) {
    return
  }
  
  isLoggingOut = true
  
  try {
    const authStore = useAuthStore()
    
    // Store의 logout() 호출 (리다이렉트용 slug 반환)
    const tempSlug = authStore.logout()
    
    // localStorage 완전 삭제 (중복 보장)
    localStorage.clear()
    
    // 알림 표시 (한 번만)
    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
    
    // 권한별 리다이렉트
    if (currentPath.startsWith('/admin')) {
      await router.push('/admin/login')
    } else if (currentPath.startsWith('/super')) {
      await router.push('/super/login')
    } else if (currentPath.startsWith('/c/')) {
      // 일반 사용자: 로그아웃 전 slug 사용
      const slug = tempSlug || currentPath.match(/\/c\/([^/]+)/)?.[1] || 'default'
      await router.push(`/c/${slug}/`)
    } else {
      await router.push('/')
    }
    
  } finally {
    // 일정 시간 후 플래그 초기화 (다음 로그아웃 허용)
    setTimeout(() => {
      isLoggingOut = false
    }, 1000)
  }
}

export default axiosInstance