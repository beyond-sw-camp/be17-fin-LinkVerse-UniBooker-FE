import axiosInstance from '@/plugin/axiosInterceptor'  // 변경!

// ========== 일반 사용자 API ==========

/**
 * Company Slug로 기업 정보 조회
 * @param {string} companySlug - Company Slug
 */
export const getCompanyBySlug = async (companySlug) => {
  try {
    const response = await axiosInstance.get(`/api/companies/slug/${companySlug}`)
    return response.data
  } catch (error) {
    console.error('기업 정보 조회 실패:', error)
    throw error
  }
}

/**
 * 이메일 중복 확인 (기업별)
 * @param {string} email - 확인할 이메일
 * @param {number} companyId - 기업 ID
 * @returns {Promise<boolean>} true: 사용 중, false: 사용 가능
 */
export const checkEmailDuplicate = async (email, companyId) => {
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
export const signUpUser = async (signUpData) => {
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
export const getAccountsByEmail = async (email) => {
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

/**
 * 로그인
 * @param {Object} loginData - 로그인 데이터
 * @param {string} loginData.email - 이메일
 * @param {string} loginData.password - 비밀번호
 */
export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post('/api/users/login', loginData)
    return response.data
  } catch (error) {
    console.error('로그인 실패:', error)
    throw error
  }
}