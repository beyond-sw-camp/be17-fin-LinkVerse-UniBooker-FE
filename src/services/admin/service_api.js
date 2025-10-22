import axiosInstance from '@/plugin/axiosInterceptor'

const getServiceGroups = async (companyId) => {
  return await axiosInstance.get(`api/resource-group/company/${companyId}`)
}

const createServiceGroup = async (formdata) => {
  return await axiosInstance.post(`api/resource-group`, formdata)
}

export default {
  createServiceGroup,
  getServiceGroups,
}
