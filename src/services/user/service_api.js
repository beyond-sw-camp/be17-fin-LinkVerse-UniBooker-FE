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

const getServiceGroupDetail = async (serviceGroupId) => {
  try {
    const response = await axiosInstance.get(`api/resource-group/${serviceGroupId}`)
    return response.data.data
  } catch (error) {
    console.log('서비스 그룹 상세 조회 실패:', error)
  }
}

const getServices = async (serviceGroupId) => {
  try {
    const response = await axiosInstance.get(`api/resource/group/${serviceGroupId}`)
    return response.data.data.resources
  } catch (error) {
    console.log('서비스 그룹 목록 조회 실패:', error)
  }
}

export default {
  getServiceGroups,
  getServiceGroupDetail,
  getServices,
}
