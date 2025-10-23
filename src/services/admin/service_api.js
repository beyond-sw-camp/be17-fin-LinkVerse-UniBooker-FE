import axiosInstance from '@/plugin/axiosInterceptor'

/**
 * 서비스 그룹
 */

const getServiceGroups = async () => {
  return await axiosInstance.get(`api/resource-group/company`)
}

const createServiceGroup = async (formdata) => {
  return await axiosInstance.post(`api/resource-group`, formdata)
}

const getServiceGroupInfo = async (resourceGroupId) => {
  return await axiosInstance.get(`api/resource-group/${resourceGroupId}/edit`)
}

const editServiceGroup = async (resourceGroupId, formdata) => {
  console.log(resourceGroupId, formdata)

  return await axiosInstance.put(`api/resource-group/${resourceGroupId}`, formdata)
}

const deleteServiceGroup = async (resourceGroupId) => {
  return await axiosInstance.delete(`api/resource-group/${resourceGroupId}`)
}

/**
 * 서비스
 */

const createService = async (formdata) => {
  return await axiosInstance.post(`api/resource`, formdata)
}

export default {
  createServiceGroup,
  getServiceGroups,
  getServiceGroupInfo,
  editServiceGroup,
  deleteServiceGroup,
  createService,
}
