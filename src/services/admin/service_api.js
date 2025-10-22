import axiosInstance from '@/plugin/axiosInterceptor'

const getServiceGroups = async (companyId) => {
  return await axiosInstance.get(`api/resource-group/company/${companyId}`)
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

export default {
  createServiceGroup,
  getServiceGroups,
  getServiceGroupInfo,
  editServiceGroup,
}
