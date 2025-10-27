import axiosInstance from '@/plugin/axiosInterceptor'

const getAdminDashboardData = async () => {
  try {
    const response = await axiosInstance.get(`api/dashboard/admin`)
    return response.data.data
  } catch (error) {
    console.log('대시보드 데이터 조회 실패:', error)
  }
}

const getSuperDashboardData = async () => {
  try {
    const response = await axiosInstance.get(`api/dashboard/super`)
    return response.data.data
  } catch (error) {
    console.log('대시보드 데이터 조회 실패:', error)
  }
}

export default {
  getAdminDashboardData,
  getSuperDashboardData,
}
