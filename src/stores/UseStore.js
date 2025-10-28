import { defineStore } from 'pinia'
import { ref } from 'vue'
import { connectWebSocket } from '@/utils/webSocket'

// ===== BroadcastChannel 생성 =====
const authChannel =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('unibooker-auth') : null

export const useAuthStore = defineStore('auth', () => {
  // ===== 상태 =====
  const isLoggedIn = ref(false)
  const user = ref(null)
  const role = ref(null)
  const companyId = ref(null)
  const companySlug = ref(null)

  // ===== 로그인 액션 =====
  const login = (userData, userRole = 'USER', userCompanyId = null, userCompanySlug = null) => {
    // 1. 기존 상태 초기화
    localStorage.clear()

    // 2. 새로운 상태 설정
    isLoggedIn.value = true
    user.value = userData
    role.value = userRole
    companyId.value = userCompanyId
    companySlug.value = userCompanySlug

    // 3. localStorage에 저장
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('role', userRole)

    if (userCompanyId) {
      localStorage.setItem('companyId', userCompanyId.toString())
    }

    if (userCompanySlug) {
      localStorage.setItem('companySlug', userCompanySlug)
    }

    // 4. 다른 탭에 로그인 알림
    if (authChannel) {
      authChannel.postMessage({
        type: 'LOGIN',
        role: userRole,
        companySlug: userCompanySlug,
        timestamp: Date.now(),
      })
      console.log('다른 탭에 로그인 이벤트 전송:', { role: userRole, slug: userCompanySlug })
    }

    console.log('로그인 완료:', {
      isLoggedIn: isLoggedIn.value,
      role: role.value,
      companySlug: companySlug.value,
    })
  }

  // ===== 정보 수정 액션 =====
  const updateUser = (updatedData) => {
    if (!updatedData || !updatedData.data) return

    const data = updatedData.data

    if (!user.value) {
      user.value = {}
    }

    user.value.userId = data.id ?? user.value.userId
    user.value.name = data.name ?? user.value.name
    user.value.email = data.email ?? user.value.email

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    storedUser.userId = user.value.userId
    storedUser.name = user.value.name
    storedUser.email = user.value.email
    localStorage.setItem('user', JSON.stringify(storedUser))
  }

  // ===== 로그아웃 액션 =====
  const logout = (notifyOtherTabs = true) => {
    const tempSlug = companySlug.value
    const tempRole = role.value

    // 1. 상태 초기화
    isLoggedIn.value = false
    user.value = null
    role.value = null
    companyId.value = null
    companySlug.value = null

    // 2. localStorage 삭제
    localStorage.clear()

    // 3. 다른 탭에 로그아웃 알림 (선택적)
    if (notifyOtherTabs && authChannel) {
      authChannel.postMessage({
        type: 'LOGOUT',
        role: tempRole,
        timestamp: Date.now(),
      })
      console.log('다른 탭에 로그아웃 이벤트 전송')
    }

    console.log('로그아웃 완료')

    return tempSlug
  }

  // ===== 인증 상태 복원 =====
  const checkAuth = async () => {
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

      console.log('인증 상태 복원:', {
        isLoggedIn: isLoggedIn.value,
        role: role.value,
        companySlug: companySlug.value,
      })

      try {
        await connectWebSocket()
        console.log('🛰️ 웹소켓 자동 재연결 완료')
      } catch (err) {
        console.error('❌ 웹소켓 재연결 실패:', err)
      }
    } else {
      // localStorage 없으면 로그아웃 상태
      isLoggedIn.value = false
      user.value = null
      role.value = null
      companyId.value = null
      companySlug.value = null

      console.log('저장된 인증 상태 없음')
    }
  }

  // ===== 주기적 상태 검증 (좀비 세션 방지) =====
  const syncWithLocalStorage = () => {
    const savedAuthState = localStorage.getItem('isLoggedIn')

    // localStorage가 없는데 메모리는 로그인 상태 → 강제 로그아웃
    if (isLoggedIn.value && savedAuthState !== 'true') {
      console.warn('localStorage 불일치 감지 - 강제 로그아웃')
      forceLogout()
    }
  }

  const validateCompanyContext = (currentSlug) => {
    if (!isLoggedIn.value) {
      return true
    }

    if (companySlug.value && companySlug.value !== currentSlug) {
      console.warn('Company Slug 불일치 감지:', {
        saved: companySlug.value,
        current: currentSlug,
      })
    }

    return true
  }

  // ===== BroadcastChannel 메시지 핸들러 =====
  if (authChannel) {
    authChannel.onmessage = (event) => {
      const { type, role: eventRole, companySlug: eventSlug, timestamp } = event.data

      console.log('BroadcastChannel 메시지 수신:', event.data)

      if (type === 'LOGIN') {
        // 다른 탭에서 로그인 → 현재 탭이 로그인 상태면 강제 로그아웃
        if (isLoggedIn.value) {
          console.warn('다른 계정 로그인 감지 - 현재 세션 무효화')
          forceLogout()
        }
      } else if (type === 'LOGOUT') {
        // 다른 탭에서 로그아웃 → 같은 역할이면 강제 로그아웃
        if (isLoggedIn.value && role.value === eventRole) {
          console.warn('같은 역할 로그아웃 감지 - 현재 세션 무효화')
          forceLogout()
        }
      }
    }
  }

  // ===== 주기적 상태 검증 타이머 시작 =====
  if (typeof window !== 'undefined') {
    setInterval(syncWithLocalStorage, 1000) // 1초마다 검증
  }

  // ===== 강제 로그아웃 (다른 탭/서버 검증 실패 시) =====
  const forceLogout = () => {
    isLoggedIn.value = false
    user.value = null
    role.value = null
    companyId.value = null
    companySlug.value = null

    console.log('강제 로그아웃 - 세션 무효화')
  }

  return {
    isLoggedIn,
    user,
    role,
    companyId,
    companySlug,
    login,
    logout,
    forceLogout,
    checkAuth,
    validateCompanyContext,
    updateUser,
  }
})
