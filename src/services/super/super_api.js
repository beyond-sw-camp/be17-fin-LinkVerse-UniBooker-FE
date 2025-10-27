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

/**
 * 슈퍼 관리자 로그아웃
 */
const logout = async () => {
  return await axiosInstance.post('/api/super/logout')
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

/**
 * 전체 관리자/매니저 조회
 */
const getAllAdmins = async (page = 0, size = 10, role = null, status = null) => {
  const params = { page, size }
  if (role) params.role = role
  if (status) params.status = status
  
  const response = await axiosInstance.get('/api/admins', { params })
  return response.data
}

/**
 * 계정 상태 변경
 */
const updateAdminStatus = async (userId, status) => {
  const response = await axiosInstance.patch(`/api/admins/${userId}/status`, { status })
  return response.data
}

export default {
  // 인증
  login,
  logout,
  
  // 기업 관리
  getPendingCompanies,
  getCompanyDetail,
  approveCompany,
  rejectCompany,

  // 전체 관리자/매니저 조회
  getAllAdmins,

  // 계정 상태 변경
  updateAdminStatus
}