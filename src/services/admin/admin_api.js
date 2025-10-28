/**
 * 관리자(Admin) 관련 API 서비스
 * - 관리자 회원가입
 * - 사업자등록번호 중복 확인
 * - Company Slug 중복 확인
 * - 이메일 중복 확인
 * - 회원가입 승인 상태 조회
 */

import axiosInstance from '@/plugin/axiosInterceptor'

/**
 * 관리자 회원가입 신청
 */
const signUpAdmin = async (formData) => {
  return await axiosInstance.post('/api/admins/signup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 사업자등록번호 중복 확인
 */
const checkBusinessNumber = async (businessNumber) => {
  return await axiosInstance.get('/api/companies/check-business-number', {
    params: { businessNumber }
  })
}

/**
 * Company Slug 중복 확인
 */
const checkSlug = async (slug) => {
  return await axiosInstance.get('/api/companies/check-slug', {
    params: { slug }
  })
}

/**
 * 이메일 중복 확인
 */
const checkEmail = async (email) => {
  return await axiosInstance.get('/api/admins/check-email', {
    params: { email }
  })
}

/**
 * 회원가입 승인 상태 조회
 */
const getSignUpStatus = async (email) => {
  return await axiosInstance.get('/api/admins/status', {
    params: { email }
  })
}

/**
 * 관리자 로그인
 */
const login = async (loginData) => {
  return await axiosInstance.post('/api/admins/login', loginData)
}

/**
 * 비밀번호 재설정
 */
const resetPassword = async (payload) => {
  try {
    const response = await axiosInstance.patch('/api/admins/password/reset', payload)
    return response.data
  } catch (error) {
    console.error('비밀번호 변경 실패', error)
    throw error
  }
}

/**
 * 내 프로필 조회
 * - ADMIN/MANAGER 공통
 */
const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/admins/me')
    return response.data
  } catch (error) {
    console.error('프로필 조회 실패', error)
    throw error
  }
}

/**
 * 내 정보 수정
 */
const managerInfoEdit = async (managerInfo) => {
  try {
    const response = await axiosInstance.patch('/api/admins/me', managerInfo)
    return response.data
  } catch (error) {
    console.error('프로필 수정 실패', error)
    throw error
  }
}

/**
 * 탈퇴하기
 */
const managerInfoDelete = async (payload) => {
  try {
    const response = await axiosInstance.delete('/api/admins/me', {
      data: payload,
    })
    console.log('managerInfoDelete response', response.data) 
    return response.data
  } catch (error) {
    console.error('탈퇴 실패', error)
    throw error
  }
}

/**
 * 로그아웃
 */
const logout = async () => {
  try {
    const response = await axiosInstance.post('/api/admins/logout')
    return response.data
  } catch (error) {
    console.error('로그아웃 실패', error)
    throw error
  }
}

/**
 * 매니저 목록 조회 (페이징)
 */
const getManagers = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/api/admins/managers', {
      params: { page, size }
    })
    return response.data
  } catch (error) {
    console.error('매니저 목록 조회 실패', error)
    throw error
  }
}

/**
 * 매니저 계정 생성
 */
const createManager = async (managerData) => {
  try {
    console.log('📤 매니저 생성 요청 데이터:', managerData)
    const response = await axiosInstance.post('/api/admins/managers', managerData)
    console.log('✅ 매니저 생성 성공:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 매니저 생성 실패:', error)
    console.error('📋 에러 상세:', error.response?.data)
    console.error('📋 에러 상태:', error.response?.status)
    throw error
  }
}

/**
 * 매니저 계정 삭제
 */
const deleteManager = async (managerId) => {
  try {
    const response = await axiosInstance.delete(`/api/admins/managers/${managerId}`)
    return response.data
  } catch (error) {
    console.error('매니저 삭제 실패', error)
    throw error
  }
}

/**
 * 매니저 정보 수정
 * @param {number} managerId - 매니저 ID
 * @param {Object} updateData - 수정할 정보
 * @param {string} updateData.name - 이름
 * @param {string} [updateData.phone] - 연락처 (선택)
 */
const updateManager = async (managerId, updateData) => {
  try {
    const response = await axiosInstance.patch(`/api/admins/managers/${managerId}`, updateData)
    return response.data
  } catch (error) {
    console.error('매니저 수정 실패:', error)
    throw error
  }
}


export default {
  signUpAdmin,
  checkBusinessNumber,
  checkSlug,
  checkEmail,
  getSignUpStatus,
  login,
  resetPassword,
  getMyProfile,
  managerInfoEdit,
  managerInfoDelete,
  logout,
  getManagers,
  createManager,
  deleteManager,
  updateManager
}