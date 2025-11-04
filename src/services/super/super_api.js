/**
 * 슈퍼 관리자(Super) 관련 API 서비스
 * - 슈퍼 관리자 로그인
 * - 신청 관리 (applications)
 * - 기업 관리 (companies)
 * - 관리자 관리 (managers)
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

// ========== 신청 관리 ==========

/**
 * 승인 대기 기업 목록 조회
 */
const getPendingApplications = async () => {
  const response = await axiosInstance.get('/api/super/applications')
  return response.data
}

/**
 * 신청 상세 조회
 */
const getApplicationDetail = async (companyId) => {
  const response = await axiosInstance.get(`/api/super/applications/${companyId}`)
  return response.data
}

/**
 * 기업 승인
 */
const approveApplication = async (companyId) => {
  const response = await axiosInstance.post(`/api/super/applications/${companyId}/approve`)
  return response.data
}

/**
 * 기업 거절
 */
const rejectApplication = async (companyId, rejectionReason) => {
  const response = await axiosInstance.post(`/api/super/applications/${companyId}/reject`, {
    rejectionReason: rejectionReason,
  })
  return response.data
}

// ========== 기업 관리 ==========

/**
 * 전체 기업 목록 조회 (페이징 + 필터)
 */
const getAllCompanies = async (page = 0, size = 10, status = null, keyword = null) => {
  const params = { page, size }
  if (status) params.status = status
  if (keyword) params.keyword = keyword
  
  const response = await axiosInstance.get('/api/super/companies', { params })
  return response.data
}

/**
 * 기업 상세 조회 (관리용)
 */
const getCompanyDetail = async (companyId) => {
  const response = await axiosInstance.get(`/api/super/companies/${companyId}`)
  return response.data
}

/**
 * 기업 상태 변경
 */
const updateCompanyStatus = async (companyId, status) => {
  const response = await axiosInstance.patch(`/api/super/companies/${companyId}/status`, { status })
  return response.data
}

/**
 * 특정 기업의 관리자 목록 조회
 */
const getCompanyManagers = async (companyId) => {
  const response = await axiosInstance.get(`/api/super/companies/${companyId}/managers`)
  return response.data
}

// ========== 관리자 관리 ==========

/**
 * 전체 관리자/매니저 조회
 */
const getAllManagers = async (page = 0, size = 10, role = null, status = null) => {
  const params = { page, size }
  if (role) params.role = role
  if (status) params.status = status
  
  const response = await axiosInstance.get('/api/super/managers', { params })
  return response.data
}

/**
 * 관리자/매니저 상태 변경
 */
const updateManagerStatus = async (userId, status) => {
  const response = await axiosInstance.patch(`/api/super/managers/${userId}/status`, { status })
  return response.data
}

// ========== 서비스 그룹 관리 ==========

/**
 * 특정 기업의 서비스 그룹 목록 조회
 */
const getCompanyResourceGroups = async (companyId) => {
  const response = await axiosInstance.get(`/api/resource-group/company/${companyId}`)
  return response.data
}

/**
 * 서비스 그룹 활성화
 */
const activateResourceGroup = async (resourceGroupId) => {
  const response = await axiosInstance.patch(`/api/resource-group/${resourceGroupId}/activate`)
  return response.data
}

/**
 * 서비스 그룹 비활성화
 */
const deactivateResourceGroup = async (resourceGroupId) => {
  const response = await axiosInstance.patch(`/api/resource-group/${resourceGroupId}/deactivate`)
  return response.data
}

// ========== Deprecated (하위 호환용) ==========

/**
 * @deprecated getPendingApplications를 사용하세요
 */
const getPendingCompanies = async () => {
  console.warn('⚠️ Deprecated: getPendingCompanies() - Use getPendingApplications() instead')
  return await getPendingApplications()
}

/**
 * @deprecated approveApplication을 사용하세요
 */
const approveCompany = async (companyId) => {
  console.warn('⚠️ Deprecated: approveCompany() - Use approveApplication() instead')
  return await approveApplication(companyId)
}

/**
 * @deprecated rejectApplication을 사용하세요
 */
const rejectCompany = async (companyId, rejectionReason) => {
  console.warn('⚠️ Deprecated: rejectCompany() - Use rejectApplication() instead')
  return await rejectApplication(companyId, rejectionReason)
}

/**
 * @deprecated getAllManagers를 사용하세요
 */
const getAllAdmins = async (page = 0, size = 10, role = null, status = null) => {
  console.warn('⚠️ Deprecated: getAllAdmins() - Use getAllManagers() instead')
  return await getAllManagers(page, size, role, status)
}

/**
 * @deprecated updateManagerStatus를 사용하세요
 */
const updateAdminStatus = async (userId, status) => {
  console.warn('⚠️ Deprecated: updateAdminStatus() - Use updateManagerStatus() instead')
  return await updateManagerStatus(userId, status)
}

export default {
  // 인증
  login,
  logout,
  
  // 신청 관리 (새로운 API)
  getPendingApplications,
  getApplicationDetail,
  approveApplication,
  rejectApplication,
  
  // 기업 관리 (새로운 API)
  getAllCompanies,
  getCompanyDetail,
  updateCompanyStatus,
  getCompanyManagers,
  
  // 관리자 관리 (새로운 API)
  getAllManagers,
  updateManagerStatus,
  
  // 서비스 그룹 관리
  getCompanyResourceGroups,
  activateResourceGroup,
  deactivateResourceGroup,
  
  // Deprecated (하위 호환용)
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  getAllAdmins,
  updateAdminStatus,
}