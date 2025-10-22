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
const resetPassword = async (passwordData) => {
  return await axiosInstance.patch('/api/admins/password/reset', passwordData)
}

/**
 * 내 정보 조회
 */
export const getManagerInfo = async (email, companyId) => {
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
export const managerInfoEdit = async (managerInfo) => {
  try {
    const response = await axiosInstance.patch('/api/admins/me', managerInfo)
    return response.data
  } catch (error) {
    console.error('프로필 수정 실패', error)
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
}