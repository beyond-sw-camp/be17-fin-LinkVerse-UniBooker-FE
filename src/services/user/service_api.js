import axiosInstance from '@/plugin/axiosInterceptor'

/**
 * 서비스 그룹
 */

const getServiceGroups = async () => {
  try {
    const response = await axiosInstance.get(`api/resource-group/company`)
    return response.data.data.resourceGroups
  } catch (error) {
    console.log('서비스 그룹 목록 조회 실패:', error)
  }
}

export default {
  getServiceGroups,
}
