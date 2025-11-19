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
const loginUser = async (loginData, config = {}) => {
  try {
    const response = await axiosInstance.post('/api/users/login', loginData, config)
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

// ========== 프로필 관련 (추가) ==========

/**
 * 내 프로필 조회
 */
const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/users/profile')
    return response.data
  } catch (error) {
    console.error('프로필 조회 실패:', error)
    throw error
  }
}

/**
 * 내 프로필 수정
 * @param {Object} profileData - 프로필 수정 데이터
 * @param {string} profileData.name - 이름
 * @param {string} [profileData.phone] - 전화번호 (선택)
 * @param {string} [profileData.birthDate] - 생년월일 (선택)
 * @param {string} [profileData.gender] - 성별 (선택)
 */
const updateMyProfile = async (profileData) => {
  try {
    const response = await axiosInstance.patch('/api/users/profile', profileData)
    return response.data
  } catch (error) {
    console.error('프로필 수정 실패:', error)
    throw error
  }
}

/**
 * 비밀번호 변경
 * @param {Object} passwordData - 비밀번호 변경 데이터
 * @param {string} passwordData.currentPassword - 현재 비밀번호
 * @param {string} passwordData.newPassword - 새 비밀번호
 * @param {string} passwordData.confirmPassword - 새 비밀번호 확인
 */
const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.put('/api/users/password', passwordData)
    return response.data
  } catch (error) {
    console.error('비밀번호 변경 실패:', error)
    throw error
  }
}

/**
 * 회원 탈퇴
 * @param {Object} withdrawData - 회원 탈퇴 데이터
 * @param {string} withdrawData.password - 비밀번호 확인
 * @param {string} [withdrawData.reason] - 탈퇴 사유 (선택)
 */
const withdrawUser = async (withdrawData) => {
  try {
    const response = await axiosInstance.delete('/api/users/profile', {
      data: withdrawData
    })
    return response.data
  } catch (error) {
    console.error('회원 탈퇴 실패:', error)
    throw error
  }
}

/**
 * 비밀번호 찾기 - 임시 비밀번호 발급
 * @param {string} email - 이메일
 * @param {number} companyId - 기업 ID
 */
const resetPassword = async (email, companyId) => {
  try {
    const response = await axiosInstance.post('/api/users/reset-password', null, {
      params: { email, companyId }
    })
    return response.data
  } catch (error) {
    console.error('비밀번호 찾기 실패:', error)
    throw error
  }
}

/**
 * 아이디 찾기 - 이메일 조회
 * @param {Object} findEmailData - 아이디 찾기 데이터
 * @param {string} findEmailData.name - 이름
 * @param {number} findEmailData.companyId - 기업 ID
 * @param {string} [findEmailData.phone] - 전화번호 (선택)
 * @param {string} [findEmailData.birthDate] - 생년월일 (선택)
 */
const findEmail = async (findEmailData) => {
  try {
    const response = await axiosInstance.post('/api/users/find-email', findEmailData)
    return response.data
  } catch (error) {
    console.error('아이디 찾기 실패:', error)
    throw error
  }
}

/**
 * 현재 로그인 사용자 정보 조회 (인증 확인용)
 */
const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/api/users/me')
    return response.data
  } catch (error) {
    console.error('현재 사용자 정보 조회 실패:', error)
    throw error
  }
}

/**
 * Access Token 갱신
 */
const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/api/users/refresh')
    return response.data
  } catch (error) {
    console.error('Token 갱신 실패:', error)
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
  
  // 프로필 관련
  getMyProfile,
  updateMyProfile,
  changePassword,
  withdrawUser,
  
  // 비밀번호 찾기
  resetPassword,

  // 아이디 찾기
  findEmail,

  // 현재 로그인 사용자 정보 조회
  getCurrentUser,

  // Access Token 갱신
  refreshToken 
}