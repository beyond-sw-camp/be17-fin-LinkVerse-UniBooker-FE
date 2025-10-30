import axiosInstance from '@/plugin/axiosInterceptor'

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

/** 사용자 예약 상세 조회 */
const getUserReservation = async (reservationId) => {
  let data = {}

  await axiosInstance
    .get(`api/reservation/detail/${reservationId}`)
    .then(response => {
      data = response.data
      console.log('사용자 예약 상세 조회 성공 : ', data)
    })
    .catch(error => {
      data = error.data
      console.log('사용자 예약 상세 조회 실패 : ', data)
    })
  
  return data
}

/** 특정 서비스 예약 목록 조회 */
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
  getUserReservations,
  getUserReservation,
  getResourceReservations,
  reserve,
  cancel,
}
