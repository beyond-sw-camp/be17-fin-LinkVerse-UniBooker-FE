<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import Modal from '@/components/Modal.vue'
import serviceApi from '@/services/service/service_api'
import reservationApi from '@/services/reservation/reservation_api'
import { useRoute } from 'vue-router'

const route = useRoute()

const serviceGroupId = route.params.serviceGroupId

// ========== 상태 관리 ==========

/** 예약 상세 모달 열림 상태 */
const detailModalOpen = ref(false)

/** 선택된 예약 정보 */
const selectedReservation = ref(null)

/** 현재 뷰 모드 (day/week/month) */
const viewMode = ref('week')

/** 현재 선택된 날짜 */
const currentDate = ref(new Date())

/** 우측 사이드바 열림 상태 */
const sidebarOpen = ref(false)

/** 선택된 날짜 */
const selectedDate = ref(null)

/** 선택된 시간 (시) */
const selectedHour = ref(null)

/** 선택된 시간 (분) */
const selectedMinute = ref(null)

/** 리소스 필터 (전체/특정 리소스) */
const selectedResourceFilter = ref('all')

/** 날짜 픽커 열림 상태 */
const showDatePicker = ref(false)

/** 임시 날짜 값 (YYYY-MM-DD) */
const tempDateValue = ref('')

/** 색상 팔레트 (10개) */
const colorPalette = [
  '#FF69B4', // 핑크
  '#FFD700', // 골드
  '#32CD32', // 라임그린
  '#1E90FF', // 블루
  '#FF8C00', // 오렌지
  '#BA55D3', // 퍼플
  '#00CED1', // 터콰이즈
  '#DC143C', // 레드
  '#8A2BE2', // 블루바이올렛
  '#20B2AA', // 라이트시그린
]

/** 상태 */
const services = ref([])
const resources = ref([])
const reservations = ref([])

// ✅ 서비스 목록 불러오기
const getServices = async () => {
  try {
    const response = await serviceApi.getServices(serviceGroupId)
    services.value = response.map((service, index) => ({
      ...service,
      color: colorPalette[index % colorPalette.length], // 색상 자동 배정
    }))

    console.log('services:', services.value)

    // 서비스별 예약 데이터 불러오기
    for (const service of services.value) {
      const serviceReservations = await getReservations(service.id, service.color)
      reservations.value.push(...serviceReservations)
    }

    console.log('reservations:', reservations.value)
  } catch (error) {
    console.error('getServices error:', error)
  }
}

// ✅ 예약 데이터 불러오기
const getReservations = async (serviceId, color) => {
  try {
    const response = await reservationApi.getServiceReservations(serviceId)
    // 예약 데이터에 색상과 리소스명 추가
    return response.map((r) => {
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)
      return {
        ...r,
        reservationDate: r.startDate.split('T')[0], // YYYY-MM-DD
        startTime: `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`,
        endTime: `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`,
        resourceColor: color,
        resourceName: services.value.find((s) => s.id === serviceId)?.name || 'Unknown',
      }
    })
  } catch (error) {
    console.error(`getReservations(${serviceId}) error:`, error)
    return []
  }
}

/** 시간 슬롯 (00:00 ~ 23:00, 1시간 단위) */
const timeSlots = ref([
  { time: '00:00', hour: 0, minute: 0 },
  { time: '01:00', hour: 1, minute: 0 },
  { time: '02:00', hour: 2, minute: 0 },
  { time: '03:00', hour: 3, minute: 0 },
  { time: '04:00', hour: 4, minute: 0 },
  { time: '05:00', hour: 5, minute: 0 },
  { time: '06:00', hour: 6, minute: 0 },
  { time: '07:00', hour: 7, minute: 0 },
  { time: '08:00', hour: 8, minute: 0 },
  { time: '09:00', hour: 9, minute: 0 },
  { time: '10:00', hour: 10, minute: 0 },
  { time: '11:00', hour: 11, minute: 0 },
  { time: '12:00', hour: 12, minute: 0 },
  { time: '13:00', hour: 13, minute: 0 },
  { time: '14:00', hour: 14, minute: 0 },
  { time: '15:00', hour: 15, minute: 0 },
  { time: '16:00', hour: 16, minute: 0 },
  { time: '17:00', hour: 17, minute: 0 },
  { time: '18:00', hour: 18, minute: 0 },
  { time: '19:00', hour: 19, minute: 0 },
  { time: '20:00', hour: 20, minute: 0 },
  { time: '21:00', hour: 21, minute: 0 },
  { time: '22:00', hour: 22, minute: 0 },
  { time: '23:00', hour: 23, minute: 0 },
])

// ========== 유틸리티 함수 ==========

/** 날짜를 YYYY.MM.DD 형식으로 변환 */
const dateToStr = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

/** 현재 날짜 문자열 */
const currentDateStr = computed(() => dateToStr(currentDate.value))

/** 주간 날짜 배열 (일~토) */
const weekDays = computed(() => {
  const start = new Date(currentDate.value)
  const dayOfWeek = start.getDay()
  start.setDate(start.getDate() - dayOfWeek)

  const arr = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    arr.push({
      date: dateToStr(d),
      dayNum: d.getDate(),
      dayLabel: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    })
  }
  return arr
})

/** 월간 날짜 배열 */
const daysInMonth = computed(() => {
  const y = currentDate.value.getFullYear()
  const m = currentDate.value.getMonth()
  const lastDay = new Date(y, m + 1, 0).getDate()

  const arr = []
  for (let i = 1; i <= lastDay; i++) {
    const d = new Date(y, m, i)
    arr.push({
      dateStr: dateToStr(d),
      dayNum: i,
      dayOfWeek: d.getDay(), // 0(일) ~ 6(토)
    })
  }
  return arr
})

/** 월 시작 전 빈 칸 개수 */
const blanksBefore = computed(() => {
  const firstDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  return firstDay.getDay()
})

/** 현재 기간 표시 문자열 */
const currentPeriodLabel = computed(() => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const year = currentDate.value.getFullYear()
  const month = months[currentDate.value.getMonth()]

  if (viewMode.value === 'day') {
    // Day 뷰: "2025년 10월 22일" 형식
    return `${year}. ${currentDate.value.getMonth() + 1}. ${currentDate.value.getDate()}.`
  } else if (viewMode.value === 'week') {
    // Week 뷰: "February 2025" 형식
    return `${month} ${year}`
  } else {
    // Month 뷰: "February 2025" 형식
    return `${month} ${year}`
  }
})

// ========== 예약 필터링 ==========

/** 필터링된 예약 목록 */
const filteredReservations = computed(() => {
  if (selectedResourceFilter.value === 'all') {
    return reservations.value
  }
  return reservations.value.filter((r) => r.resourceId === selectedResourceFilter.value)
})

/** 특정 날짜 + 시간에 해당하는 예약 조회 */
const getReservationsAt = (date, hour, minute = 0) => {
  return filteredReservations.value.filter((r) => {
    if (r.reservationDate !== date) return false

    const [startH, startM] = r.startTime.split(':').map(Number)
    const [endH, endM] = r.endTime.split(':').map(Number)

    const slotStart = hour * 60 + minute
    const resStart = startH * 60 + startM
    const resEnd = endH * 60 + endM

    return slotStart >= resStart && slotStart < resEnd
  })
}

/** 특정 날짜의 모든 예약 조회 (Month 뷰용) */
const getReservationsAtDate = (date) => {
  return filteredReservations.value.filter((r) => r.reservationDate === date)
}

/** 선택된 시간대의 예약 목록 (사이드바용) */
const selectedReservations = computed(() => {
  if (!selectedDate.value) return []

  if (selectedHour.value !== null) {
    return getReservationsAt(selectedDate.value, selectedHour.value, selectedMinute.value)
  }

  return getReservationsAtDate(selectedDate.value)
})

// ========== 이벤트 핸들러 ==========

/** 예약 카드 클릭 - 상세 모달 열기 */
const openDetailModal = (reservation) => {
  selectedReservation.value = reservation
  detailModalOpen.value = true
}

/** 예약 상세 모달 닫기 */
const closeDetailModal = () => {
  detailModalOpen.value = false
  selectedReservation.value = null
}

/** 시간대 셀 클릭 */
const selectTimeSlot = (date, hour, minute = 0) => {
  selectedDate.value = date
  selectedHour.value = hour
  selectedMinute.value = minute
  sidebarOpen.value = true
}

/** 날짜 셀 클릭 (Month 뷰) */
const selectDate = (date) => {
  selectedDate.value = date
  selectedHour.value = null
  selectedMinute.value = null
  sidebarOpen.value = true
}

/** 사이드바 닫기 */
const closeSidebar = () => {
  sidebarOpen.value = false
  selectedDate.value = null
  selectedHour.value = null
  selectedMinute.value = null
}

/** 이전 기간 이동 */
const prevPeriod = () => {
  const d = new Date(currentDate.value)
  if (viewMode.value === 'day') {
    d.setDate(d.getDate() - 1)
  } else if (viewMode.value === 'week') {
    d.setDate(d.getDate() - 7)
  } else if (viewMode.value === 'month') {
    d.setMonth(d.getMonth() - 1)
  }
  currentDate.value = d
  closeSidebar()
}

/** 다음 기간 이동 */
const nextPeriod = () => {
  const d = new Date(currentDate.value)
  if (viewMode.value === 'day') {
    d.setDate(d.getDate() + 1)
  } else if (viewMode.value === 'week') {
    d.setDate(d.getDate() + 7)
  } else if (viewMode.value === 'month') {
    d.setMonth(d.getMonth() + 1)
  }
  currentDate.value = d
  closeSidebar()
}

/** 날짜 픽커 열기 */
const openDatePicker = () => {
  // 현재 날짜를 YYYY-MM-DD 형식으로 변환
  const y = currentDate.value.getFullYear()
  const m = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  const d = String(currentDate.value.getDate()).padStart(2, '0')
  tempDateValue.value = `${y}-${m}-${d}`
  showDatePicker.value = true
}

/** 날짜 픽커 닫기 */
const closeDatePicker = () => {
  showDatePicker.value = false
}

/** 날짜 선택 적용 */
const applyDatePicker = () => {
  if (!tempDateValue.value) return

  const [year, month, day] = tempDateValue.value.split('-').map(Number)
  currentDate.value = new Date(year, month - 1, day)
  showDatePicker.value = false
  closeSidebar()
}

/** 예약 생성 모달 열기 */
const openCreateModal = () => {
  createModalOpen.value = true
}

/** 예약 생성 모달 닫기 */
const closeCreateModal = () => {
  createModalOpen.value = false
}

/** 동적 셀 높이 계산 */
const getCellHeight = (cellReservations) => {
  const baseHeight = 80
  const badgeHeight = 24
  const padding = 4

  const count = cellReservations.length
  if (count === 0) return `${baseHeight}px`

  return `${baseHeight + (count - 1) * (badgeHeight + padding)}px`
}

onMounted(() => {
  getServices()
})
</script>

<template>
  <AdminLayout>
    <div class="reservation-management-container">
      <!-- 브레드크럼 -->
      <div class="breadcrumb">
        <span class="breadcrumb-item">서비스 그룹</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item">회의실 예약</span>
      </div>

      <!-- 제목 -->
      <h1 class="page-title">예약 현황</h1>

      <!-- 상단 컨트롤 바 -->
      <div class="control-bar">
        <!-- 좌측: 월 이동 -->
        <div class="period-controls">
          <button @click="prevPeriod" class="period-nav-btn">&lt;</button>
          <button @click="openDatePicker" class="period-label-btn">
            <span class="period-label">{{ currentPeriodLabel }}</span>
          </button>
          <button @click="nextPeriod" class="period-nav-btn">&gt;</button>
        </div>

        <!-- 우측: 뷰 전환 + 필터 -->
        <div class="right-controls">
          <!-- 뷰 전환 탭 -->
          <div class="view-tabs">
            <button @click="viewMode = 'day'" :class="['view-tab', { active: viewMode === 'day' }]">
              Day
            </button>
            <button
              @click="viewMode = 'week'"
              :class="['view-tab', { active: viewMode === 'week' }]"
            >
              Week
            </button>
            <button
              @click="viewMode = 'month'"
              :class="['view-tab', { active: viewMode === 'month' }]"
            >
              Month
            </button>
          </div>

          <!-- 리소스 필터 드롭다운 -->
          <div class="filter-dropdown">
            <select v-model="selectedResourceFilter" class="filter-select">
              <option value="all">전체</option>
              <option
                v-for="resource in resources"
                :key="resource.resourceId"
                :value="resource.resourceId"
              >
                {{ resource.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 캘린더 영역 -->
      <div class="calendar-wrapper">
        <div class="calendar-container">
          <!-- Week 뷰 -->
          <div v-if="viewMode === 'week'" class="week-view">
            <!-- 헤더 -->
            <div class="week-header">
              <div class="time-column-header"></div>
              <div v-for="day in weekDays" :key="day.date" class="day-header">
                <div class="day-label">{{ day.dayLabel }} {{ day.dayNum }}</div>
              </div>
            </div>

            <!-- 시간 슬롯 그리드 -->
            <div class="week-grid">
              <div v-for="slot in timeSlots" :key="slot.time" class="time-row">
                <!-- 시간 라벨 -->
                <div class="time-label">{{ slot.time }}</div>

                <!-- 요일별 셀 -->
                <div
                  v-for="day in weekDays"
                  :key="day.date + '-' + slot.time"
                  class="time-cell"
                  :style="{
                    minHeight: getCellHeight(getReservationsAt(day.date, slot.hour, slot.minute)),
                  }"
                  @click="selectTimeSlot(day.date, slot.hour, slot.minute)"
                >
                  <!-- 예약 뱃지 -->
                  <div
                    v-for="reservation in getReservationsAt(day.date, slot.hour, slot.minute)"
                    :key="reservation.id"
                    class="reservation-badge"
                    :style="{ backgroundColor: reservation.resourceColor }"
                  >
                    <span class="badge-dot"></span>
                    <span class="badge-text">{{ reservation.resourceName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Day 뷰 -->
          <div v-if="viewMode === 'day'" class="day-view">
            <div v-for="slot in timeSlots" :key="slot.time" class="day-time-row">
              <div class="time-label">{{ slot.time }}</div>
              <div
                class="day-time-cell"
                :style="{
                  minHeight: getCellHeight(
                    getReservationsAt(currentDateStr, slot.hour, slot.minute),
                  ),
                }"
                @click="selectTimeSlot(currentDateStr, slot.hour, slot.minute)"
              >
                <div
                  v-for="reservation in getReservationsAt(currentDateStr, slot.hour, slot.minute)"
                  :key="reservation.id"
                  class="reservation-badge"
                  :style="{ backgroundColor: reservation.resourceColor }"
                >
                  <span class="badge-dot"></span>
                  <span class="badge-text">{{ reservation.resourceName }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Month 뷰 -->
          <div v-if="viewMode === 'month'" class="month-view">
            <!-- 요일 헤더 -->
            <div class="month-weekday-header">
              <div class="month-weekday-label text-red-600">Sun</div>
              <div class="month-weekday-label">Mon</div>
              <div class="month-weekday-label">Tue</div>
              <div class="month-weekday-label">Wed</div>
              <div class="month-weekday-label">Thu</div>
              <div class="month-weekday-label">Fri</div>
              <div class="month-weekday-label text-primary">Sat</div>
            </div>

            <!-- 날짜 그리드 -->
            <div class="month-grid">
              <!-- 빈 칸 -->
              <div v-for="n in blanksBefore" :key="'blank-' + n" class="month-cell-blank"></div>

              <!-- 날짜 셀 -->
              <div
                v-for="day in daysInMonth"
                :key="day.dateStr"
                class="month-cell"
                @click="selectDate(day.dateStr)"
              >
                <div
                  class="month-day-num"
                  :class="{
                    'text-red-600': day.dayOfWeek === 0,
                    'text-primary': day.dayOfWeek === 6,
                  }"
                >
                  {{ day.dayNum }}
                </div>
                <div class="month-badges">
                  <div
                    v-for="(reservation, index) in getReservationsAtDate(day.dateStr).slice(0, 3)"
                    :key="reservation.id"
                    class="reservation-badge-small"
                    :style="{ backgroundColor: reservation.resourceColor }"
                  >
                    {{ reservation.resourceName }}
                  </div>
                  <div v-if="getReservationsAtDate(day.dateStr).length > 3" class="more-badge">
                    +{{ getReservationsAtDate(day.dateStr).length - 3 }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 우측 사이드바 (슬라이드) -->
        <transition name="slide">
          <div v-if="sidebarOpen" class="sidebar">
            <!-- 닫기 버튼 -->
            <button @click="closeSidebar" class="sidebar-close-btn">&times;</button>

            <!-- 예약 카드 목록 -->
            <div class="sidebar-content">
              <div
                v-for="reservation in selectedReservations"
                :key="reservation.id"
                class="reservation-card"
                :style="{ borderLeftColor: reservation.resourceColor }"
                @click="openDetailModal(reservation)"
              >
                <h3 class="card-title">{{ reservation.resourceName }}</h3>
                <p class="card-info">
                  <span class="card-icon">📅</span>
                  {{ reservation.createdAt }}
                </p>
                <p class="card-info">
                  <span class="card-icon">👤</span>
                  {{ reservation.userName }}
                </p>
              </div>

              <!-- 예약 없음 -->
              <div v-if="selectedReservations.length === 0" class="no-reservations">
                선택된 시간대에 예약이 없습니다.
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 날짜 픽커 모달 (TODO: 추후 구현) -->
      <!-- <CreateReservationModal :open="createModalOpen" @close="closeCreateModal" /> -->

      <!-- 날짜 픽커 모달 -->
      <div v-if="showDatePicker" class="date-picker-overlay" @click="closeDatePicker">
        <div class="date-picker-modal" @click.stop>
          <div class="date-picker-header">
            <h3 class="date-picker-title">날짜 선택</h3>
            <button @click="closeDatePicker" class="date-picker-close-btn">&times;</button>
          </div>

          <div class="date-picker-body">
            <label class="date-picker-label">날짜 선택</label>
            <input v-model="tempDateValue" type="date" class="date-picker-input" />
          </div>

          <div class="date-picker-footer">
            <button @click="closeDatePicker" class="date-picker-cancel-btn">취소</button>
            <button @click="applyDatePicker" class="date-picker-confirm-btn">적용</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 예약 상세 모달 -->
    <Modal :open="detailModalOpen" @close="closeDetailModal">
      <div class="detail-modal">
        <!-- 모달 헤더 -->
        <div class="detail-modal-header">
          <h2 class="detail-modal-title">예약 상세</h2>
          <button @click="closeDetailModal" class="detail-modal-close-btn">✕</button>
        </div>

        <!-- 모달 본문 -->
        <div v-if="selectedReservation" class="detail-modal-body">
          <!-- 예약자 -->
          <div class="detail-field">
            <label class="detail-label">예약자 *</label>
            <input
              type="text"
              :value="selectedReservation.userName"
              class="detail-input"
              disabled
            />
          </div>

          <!-- 예약 일시 -->
          <div class="detail-field">
            <label class="detail-label">예약 일시</label>
            <input
              type="text"
              :value="selectedReservation.reservationDate"
              class="detail-input"
              disabled
            />
          </div>

          <!-- 예약 날짜 -->
          <div class="detail-field">
            <label class="detail-label">예약 날짜 *</label>
            <input
              type="text"
              :value="selectedReservation.reservationDate"
              class="detail-input"
              disabled
            />
          </div>

          <!-- 예약 시간 -->
          <div class="detail-field">
            <label class="detail-label">예약 시간 *</label>
            <input
              type="text"
              :value="`${selectedReservation.startTime} ~ ${selectedReservation.endTime}`"
              class="detail-input"
              disabled
            />
          </div>

          <!-- 인원수 -->
          <div class="detail-field">
            <label class="detail-label">인원수</label>
            <input type="text" value="5명" class="detail-input" disabled />
          </div>
        </div>

        <!-- 모달 푸터 -->
        <div class="detail-modal-footer">
          <button @click="closeDetailModal" class="detail-cancel-btn">삭제</button>
          <button @click="closeDetailModal" class="detail-submit-btn">수정</button>
        </div>
      </div>
    </Modal>
  </AdminLayout>
</template>

<style scoped>
/* ========== 레이아웃 ========== */
.reservation-management-container {
  @apply w-full h-full flex flex-col;
}

/* ========== 브레드크럼 ========== */
.breadcrumb {
  @apply flex items-center gap-2 text-sm text-gray-600 mb-2;
}

.breadcrumb-item {
  @apply text-gray-600;
}

.breadcrumb-separator {
  @apply text-gray-400;
}

/* ========== 페이지 제목 ========== */
.page-title {
  @apply text-2xl font-bold text-text mb-6;
}

/* ========== 상단 컨트롤 바 ========== */
.control-bar {
  @apply flex items-center justify-between mb-4;
}

.period-controls {
  @apply flex items-center gap-3;
}

.period-nav-btn {
  @apply w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors;
}

.period-label-btn {
  @apply hover:bg-gray-100 rounded px-2 py-1 transition-colors cursor-pointer;
}

.period-label {
  @apply text-base font-medium min-w-[120px] text-center;
}

.right-controls {
  @apply flex items-center gap-3;
}

/* ========== 뷰 전환 탭 ========== */
.view-tabs {
  @apply flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-lg p-1 h-9 shadow-sm;
}

.view-tab {
  @apply w-20 px-4 py-1 text-sm font-medium text-gray-600 rounded transition-colors;
}

.view-tab.active {
  @apply bg-white text-primary shadow-sm;
}

.view-tab:hover:not(.active) {
  @apply bg-gray-200;
}

/* ========== 필터 드롭다운 ========== */
.filter-dropdown {
  @apply relative;
}

.filter-select {
  @apply h-9 px-1 py-1 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer focus:outline-none focus:border-primary shadow-sm;
}

/* ========== 캘린더 영역 ========== */
.calendar-wrapper {
  @apply flex-1 flex gap-4 overflow-hidden;
}

.calendar-container {
  @apply flex-1 bg-white rounded-lg border border-gray-200 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-50px)];
}

/* ========== Week 뷰 ========== */
.week-view {
  @apply w-full min-w-0;
}

.week-header {
  @apply grid grid-cols-8 border-b border-gray-200 sticky top-0 bg-white z-10;
}

.time-column-header {
  @apply min-w-[77px] w-full border-r border-gray-200;
}

.day-header {
  @apply flex items-center justify-center py-3 border-r border-gray-200 last:border-r-0;
}

.day-label {
  @apply text-sm font-medium text-gray-700;
}

.week-grid {
  @apply w-full;
}

.time-row {
  @apply grid grid-cols-8 border-b border-gray-200 last:border-b-0;
}

.time-label {
  @apply min-w-[77px] w-full flex items-start justify-center items-center px-[38px] text-xs text-gray-500 border-r border-gray-200;
}

.time-cell {
  @apply border-r border-gray-200 last:border-r-0 p-1 cursor-pointer hover:bg-blue-50 transition-colors flex flex-col gap-1;
}

/* ========== Day 뷰 ========== */
.day-view {
  @apply w-full;
}

.day-time-row {
  @apply flex border-b border-gray-200 last:border-b-0;
}

.day-time-cell {
  @apply flex-1 min-w-[1500px] w-full p-2 cursor-pointer hover:bg-blue-50 transition-colors flex flex-col gap-1;
}

/* ========== Month 뷰 ========== */
.month-view {
  @apply w-full p-4;
}

.month-weekday-header {
  @apply grid grid-cols-7 gap-0 mb-2;
}

.month-weekday-label {
  @apply flex items-center justify-center text-center text-xs font-semibold text-gray-500;
}

.month-grid {
  @apply grid grid-cols-7 gap-0;
}

.month-cell-blank {
  @apply h-24;
}

.month-cell {
  @apply h-24 border border-gray-100 p-2 cursor-pointer hover:bg-blue-50 transition-colors flex flex-col;
}

.month-day-num {
  @apply text-sm text-gray-400 font-medium mb-1;
}

.month-badges {
  @apply flex flex-col gap-1 overflow-hidden;
}

.reservation-badge-small {
  @apply text-xs text-white px-2 py-0.5 rounded truncate;
}

.more-badge {
  @apply text-xs text-gray-600 font-medium;
}

/* ========== 예약 뱃지 ========== */
.reservation-badge {
  @apply flex items-center gap-1 px-2 py-1 rounded text-white text-xs;
}

.badge-dot {
  @apply w-1.5 h-1.5 rounded-full bg-white;
}

.badge-text {
  @apply truncate;
}

/* ========== 우측 사이드바 ========== */
.sidebar {
  @apply w-80 bg-white border-l border-gray-200 rounded-lg p-4 overflow-y-auto relative;
}

.sidebar-close-btn {
  @apply absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-2xl text-gray-500 hover:text-gray-800 transition-colors;
}

.sidebar-content {
  @apply mt-8 flex flex-col gap-3;
}

/* ========== 예약 카드 ========== */
.reservation-card {
  @apply bg-white rounded-lg p-4 border border-l-4 shadow-md;
}

.card-title {
  @apply text-base font-bold mb-2;
}

.card-info {
  @apply flex items-center gap-2 text-sm text-gray-600 mb-1;
}

.card-icon {
  @apply text-base;
}

/* ========== 예약 없음 ========== */
.no-reservations {
  @apply text-center text-gray-500 py-8;
}

/* ========== 슬라이드 애니메이션 ========== */
.slide-enter-active,
.slide-leave-active {
  @apply transition-transform duration-300;
}

.slide-enter-from,
.slide-leave-to {
  @apply translate-x-full;
}

/* ========== 날짜 픽커 모달 ========== */
.date-picker-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.date-picker-modal {
  @apply bg-white rounded-lg shadow-xl w-96 max-w-md;
}

.date-picker-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.date-picker-title {
  @apply text-lg font-bold;
}

.date-picker-close-btn {
  @apply w-8 h-8 flex items-center justify-center text-2xl text-gray-500 hover:text-gray-800 transition-colors;
}

.date-picker-body {
  @apply p-6;
}

.date-picker-label {
  @apply block text-sm font-medium mb-2;
}

.date-picker-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary;
}

.date-picker-footer {
  @apply flex items-center justify-end gap-2 p-4 border-t border-gray-200;
}

.date-picker-cancel-btn {
  @apply px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors;
}

.date-picker-confirm-btn {
  @apply px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors;
}

/* ========== 예약 상세 모달 ========== */
.detail-modal {
  @apply w-full;
}

.detail-modal-header {
  @apply flex items-center justify-between mb-6;
}

.detail-modal-title {
  @apply text-xl font-bold;
}

.detail-modal-close-btn {
  @apply w-8 h-8 flex items-center justify-center text-2xl text-gray-500 hover:text-gray-800 transition-colors;
}

.detail-modal-body {
  @apply flex flex-col gap-4 mb-6;
}

.detail-field {
  @apply flex flex-col gap-2;
}

.detail-label {
  @apply text-sm font-medium text-gray-700;
}

.detail-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600;
}

.detail-modal-footer {
  @apply flex items-center justify-center gap-2;
}

.detail-cancel-btn {
  @apply px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors;
}

.detail-submit-btn {
  @apply px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors;
}

/* 예약 카드에 hover 효과 추가 */
.reservation-card {
  @apply bg-white rounded-lg p-4 border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow;
}
</style>
