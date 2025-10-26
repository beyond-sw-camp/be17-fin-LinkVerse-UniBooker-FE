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

export default {
    getUserReservations,
}
