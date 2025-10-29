<script setup>
// ================= import ==================
import { watch, onMounted, reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Calendar from '@/components/Calendar.vue'
import Modal from '@/components/Modal.vue'
import SeatBoard from '@/components/SeatBoard.vue'

import ServiceApi from '@/services/user/service_api'
import ReservationApi from '@/services/user/reservation_api'


// =============== definition ================
const route = useRoute()
const router = useRouter()

const dayMap = { SUN: '일', MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금', SAT: '토', }

const showSeatModal = ref(false)                // 좌석 선택 모달 활성화 여부
const showCalendar = ref(false)                 // Calendar 모달 활성화 여부

const service = reactive({})                    // 리소스 정보
const resourceCustomFieldValues = reactive([])  // 리소스 커스텀 필드 값 (조회용)
const userCustomFields = reactive([])           // 사용자 입력 커스텀 필드
const userCustomFieldValuesForm = reactive([])  // 사용자 입력 커스텀 필드 값 요청 폼 (입력용)
const times = reactive([])                      // 정규 운영 시간
const exceptionTimeSlots = reactive([])         // 예외 운영 시간
const yearMonthTimeSlots = ref([])              // 년/월 선택에 따른 모든 일자 별의 운영 가능 시간
const resourceReservations = ref([])            // 특정 리소스의 예약 목록
const reservedTimes = ref([])                   // 특정 리소스에 예약된 시간 목록 저장할 배열

const availableTimes = ref([])                                  // 선택 가능한 운영 시간 목록 (버튼용)
const selectedDate = ref(new Date().toISOString().slice(0, 10)) // 선택한 날짜
const selectedTime = ref(null)                                  // 선택한 시간
const selectedYear = ref(new Date().getFullYear())              // 선택한 년도
const selectedMonth = ref(new Date().getMonth() + 1)            // 선택한 월
const selectedHeadCount = ref(1)                                // 선택한 인원수
const selectedRow = ref(null)                                   // 선택한 좌석 행
const selectedCol = ref(null)                                   // 선택한 좌석 열

// 예약 요청 폼
const reservationForm = computed(() => ({
  date: selectedDate.value,
  time: selectedTime.value,
  haedCount: selectedHeadCount.value,
  row: selectedRow.value,
  col: selectedCol.value,
  customFieldValues: userCustomFieldValuesForm,
}))

// ================== api 요청 ==================
// --- 리소스 상세 조회
const getService = async () => {
  const response = await ServiceApi.getService(route.params.itemId)
  Object.assign(service, response)
}

// --- 리소스의 커스텀 필드 값 조회
const getResourceCustomFieldValues = async () => {
  const response = await ServiceApi.getResourceCustomFieldValues(route.params.itemId)
  Object.assign(resourceCustomFieldValues, response)
}

// --- 사용자 입력 커스텀 필드 조회
const getUserCustomFields = async () => {
  const response = await ServiceApi.getUserCustomFields(route.params.serviceGroupId)
  Object.assign(userCustomFields, response)
  Object.assign(userCustomFieldValuesForm, userCustomFields.map((field) => ({
    customFieldId: field.id,
    values: [''],
  })))
}

// --- 정규 운영 시간 조회
const getTimeSlots = async () => {
  const response = await ServiceApi.getTimeSlots(route.params.itemId) 
  Object.assign(times, response)

  // 요일별 시간 매핑
  const grouped = {}
  times.forEach((slot) => {
    if (!grouped[slot.dayOfWeek]) grouped[slot.dayOfWeek] = []
    grouped[slot.dayOfWeek].push(`${slot.startTime} - ${slot.endTime}`)
  })

  // 한글 요일로 변환해서 저장
  resourceCustomFieldValues.dailyTimeSlots = Object.entries(grouped).map(([day, slots]) => ({
    day: dayMap[day] || day,
    slots,
  }))
}

// --- 예외 운영 시간 조회
const getExceptionTimeSlots = async () => {
  const response = await ServiceApi.getExceptionTimeSlots(route.params.itemId)
  Object.assign(exceptionTimeSlots, response)

  // 날짜별 그룹핑
  const groupedExceptions = {}
  exceptionTimeSlots.forEach((ex) => {
    if (!groupedExceptions[ex.date]) groupedExceptions[ex.date] = []

    if (ex.closed) {
      groupedExceptions[ex.date].push(ex.note ? `휴무 (${ex.note})` : '휴무') // 휴무일
    } else {
      groupedExceptions[ex.date].push(`${ex.startTime} - ${ex.endTime}`) // 일반 예외 시간
    }
  })

  // 한글 요일로 변환
  resourceCustomFieldValues.exceptionTimeSlots = Object.entries(groupedExceptions).map(([date, slots]) => ({
    date,
    slots,
  }))
}

// --- 년/월 선택에 따른 예외 포함한 운영 시간 조회
const getYearMonthTimeSlots = async (serviceId, year, month) => {
  const response = await ServiceApi.getYearMonthTimeSlots(serviceId, year, month)
  yearMonthTimeSlots.value = response || []
  updateAvailableTimes(selectedDate.value) // 데이터 로드 후 선택한 날짜의 선택 가능 시간 업데이트
}

// --- 특정 리소스에 예약된 목록 조회
const getResourceReservations = async (startDate, endDate) => {
  const response = await ReservationApi.getResourceReservations(route.params.itemId, startDate, endDate)

  if (response && response.isSuccess) {
    resourceReservations.value = response.data.list
    reservedTimes.value = response.data.list.map(res => res.startDate.slice(11, 16)) // 예약된 시간만 추출해서 배열로 저장 "09:00"
    console.log('🌟예약된 시간 추출 : ', reservedTimes)
  } else {
    alert('잘못된 요청입니다.')
  }
}

// --- 예약 요청
const postReserve = async (reservationForm) => {
  const response = await ReservationApi.reserve(route.params.itemId, reservationForm)
  return response.data
}

// ================ function ==================
// --- 커스텀 필드의 값이 여러개 일 경우 표현 형식 변환
const formatCustomFieldValues = (values) => {
  const data = ref('')
  for (value in values) {
    data.value.concat(value+' ')
  }
  return data
}

// --- 종결 부호마다 줄바꿈 처리
const formatNewLine = (dataString) => {
  if (!dataString) return ''
  return dataString.replace(/[.!?]\s*/g, '$&<br/>').trim()
}

// --- 날짜 선택에 따른 Calendar 모달 토클
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

// --- Calendar에서 날짜 선택했을 때
const selectDate = (date) => {
  selectedDate.value = date
  showCalendar.value = false // Calendar 모달 닫기

  const [year, month] = date.split('-').map(Number) // 선택한 date에서 year, month 추출

  // 현재 yearMonthTimeSlots가 다른 달이면 api 재호출
  const firstItem = yearMonthTimeSlots.value[0]
  if (!firstItem || !firstItem.date.startsWith(`${year}-${String(month).padStart(2, '0')}`)) {
    getYearMonthTimeSlots(route.params.itemId, year, month)
  }
}

// --- 날짜 LocalDate로 변환
const toLocalDateTimeStart = (dateString) => {
  return `${dateString}T00:00:00`
}
const toLocalDateTimeEnd = (dateString) => {
  return `${dateString}T23:59:59`
}

// --- 선택한 날짜의 운영 시간 업데이트
const updateAvailableTimes = (date) => {
  if (!Array.isArray(yearMonthTimeSlots.value)) return

  const target = yearMonthTimeSlots.value.find((d) => d.date === date)

  if (!target || target.closed) {
    availableTimes.value = []
    return
  }

  availableTimes.value = target.slots || []
}

// --- 선택한 날짜가 바뀔 때마다 요일별 시간 재계산 및 날짜가 바뀌면 선택 값들도 초기화
watch(selectedDate, () => {
  selectedTime.value = null
  selectedRow.value = null
  selectedCol.value = null
  selectedHeadCount.value = 1
  availableTimes.value = []
  userCustomFieldValuesForm.forEach(field => {
    field.values = field.values.map(() => '')  // 기존 값들을 모두 빈 문자열로 초기화
  })

  if (!selectedDate.value || yearMonthTimeSlots.value.length === 0) return

  // 현재 선택한 날짜에 해당하는 시간 슬롯 목록 찾기
  const daySlot = yearMonthTimeSlots.value.find((d) => d.date === selectedDate.value) 

  if (!daySlot) {
    availableTimes.value = []
    return
  }

  // 휴무 처리
  if (daySlot.closed) {
    availableTimes.value = []
    return
  }

  // 해당 날짜에 맞춰 시간 리스트 생성
  availableTimes.value = daySlot.slots.map((slot) => ({
    startTime: slot.startTime,
    endTime: slot.endTime,
  }))

  // 특정 리소스에 예약된 목록 조회
  getResourceReservations(toLocalDateTimeStart(selectedDate.value), toLocalDateTimeEnd(selectedDate.value))
})

// -- 선택한 시간이 변경되면 선택 값들 초기화
watch(selectedTime, () => {
  selectedRow.value = null
  selectedCol.value = null
  selectedHeadCount.value = 1
  userCustomFieldValuesForm.forEach(field => {
    field.values = field.values.map(() => '') 
  })
})

// --- 년/월 선택 변경에 따른 예외 포함 운영 가능 시간 변경
watch([selectedYear, selectedMonth], async ([year, month]) => {
  await getYearMonthTimeSlots(route.params.itemId, year, month)
})

// --- 해당 시간대 마감 여부 계산
const isTimeClosed = (time) => {
  if (service.category === 'RESERVATION') {
    return reservedTimes.value.includes(time)
  }

  if (service.category === 'SEAT') {
    // 현재 시간대에 예약된 좌석 수
    const reservedCount = resourceReservations.value.filter((r) => r.startDate.slice(11, 16) === time).length

    // 좌석 전부 예약되었으면 마감
    return reservedCount >= service.capacity
  }

  return false
}

// --- 인원수 증감
const increase = () => { if (selectedHeadCount.value < service.capacity) selectedHeadCount.value += 1 }
const decrease = () => { if (selectedHeadCount.value > 1) selectedHeadCount.value -= 1 }

// --- 좌석 선택
const selectSeat = ({ row, col }) => {
  selectedRow.value = row
  selectedCol.value = col
}

// --- 예약 버튼 클릭
const reserve = () => {
  const confirmed = window.confirm('예약을 하시겠습니까?')
  if (!confirmed) return // 취소
  const reservationRes = postReserve(reservationForm.value)

  const slug = route.params.companySlug || authStore.companySlug || 'default'
  router.push({
    path: `/c/${slug}/reservation/completed/${reservationRes.id}`,
  })
}


// =============== 화면 로드시 데이터 조회 ===============
onMounted(() => {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10) // yyyy-mm-dd

  getService()
  getResourceCustomFieldValues()
  getUserCustomFields()
  getTimeSlots()
  getExceptionTimeSlots()
  getYearMonthTimeSlots(route.params.itemId, today.getFullYear(), today.getMonth() + 1)
  getResourceReservations(toLocalDateTimeStart(todayStr), toLocalDateTimeEnd(todayStr))
})
</script>

<template>
  <div class="detail-page">
    <!-- 좌석 선택 모달 -->
    <Modal :open="showSeatModal" :closeOnOverlay="false" @close="showSeatModal=false">
      <SeatBoard 
        :service="service" 
        :selectedTime="selectedTime" 
        :resourceReservations="resourceReservations" 
        @selectSeat="selectSeat" />
      <div class="p-6">
        <Button @click="showSeatModal = false">선택하기</Button>
      </div>
    </Modal>

    <!-- 상단 이미지 -->
    <img :src="service.resourceImage" alt="회의실" class="header-image" />

    <div class="content-wrapper">
      <!-- 왼쪽 영역 -->
      <div class="info-section">
        <h2 class="title">{{ service.name }}</h2>
        <p class="desc" v-html="formatNewLine(service.description)"></p>
        <table class="details-table">
          <tbody>
            <!-- 카테고리 별 고정 필드 -->
            <tr v-if="service.category === 'RESERVATION' || service.category === 'SEAT'">
              <th>운영 시간</th>
              <td>
                <table class="inner-table">
                  <tbody>
                    <tr v-for="(daySlot, index) in resourceCustomFieldValues.dailyTimeSlots" :key="index">
                      <td class="font-semibold align-top w-8">{{ daySlot.day }}</td>
                      <td>
                        <div v-for="(slot, sIndex) in daySlot.slots" :key="sIndex">
                          {{ slot }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <th>수용 가능 인원 수</th>
              <td>최대 {{ service.capacity }}명</td>
            </tr>

            <!-- 리소스의 커스텀 필드 -->
            <tr v-for="item in resourceCustomFieldValues">
              <th>{{ item.fieldName }}</th>
              <td>{{ item.values.length > 1 ? formatCustomFieldValues(item.values) : item.values[0] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 오른쪽 영역 : 사용자 예약 박스 -->
      <div class="reservation-box">
        <div v-if="(service.category === 'RESERVATION' || service.category === 'SEAT')" class="form-group">
          <label>날짜</label>
           <div class="relative" @click="toggleCalendar">
            <Input type="text" class="cursor-pointer" v-model="selectedDate" readonly />
            <div v-if="showCalendar" class="date-picker" @click.stop>
              <Calendar @select="selectDate"/>
            </div>
          </div>
        </div>

        <div v-if="(service.category === 'RESERVATION' || service.category === 'SEAT') && times" class="form-group">
          <label>시간</label>
          <div v-if="availableTimes.length" class="time-grid">
            <button v-for="(time, index) in availableTimes" :key="index" 
              :disabled="isTimeClosed(time.startTime)"
              :class="['time-btn', { active: selectedTime === time.startTime, block: isTimeClosed(time.startTime)}]" 
              @click="!isTimeClosed(time.startTime) && (selectedTime = time.startTime)"
            >
              {{ time.startTime }}
            </button>
          </div>
          <div v-else class="text-gray-400 text-sm">해당 날짜는 운영 시간이 없습니다.</div>
        </div>
        
        <div class="form-group">
          <label>인원수</label>
          <div class="people-control">
            <button class="count-btn" @click="decrease">−</button>
            <span class="count">{{ selectedHeadCount }}명</span>
            <button class="count-btn" @click="increase">＋</button>
          </div>
        </div>

        <div v-if="service.category === 'SEAT' && availableTimes.length" class="form-group">
          <label>좌석 선택</label>
          <div class="flex flex-row justify-between gap-3 text-sm text-gray-500">
            <span>선택한 좌석</span>
            <span @click="showSeatModal = true">{{ selectedRow && selectedCol ? selectedRow + '행 ' + selectedCol + '열' : '없음'  }}</span>
          </div>
        </div>



        <!-- 사용자 커스텀 필드 -->
        <div v-for="(item, index) in userCustomFields" :key="item.id">
          <div class="form-group">
              <label>{{ item.fieldName }}</label>
              <div>
                  <Input v-if="item.dataType === 'TEXT'" type="text" placeholder="텍스트를 입력해주세요." v-model="userCustomFieldValuesForm[index].values[0]" />
                  <Input v-else-if="item.dataType ==='DATE'" type="date" v-model="userCustomFieldValuesForm[index].values[0]" />
                  <Input v-else-if="item.dataType ==='TIME'" type="time" v-model="userCustomFieldValuesForm[index].values[0]" />
                  <Input v-else-if="item.dataType ==='NUMBER'" type="number" placeholder="숫자를 입력해주세요." v-model="userCustomFieldValuesForm[index].values[0]" />
                  <Input v-else-if="item.dataType ==='RADIO'" type="radio" v-model="userCustomFieldValuesForm[index].values[0]" />
                  <Input v-else-if="item.dataType ==='CHECKBOX'" type="checkbox" v-model="userCustomFieldValuesForm[index].values[0]" />
              </div>
          </div>
        </div>

        <Button @click="reserve()">예약하기</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  @apply bg-white min-h-screen flex flex-col items-center;
}

.header-image {
  @apply w-full h-64 sm:h-80 object-cover;
}

.content-wrapper {
  @apply flex flex-col lg:flex-row justify-between max-w-6xl w-full my-8 sm:my-10 gap-8 sm:gap-10 px-4 sm:px-10;
}

/* 왼쪽 정보 영역 */
.info-section {
  @apply text-text flex flex-col w-full lg:w-1/2;
}

.title {
  @apply text-base sm:text-xl font-semibold mb-3 sm:mb-4;
}

.desc {
  @apply text-sm sm:text-base text-gray-dark mb-6 leading-relaxed;
}

/* 테이블 */
.details-table {
  @apply text-sm sm:text-base text-text border-collapse w-full mt-8 sm:mt-14;
  border-collapse: separate;
  border-spacing: 0 1rem; /* 1rem = 16px */
}

.details-table th {
  @apply font-semibold text-left align-top pr-3 sm:pr-4;
  white-space: nowrap;
  width: 7.5rem;
}

.details-table td {
  @apply text-gray-dark;
}

.details-table,
.details-table th,
.details-table td {
  border: none;
}

/* 오른쪽 예약 영역 */
.reservation-box {
  @apply w-full lg:w-1/3 border border-gray-200 rounded-xl shadow-md p-5 sm:shadow-md p-6 flex flex-col gap-6 bg-white;
  position: sticky;   /* 스크롤 시 고정 */
  top: 80px;          /* 상단에서 떨어진 거리 */
  max-height: 500px;  /* 고정 높이 설정 */
  overflow-y: auto;   /* 내부 스크롤 가능 */
  /* position: relative; */
}

.form-group label {
  @apply block text-sm font-semibold mb-2 text-gray-700;
}

/* 날짜 */
.date-picker {
  @apply fixed z-50 mt-2 left-[50%] translate-x-[-33%] translate-y-[-45%] scale-75 origin-top-left;
}
/* .date-picker {
  @apply absolute z-50 top-0 right-full mr-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2;
} */

/* 시간 */
.time-grid {
  @apply grid grid-cols-3 sm:grid-cols-4 gap-2;
}

.time-btn {
  @apply border border-gray-300 rounded-md py-2 text-sm text-gray-700 hover:bg-blue-50 transition;
}

.time-btn.active {
  @apply bg-blue-600 text-white border-blue-600;
}

.time-btn.block {
  @apply opacity-50 cursor-not-allowed bg-gray-200 text-gray-500 border-gray-300
}

/* 인원수 */
.people-control {
  @apply flex items-center justify-between w-2/3 sm:w-1/2;
}

.count-btn {
  @apply bg-gray-100 w-8 h-8 sm:w-9 sm:h-9 rounded-full text-lg font-bold flex items-center justify-center hover:bg-blue-100 transition;
}

.count {
  @apply text-base font-medium;
}

/* 운영 시간 테이블 */
.inner-table {
  width: 100%;
  border-collapse: collapse;
}

.inner-table td {
  padding: 2px 4px;
  vertical-align: top;
}

.inner-table .font-semibold {
  white-space: nowrap;
  width: 2rem; /* 요일 칸 좁게 */
}

</style>
