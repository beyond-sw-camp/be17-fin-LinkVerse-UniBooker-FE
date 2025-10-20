/**
 * 기업 관련 API 서비스
 * - Company Slug 중복 확인
 * - 승인 대기 기업 목록 조회
 * - 기업 상세 조회
 * - 기업 승인
 * - 기업 거절
 */

import axiosInstance from '@/plugin/axiosInterceptor'

/**
 * Company Slug 중복 확인
 */
const checkSlug = async (slug) => {
  return await axiosInstance.get('/api/companies/check-slug', {
    params: { slug },
  })
}

/**
 * 승인 대기 기업 목록 조회
 */
const getPendingCompanies = async () => {
  return await axiosInstance.get('/api/companies/pending')
}

/**
 * 기업 상세 조회
 */
const getCompanyDetail = async (companyId) => {
  return await axiosInstance.get(`/api/companies/${companyId}`)
}

/**
 * 기업 승인
 */
const approveCompany = async (companyId) => {
  return await axiosInstance.post(`/api/companies/${companyId}/approve`)
}

/**
 * 기업 거절
 */
const rejectCompany = async (companyId, rejectionReason) => {
  return await axiosInstance.post(`/api/companies/${companyId}/reject`, {
    rejectionReason,
  })
}

export default {
  checkSlug,
  getPendingCompanies,
  getCompanyDetail,
  approveCompany,
  rejectCompany,
}