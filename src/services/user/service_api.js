import axiosInstance from '@/plugin/axiosInterceptor'

/**
 * 서비스 그룹
 */

// 리소스 그룹 목록 조회
const getServiceGroups = async () => {
  try {
    const response = await axiosInstance.get(`api/resource-group/company`)
    return response.data.data.resourceGroups
  } catch (error) {
    console.log('서비스 그룹 목록 조회 실패:', error)
  }
}

// 리소스 그룹 상세 조회
const getServiceGroupDetail = async (serviceGroupId) => {
  try {
    const response = await axiosInstance.get(`api/resource-group/${serviceGroupId}`)
    return response.data.data
  } catch (error) {
    console.log('서비스 그룹 상세 조회 실패:', error)
  }
}

// 리소스 목록 조회
const getServices = async (serviceGroupId) => {
  try {
    const response = await axiosInstance.get(`api/resource/group/${serviceGroupId}`)
    return response.data.data.resources
  } catch (error) {
    console.log('서비스 그룹 목록 조회 실패:', error)
  }
}

// 리소스 상세 조회
const getService = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`api/resource/${serviceId}`)
    console.log('서비스 상세 조회 성공 : ', response)
    return response.data.data
  } catch (error) {
     console.log('서비스 상세 조회 실패:', error)
  }
}

// 특정 리소스의 커스텀 필드 값 조회
const getResourceCustomFieldValues = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`api/custom-field/value/resource/${serviceId}`)
    console.log('리소스의 커스텀 필드 값 조회 성공 : ', response)
    return response.data.data
  } catch (error) {
     console.log('리소스의 커스텀 필드 값 조회 실패:', error)
  }
}

// 사용자 입력 커스텀 필드 조회
const getUserCustomFields = async (serviceGroupId) => {
  try {
    const response = await axiosInstance.get(`api/custom-field/${serviceGroupId}?type=USER`)
    console.log('사용자 커스텀 필드 조회 성공 : ', response)
    return response.data.data
  } catch (error) {
     console.log('사용자 커스텀 필드 조회 실패:', error)
  }
}

// 정규 운영 시간(시간 슬롯) 조회
const getTimeSlots = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`api/timeslot/${serviceId}/timeslots`)
    console.log('운영 시간 조회 성공 : ', response)
    return response.data.data
  } catch (error) {
    console.log('운영 시간 조회 실패:', error)
  }
}

// 예외 운영 시간 조회
const getExceptionTimeSlots = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`/api/timeslot/${serviceId}/exceptions`)
    console.log('예외 운영 시간 조회 성공 : ', response)
    return response.data.data
  } catch (error) {
    console.log('예외 운영 시간 조회 실패 : ', error)
  }
}

// 년/월 선택에 따른 예외 포함 운영 가능 시간 조회
const getYearMonthTimeSlots = async (serviceId, year, month) => {
  try {
    const response = await axiosInstance.get(`api/timeslot/${serviceId}/timeslots/exceptions?year=${year}&month=${month}`)
    console.log('년/월 선택 시 운영 가능 시간 조회 성공 : ', response)
    return response.data
  } catch (error) {
    console.log('년/월 선택 시 운영 가능 시간 조회 실패 : ', error)
  }
}

export default {
  getServiceGroups,
  getServiceGroupDetail,
  getServices,
  getService,
  getResourceCustomFieldValues,
  getUserCustomFields,
  getTimeSlots,
  getExceptionTimeSlots,
  getYearMonthTimeSlots,
}
