import axiosInstance from '@/plugin/axiosInterceptor'
import axios from 'axios'

/**
 * 서비스 그룹
 */

const getServiceGroups = async () => {
  return await axiosInstance.get(`api/resource-group/company`)
}

const createServiceGroup = async (formdata) => {
  return await axiosInstance.post(`api/resource-group`, formdata)
}

const getServiceGroupPresignedURL = async (formData) => {
  try {
    const response = await axiosInstance.post('api/image-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const uploadUrl = response.data.result || response.data.data
    console.log('업로드 URL:', uploadUrl)

    return uploadUrl
  } catch (error) {
    console.error('이미지 업로드 url 요청 오류:', error)
    alert('이미지 업로드 url을 받아오는 중 오류가 발생했습니다.')
    return null
  }
}

const uploadImage = async (presigedUrl, file) => {
  let data = {}
  await axios
    .put(presigedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

// 서비스 그룹의 카테고리와 상시모집 여부 조회
const getServiceGroupFieldInfo = async (resourceGroupId) => {
    return await axiosInstance.get(`api/resource-group/${resourceGroupId}/register`)
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

const getServiceList = async (serviceGroupId) => {
  return await axiosInstance.get(`api/resource/group/${serviceGroupId}`)
}

export default {
  createServiceGroup,
  getServiceGroupPresignedURL,
  uploadImage,
  getServiceGroups,
  getServiceGroupInfo,
  editServiceGroup,
  deleteServiceGroup,
  createService,
  getServiceGroupFieldInfo,
  getServiceList,
}
