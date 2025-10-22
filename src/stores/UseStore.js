import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // ===== 상태 =====
  
  const isLoggedIn = ref(false)
  const user = ref(null)
  const role = ref(null)
  const companyId = ref(null)
  const companySlug = ref(null)

  // ===== 로그인 액션 =====
  
  /**
   * 로그인 처리
   * - 사용자 정보 저장 (토큰은 쿠키로 자동 관리됨)
   */
  const login = (userData, userRole = 'USER', userCompanyId = null, userCompanySlug = null) => {
    isLoggedIn.value = true
    user.value = userData
    role.value = userRole
    companyId.value = userCompanyId
    companySlug.value = userCompanySlug

    // localStorage에 저장 (토큰 제외)
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('role', userRole)
    
    if (userCompanyId) {
      localStorage.setItem('companyId', userCompanyId.toString())
    }
    
    if (userCompanySlug) {
      localStorage.setItem('companySlug', userCompanySlug)
    }

    console.log('로그인 완료:', { 
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
   * - 쿠키는 서버에서 삭제됨
   */
  const logout = () => {
    isLoggedIn.value = false
    user.value = null
    role.value = null
    companyId.value = null
    // companySlug는 로그아웃 후 리다이렉트에 사용하므로 유지

    // localStorage 제거
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    localStorage.removeItem('companyId')
    // companySlug는 유지

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
    const savedCompanyId = localStorage.getItem('companyId')
    const savedCompanySlug = localStorage.getItem('companySlug')

    if (savedAuthState === 'true' && savedUser) {
      isLoggedIn.value = true
      user.value = JSON.parse(savedUser)
      role.value = savedRole || 'USER'
      companyId.value = savedCompanyId ? parseInt(savedCompanyId) : null
      companySlug.value = savedCompanySlug || null

      console.log('♻️ 인증 상태 복원:', { 
        isLoggedIn: isLoggedIn.value, 
        role: role.value,
        companyId: companyId.value,
        companySlug: companySlug.value 
      })
    } else {
      console.log('저장된 인증 상태 없음')
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
      console.warn('다른 회사 페이지 접근 감지 - 로그아웃 처리:', {
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
    companyId,
    companySlug,
    login,
    logout,
    checkAuth,
    validateCompanyContext  
  }
})