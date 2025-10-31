import axiosInstance from '@/plugin/axiosInterceptor'

/** 예약 상세 조회 */
const getServiceReservationDetail = async (reservationId) => {
  try {
    const response = await axiosInstance.get(`/api/reservation/detail/${reservationId}`)
    return response.data.data
  } catch (error) {
    console.log('예약 상세 조회 실패:', error)
  }
}

/** 특정 서비스 목록 조회 */
const getServiceReservations = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`/api/reservation/list/${serviceId}`)
    return response.data.data.list
  } catch (error) {
    console.log('예약 목록 조회 실패:', error)
  }
}

/** 특정 서비스 예약 목록 조회 (특정 날짜의 목록 조회용) */
const getResourceReservations = async (resourceId, startDate, endDate) => {
  let data = {}

  await axiosInstance
    .get(`api/reservation/list/${resourceId}?startDate=${startDate}&endDate=${endDate}`)
    .then(response => {
      data = response.data
      console.log('특정 서비스 예약 목록 조회 성공 : ', data)
    })
    .catch(error => {
      data = error.data
      console.log('특정 서비스 예약 목록 조회 실패 : ', data)
    })
  
  return data
}

/** 사용자 예약 목록 조회 */
const getUserReservations = async () => {
  let data = {}

  await axiosInstance
    .get(`api/reservation/list`)
    .then(response => {
      data = response.data
      console.log('사용자 예약 목록 조회 성공 : ', data)
    })
    .catch(error => {
      data = error.data
      console.log('사용자 예약 목록 조회 실패 : ', data)
    })
  
  return data
}

/** 예약하기 */
const reserve = async (resourceId, formData) => {
  let data = {}

  await axiosInstance
    .post(`api/reservation/${resourceId}`, formData)
    .then(response => {
      data = response.data
      console.log('예약 성공 : ', data)
    })
    .catch(error => {
      data = error.data
      console.log('예약 실패 : ', data)
  })
  
  return data
}

/** 예약취소 */
const cancel = async (reservationId) => {
  let data = {}

  await axiosInstance.delete(`api/reservation/cancel/${reservationId}`)
    .then(response => {
      data = response.data
      console.log('예약 취소 성공 : ', data)
    })
    .catch(error => {
      data = error.data
      console.log('예약 취소 실패 : ', data)
    })
  
  return data
}

export default {
  getServiceReservations,
  getServiceReservationDetail,
  getUserReservations,
  getResourceReservations,
  reserve,
  cancel,
}
