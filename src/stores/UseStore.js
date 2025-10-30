import { defineStore } from 'pinia'
import { ref } from 'vue'
import { connectWebSocket, disconnectWebSocket } from '@/utils/webSocket'

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
  const company = ref(null)

  // ===== 로그인 액션 =====
  const login = async (
    userData,
    userRole = 'USER',
    userCompanyId = null,
    userCompanySlug = null,
    companyInfo = null
  ) => {
    localStorage.clear()

    isLoggedIn.value = true
    user.value = userData
    role.value = userRole
    companyId.value = userCompanyId
    companySlug.value = userCompanySlug
    company.value = companyInfo

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('role', userRole)

    if (userCompanyId) {
      localStorage.setItem('companyId', userCompanyId.toString())
    }

    if (userCompanySlug) {
      localStorage.setItem('companySlug', userCompanySlug)
    }

    if (companyInfo) {
      localStorage.setItem('company', JSON.stringify(companyInfo))
    }

    if (authChannel) {
      authChannel.postMessage({
        type: 'LOGIN',
        role: userRole,
        companySlug: userCompanySlug,
        timestamp: Date.now(),
      })
    }

    try {
      await connectWebSocket()
    } catch (err) {
      // 웹소켓 연결 실패해도 진행
    }
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

    isLoggedIn.value = false
    user.value = null
    role.value = null
    companyId.value = null
    companySlug.value = null
    company.value = null

    localStorage.clear()

    if (notifyOtherTabs && authChannel) {
      authChannel.postMessage({
        type: 'LOGOUT',
        role: tempRole,
        timestamp: Date.now(),
      })
    }

    disconnectWebSocket()

    return tempSlug
  }

  // ===== 기업 정보 수정 액션 =====
  const updateCompany = (updatedCompanyData) => {
    if (!updatedCompanyData) return

    if (!company.value) {
      company.value = {}
    }

    company.value.id = updatedCompanyData.id ?? company.value.id
    company.value.name = updatedCompanyData.name ?? company.value.name
    company.value.logoUrl = updatedCompanyData.logoUrl ?? company.value.logoUrl
    company.value.companySlug = updatedCompanyData.companySlug ?? company.value.companySlug

    localStorage.setItem('company', JSON.stringify(company.value))
  }

  // ===== 인증 상태 복원 =====
  const checkAuth = async () => {
    const savedAuthState = localStorage.getItem('isLoggedIn')
    const savedUser = localStorage.getItem('user')
    const savedRole = localStorage.getItem('role')
    const savedCompanyId = localStorage.getItem('companyId')
    const savedCompanySlug = localStorage.getItem('companySlug')
    const savedCompany = localStorage.getItem('company')

    if (savedAuthState === 'true' && savedUser) {
      isLoggedIn.value = true
      user.value = JSON.parse(savedUser)
      role.value = savedRole || 'USER'
      companyId.value = savedCompanyId ? parseInt(savedCompanyId) : null
      companySlug.value = savedCompanySlug || null
      company.value = savedCompany ? JSON.parse(savedCompany) : null

      try {
        await connectWebSocket()
      } catch (err) {
        // 웹소켓 연결 실패해도 진행
      }
    } else {
      isLoggedIn.value = false
      user.value = null
      role.value = null
      companyId.value = null
      companySlug.value = null
      company.value = null
    }
  }

  // ===== 주기적 상태 검증 =====
  const syncWithLocalStorage = () => {
    const savedAuthState = localStorage.getItem('isLoggedIn')

    if (isLoggedIn.value && savedAuthState !== 'true') {
      forceLogout()
    }
  }

  const validateCompanyContext = (currentSlug) => {
    if (!isLoggedIn.value) {
      return true
    }

    return true
  }

  // ===== BroadcastChannel 메시지 핸들러 =====
  if (authChannel) {
    authChannel.onmessage = (event) => {
      const { type, role: eventRole } = event.data

      if (type === 'LOGIN') {
        if (isLoggedIn.value) {
          forceLogout()
        }
      } else if (type === 'LOGOUT') {
        if (isLoggedIn.value && role.value === eventRole) {
          forceLogout()
        }
      }
    }
  }

  // ===== 주기적 상태 검증 타이머 시작 =====
  if (typeof window !== 'undefined') {
    setInterval(syncWithLocalStorage, 1000) // 1초마다 검증
  }

  // ===== 강제 로그아웃 =====
  const forceLogout = () => {
    const tempSlug = companySlug.value
    const tempRole = role.value

    // 상태 초기화
    isLoggedIn.value = false
    user.value = null
    role.value = null
    companyId.value = null
    companySlug.value = null
    company.value = null

    // ✅ localStorage 완전 삭제
    localStorage.clear()

    // ✅ 페이지 리다이렉트
    import('vue-router').then(({ useRouter }) => {
      const router = useRouter()
      const currentPath = window.location.pathname

      if (currentPath.startsWith('/admin')) {
        router.push('/admin/login')
      } else if (currentPath.startsWith('/super')) {
        router.push('/super/login')
      } else if (currentPath.startsWith('/c/')) {
        const slug = tempSlug || currentPath.match(/\/c\/([^/]+)/)?.[1] || 'default'
        router.push(`/c/${slug}/`)
      } else {
        router.push('/')
      }
    })

    disconnectWebSocket()
  }

  return {
    isLoggedIn,
    user,
    role,
    companyId,
    companySlug,
    company,
    login,
    logout,
    forceLogout,
    checkAuth,
    validateCompanyContext,
    updateUser,
    updateCompany,
  }
})
