import axiosInstance from '@/plugin/axiosInterceptor'

/**
 * 관리자 대시보드 데이터 조회
 */
const getAdminDashboardData = async () => {
  try {
    const response = await axiosInstance.get(`/api/dashboard/admin`)
    return response.data.data
  } catch (error) {
    console.error('❌ 관리자 대시보드 데이터 조회 실패:', error)
    // ✅ 에러 시에도 기본 구조 반환
    return {
      companyStats: { currentCompanyCount: 0, monthlyNewRegistrations: [] },
      customerStats: { currentCustomerCount: 0, cumulativeRegistrations: [] },
      serviceStats: { totalServiceCount: 0, categoryCounts: [], categoryLabels: [] },
      errorLogs: [],
    }
  }
}

/**
 * 슈퍼 관리자 대시보드 데이터 조회
 */
const getSuperDashboardData = async () => {
  try {
    const response = await axiosInstance.get(`/api/dashboard/super`)
    return response.data.data
  } catch (error) {
    console.error('❌ 대시보드 데이터 조회 실패:', error)
    // ✅ 기본 구조 반환
    return {
      companyStats: { 
        currentCompanyCount: 0, 
        monthlyNewRegistrations: [] 
      },
      customerStats: { 
        currentCustomerCount: 0, 
        cumulativeRegistrations: [] 
      },
      serviceStats: { 
        totalServiceCount: 0, 
        categoryCounts: [], 
        categoryLabels: [] 
      },
      errorLogs: []
    }
  }
}

/** 
 * 관리자 리소스 그룹별 대시보드
 */
const getAdminResourceGroupDashboardData = async (resourceGroupId) => {
  try {
    const response = await axiosInstance.get(`/api/dashboard/resource-group/${resourceGroupId}`)
    console.log('👍 관리자 리소스 그룹별 대시보드 조회 성공: ', JSON.stringify(response.data))
    return response.data
  } catch (error) {
    console.error('🥵 관리자 리소스 그룹별 대시보드 조회 실패: ', error)
  }
}

export default {
  getAdminDashboardData,
  getSuperDashboardData,
  getAdminResourceGroupDashboardData,
}
