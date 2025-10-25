/**
 * 일반 사용자(User) 관련 API 서비스
 * - 기업 정보 조회
 * - 이메일 중복 확인
 * - 사용자 회원가입
 * - 계정 목록 조회
 * - 로그인/로그아웃
 */

import axiosInstance from '@/plugin/axiosInterceptor'

// ========== 기업 정보 ==========

/**
 * Company Slug로 기업 정보 조회
 * @param {string} companySlug - Company Slug
 */
const getCompanyBySlug = async (companySlug) => {
  try {
    const response = await axiosInstance.get(`/api/companies/slug/${companySlug}`)
    return response.data
  } catch (error) {
    console.error('기업 정보 조회 실패:', error)
    throw error
  }
}

// ========== 회원가입 관련 ==========

/**
 * 이메일 중복 확인 (기업별)
 * @param {string} email - 확인할 이메일
 * @param {number} companyId - 기업 ID
 * @returns {Promise<boolean>} true: 사용 중, false: 사용 가능
 */
const checkEmailDuplicate = async (email, companyId) => {
  try {
    const response = await axiosInstance.get('/api/users/check-email', {
      params: { email, companyId },
    })
    return response.data
  } catch (error) {
    console.error('이메일 중복 확인 실패:', error)
    throw error
  }
}

/**
 * 일반 사용자 회원가입
 * @param {Object} signUpData - 회원가입 데이터
 * @param {string} signUpData.email - 이메일
 * @param {string} signUpData.password - 비밀번호
 * @param {string} signUpData.name - 이름
 * @param {number} signUpData.companyId - 기업 ID
 * @param {string} [signUpData.phone] - 전화번호 (선택)
 * @param {string} [signUpData.birthDate] - 생년월일 (선택)
 * @param {string} [signUpData.gender] - 성별 (선택)
 */
const signUpUser = async (signUpData) => {
  try {
    const response = await axiosInstance.post('/api/users/signup', signUpData)
    return response.data
  } catch (error) {
    console.error('회원가입 실패:', error)
    throw error
  }
}

/**
 * 이메일로 가입한 계정 목록 조회
 * @param {string} email - 조회할 이메일
 */
const getAccountsByEmail = async (email) => {
  try {
    const response = await axiosInstance.get('/api/users/accounts', {
      params: { email },
    })
    return response.data
  } catch (error) {
    console.error('계정 목록 조회 실패:', error)
    throw error
  }
}

// ========== 인증 관련 ==========

/**
 * 로그인
 * @param {Object} loginData - 로그인 데이터
 * @param {string} loginData.email - 이메일
 * @param {string} loginData.password - 비밀번호
 */
const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post('/api/users/login', loginData)
    return response.data
  } catch (error) {
    console.error('로그인 실패:', error)
    throw error
  }
}

/**
 * 로그아웃
 */
const logoutUser = async () => {
  try {
    const response = await axiosInstance.post('/api/users/logout')
    return response.data
  } catch (error) {
    console.error('로그아웃 실패:', error)
    throw error
  }
}

export default {
  // 기업 정보
  getCompanyBySlug,
  
  // 회원가입 관련
  checkEmailDuplicate,
  signUpUser,
  getAccountsByEmail,
  
  // 인증
  loginUser,
  logoutUser,
}