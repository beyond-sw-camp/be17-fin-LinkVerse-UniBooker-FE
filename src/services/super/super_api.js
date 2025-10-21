/**
 * 슈퍼 관리자(Super) 관련 API 서비스
 * - 슈퍼 관리자 로그인
 * - 승인 대기 기업 목록 조회
 * - 기업 상세 조회
 * - 기업 승인/거절 처리
 */

import axiosInstance from '@/plugin/axiosInterceptor'

// ========== 인증 관련 ==========

/**
 * 슈퍼 관리자 로그인
 */
const login = async (loginData) => {
  return await axiosInstance.post('/api/super/login', loginData)
}

// ========== 기업 관리 ==========

/**
 * 승인 대기 기업 목록 조회
 */
const getPendingCompanies = async () => {
  const response = await axiosInstance.get('/api/companies/pending')
  return response.data
}

/**
 * 기업 상세 조회
 */
const getCompanyDetail = async (companyId) => {
  const response = await axiosInstance.get(`/api/companies/${companyId}`)
  return response.data
}

/**
 * 기업 승인
 */
const approveCompany = async (companyId) => {
  const response = await axiosInstance.post(`/api/companies/${companyId}/approve`)
  return response.data
}

/**
 * 기업 거절
 */
const rejectCompany = async (companyId, rejectionReason) => {
  const response = await axiosInstance.post(`/api/companies/${companyId}/reject`, {
    rejectionReason: rejectionReason,
  })
  return response.data
}

export default {
  // 인증
  login,
  
  // 기업 관리
  getPendingCompanies,
  getCompanyDetail,
  approveCompany,
  rejectCompany,
}