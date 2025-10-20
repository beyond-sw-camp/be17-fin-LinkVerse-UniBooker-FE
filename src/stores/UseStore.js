import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // ===== 상태 =====
  
  const isLoggedIn = ref(false)
  const user = ref(null)
  const role = ref(null)
  const token = ref(null)
  const accessToken = ref(null)
  const companyId = ref(null)          // 추가: 기업 ID
  const companySlug = ref(null)        // 추가: 기업 Slug

  // ===== 로그인 액션 =====
  
  /**
   * 로그인 처리
   * - 사용자 정보 및 토큰 저장
   * - companyId, companySlug 저장
   */
  const login = (userData, userRole = 'USER', userCompanyId = null, userCompanySlug = null, userAccessToken = null) => {
    isLoggedIn.value = true
    user.value = userData
    role.value = userRole
    token.value = userData.token || null
    accessToken.value = userAccessToken
    companyId.value = userCompanyId
    companySlug.value = userCompanySlug

    // localStorage에 저장
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('role', userRole)

    if (userAccessToken) {
    localStorage.setItem('accessToken', userAccessToken)
    }
    
    if (userData.token) {
      localStorage.setItem('token', userData.token)
    }
    
    if (userCompanyId) {
      localStorage.setItem('companyId', userCompanyId.toString())
    }
    
    if (userCompanySlug) {
      localStorage.setItem('companySlug', userCompanySlug)
    }

    console.log('🔐 로그인 완료:', { 
      isLoggedIn: isLoggedIn.value, 
      role: role.value,
      companyId: companyId.value,
      companySlug: companySlug.value 
    })
  }

  // ===== 로그아웃 액션 =====
  
  /**
   * 로그아웃 처리
   * - 모든 상태 초기화
   * - companySlug는 유지 (로그아웃 후 리다이렉트용)
   */
  const logout = () => {
    isLoggedIn.value = false
    user.value = null
    role.value = null
    token.value = null
    companyId.value = null
    // companySlug는 로그아웃 후 리다이렉트에 사용하므로 유지

    // localStorage 제거
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('companyId')
    // companySlug는 유지
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('userInfo')

    console.log('🚪 로그아웃 완료 (companySlug 유지:', companySlug.value, ')')
  }

  // ===== 인증 상태 복원 =====
  
  /**
   * 인증 상태 복원 (페이지 새로고침 시)
   */
  const checkAuth = () => {
    const savedAuthState = localStorage.getItem('isLoggedIn')
    const savedUser = localStorage.getItem('user')
    const savedRole = localStorage.getItem('role')
    const savedToken = localStorage.getItem('token')
    const savedCompanyId = localStorage.getItem('companyId')
    const savedCompanySlug = localStorage.getItem('companySlug')

    if (savedAuthState === 'true' && savedUser) {
      isLoggedIn.value = true
      user.value = JSON.parse(savedUser)
      role.value = savedRole || 'USER'
      token.value = savedToken || null
      companyId.value = savedCompanyId ? parseInt(savedCompanyId) : null
      companySlug.value = savedCompanySlug || null

      console.log('♻️ 인증 상태 복원:', { 
        isLoggedIn: isLoggedIn.value, 
        role: role.value,
        companyId: companyId.value,
        companySlug: companySlug.value 
      })
    } else {
      console.log('❌ 저장된 인증 상태 없음')
    }
  }

/**
 * 현재 URL의 companySlug와 저장된 companySlug 비교
 * - 다르면 자동 로그아웃
 */
const validateCompanyContext = (currentSlug) => {
  // 로그인 상태가 아니면 검증 불필요
  if (!isLoggedIn.value) {
    return true
  }

  // 저장된 companySlug와 현재 URL의 slug가 다르면 로그아웃
  if (companySlug.value && companySlug.value !== currentSlug) {
    console.warn('⚠️ 다른 회사 페이지 접근 감지 - 로그아웃 처리:', {
      saved: companySlug.value,
      current: currentSlug
    })
    logout()
    return false
  }

  return true
}

return {
  isLoggedIn,
  user,
  role,
  token,
  accessToken,
  companyId,
  companySlug,
  login,
  logout,
  checkAuth,
  validateCompanyContext  
}
})