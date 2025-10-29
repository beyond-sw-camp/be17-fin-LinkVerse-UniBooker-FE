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
  let data = {}
  await axiosInstance
    .get(`api/resource-group/${resourceGroupId}/register`)
    .then((res) => {
      data = res.data.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
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

const getServices = async (serviceGroupId) => {
  try {
    const response = await axiosInstance.get(`api/resource/group/${serviceGroupId}`)
    return response.data.data.resources
  } catch (error) {
    console.log('서비스 목록 조회 실패:', error)
  }
}

// 서비스 단건 조회 (수정용)
const getServiceInfo = async (serviceId) => {
  return await axiosInstance.get(`http://localhost:8080/api/resource/${serviceId}`)
}

// 서비스 리소스 커스텀 필드 값 조회
const getResourceCustomFieldAndValue = async (resourceId) => {
  return await axiosInstance.get(`/api/custom-field/value/resource/${resourceId}?type=RESOURCE`)
}

// 서비스 정규시간 조회
const getDailyTimeSlots = async (serviceId) => {
  return await axiosInstance.get(`/api/timeslot/${serviceId}/timeslots`)
}

// 서비스 예외시간 조회
const getExceptionTimeSlots = async (serviceId) => {
  return await axiosInstance.get(`/api/timeslot/${serviceId}/exceptions`)
}

// 서비스 수정
const updateService = async (serviceId, formData) => {
  return await axiosInstance.put(`http://localhost:8080/api/resource/${serviceId}`, formData)
}

const getServiceCustomFields = async (serviceGroupId) => {
  let data = {}
  await axiosInstance
    .get(`api/custom-field/${serviceGroupId}?type=RESOURCE`)
    .then((res) => {
      data = res.data.data
    })
    .catch((error) => {
      data = error.data
    })
  return data
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
  getServices,
  getResourceCustomFieldAndValue,
  getServiceCustomFields,
  getServiceInfo,
  getDailyTimeSlots,
  getExceptionTimeSlots,
  updateService,
}
