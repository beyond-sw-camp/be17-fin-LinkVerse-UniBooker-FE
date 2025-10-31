<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import serviceApi from '@/services/service/service_api'
import reservationApi from '@/services/reservation/reservation_api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const serviceGroupId = route.params.serviceGroupId
const serviceGroupName = route.query.serviceGroupName

// ========== 상태 관리 ==========
const selectedReservation = ref(null)
const viewMode = ref('week')
const currentDate = ref(new Date())
const sidebarOpen = ref(false)
const selectedDate = ref(null)
const selectedHour = ref(null)
const selectedMinute = ref(null)
const selectedResourceFilter = ref('all')
const showDatePicker = ref(false)
const tempDateValue = ref('')
const loading = ref(true)
const services = ref([])
const reservations = ref([])
const selectedResourceInSlot = ref(null) // 배지 클릭 시 리소스 정보 저장

// 색상 팔레트
const colorPalette = [
  '#FF69B4',
  '#FFD700',
  '#32CD32',
  '#1E90FF',
  '#FF8C00',
  '#BA55D3',
  '#00CED1',
  '#DC143C',
  '#8A2BE2',
  '#20B2AA',
]

// ========== 브레드크럼 ==========
const breadcrumbItems = [
  { label: '서비스 그룹', path: `/admin/service-group-management` },
  { label: serviceGroupName, path: `` },
]

// ========== 유틸 함수 ==========
const dateToStr = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
const hhmmToMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const overlaps = (slotStartMin, slotEndMin, resStartMin, resEndMin) =>
  slotStartMin < resEndMin && slotEndMin > resStartMin

// ========== 시간 슬롯 ==========
const timeSlots = ref(
  Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    hour: i,
    minute: 0,
  })),
)

// ========== 현재 기간 정보 ==========
const currentDateStr = computed(() => dateToStr(currentDate.value))

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

// ========== 월별 뷰 계산 ==========
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
      dayOfWeek: d.getDay(), // 0(일)~6(토)
    })
  }
  return arr
})

const blanksBefore = computed(() => {
  const first = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  return first.getDay()
})

const getReservationsAtDate = (date) =>
  filteredReservations.value.filter((r) => r.reservationDate === date)

const selectDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  currentDate.value = new Date(y, m - 1, d)
  selectedDate.value = dateStr
  selectedHour.value = null
  selectedMinute.value = null
  selectedResourceInSlot.value = null
  // UX: 날짜 클릭 시 Day 뷰로 전환 (원하면 유지해도 됨)
  viewMode.value = 'day'
  sidebarOpen.value = false
}

// ========== API 호출 ==========
const getServices = async () => {
  try {
    const response = await serviceApi.getServices(serviceGroupId)
    services.value = response.map((service, index) => ({
      ...service,
      color: colorPalette[index % colorPalette.length],
    }))

    for (const service of services.value) {
      const serviceReservations = await getReservations(service.id, service.color)
      reservations.value.push(...serviceReservations)
    }

    loading.value = false
  } catch (error) {
    console.error('getServices error:', error)
  }
}

const getReservations = async (serviceId, color) => {
  try {
    const svc = services.value.find((s) => Number(s.id) === Number(serviceId))
    const capacity = Number(svc?.capacity ?? 0)
    const serviceName = svc?.name || 'Unknown'

    const response = await reservationApi.getServiceReservations(serviceId)

    return response.map((r) => {
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)
      return {
        ...r,
        resourceId: Number(r.resourceId ?? serviceId),
        resourceCapacity: capacity,
        resourceName: serviceName,
        resourceColor: color,
        reservationDate: r.startDate.split('T')[0],
        startTime: `${String(start.getHours()).padStart(2, '0')}:${String(
          start.getMinutes(),
        ).padStart(2, '0')}`,
        endTime: `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(
          2,
          '0',
        )}`,
      }
    })
  } catch (error) {
    console.error(`getReservations(${serviceId}) error:`, error)
    return []
  }
}

// ========== 슬롯별 예약 조회 ==========
const filteredReservations = computed(() => {
  if (selectedResourceFilter.value === 'all') return reservations.value
  return reservations.value.filter((r) => r.resourceId === selectedResourceFilter.value)
})

const getReservationsAt = (date, hour, minute = 0) => {
  const slotStartMin = hour * 60 + minute
  const slotEndMin = slotStartMin + 60
  return filteredReservations.value.filter((r) => {
    if (r.reservationDate !== date) return false
    if (r.status && r.status !== 'CONFIRMED') return false
    const resStartMin = hhmmToMin(r.startTime)
    const resEndMin = hhmmToMin(r.endTime)
    return overlaps(slotStartMin, slotEndMin, resStartMin, resEndMin)
  })
}

// 리소스별 예약 요약
const getSlotSummaries = (date, hour, minute = 0) => {
  const slotStartMin = hour * 60 + minute
  const slotEndMin = slotStartMin + 60
  const inSlot = filteredReservations.value.filter((r) => {
    if (r.reservationDate !== date) return false
    if (r.status && r.status !== 'CONFIRMED') return false
    const resStartMin = hhmmToMin(r.startTime)
    const resEndMin = hhmmToMin(r.endTime)
    return overlaps(slotStartMin, slotEndMin, resStartMin, resEndMin)
  })

  const map = new Map()
  for (const r of inSlot) {
    const key = r.resourceId
    if (!map.has(key)) {
      const service = services.value.find((s) => s.id === r.resourceId)
      map.set(key, {
        resourceId: r.resourceId,
        resourceName: r.resourceName,
        resourceColor: r.resourceColor,
        capacity: service?.capacity || 0,
        count: 0,
        reservations: [],
      })
    }
    const g = map.get(key)
    g.count += 1
    g.reservations.push(r)
  }
  return Array.from(map.values())
}

const slotSummariesForSidebar = computed(() => {
  if (!selectedDate.value || selectedHour.value == null) return []
  return getSlotSummaries(selectedDate.value, selectedHour.value, selectedMinute.value || 0)
})

// 현재 기간 표시 문자열
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
  const y = currentDate.value.getFullYear()
  const m = currentDate.value.getMonth()
  const d = currentDate.value.getDate()

  if (viewMode.value === 'day') {
    return `${y}. ${m + 1}. ${d}.`
  } else if (viewMode.value === 'week') {
    return `${months[m]} ${y}`
  } else {
    return `${months[m]} ${y}`
  }
})

// ========== 셀/사이드바 ==========
const selectTimeSlot = (date, hour, minute = 0) => {
  selectedDate.value = date
  selectedHour.value = hour
  selectedMinute.value = minute
  selectedResourceInSlot.value = null
  sidebarOpen.value = true
}

const selectTimeSlotForResource = (date, hour, minute, summary) => {
  selectedDate.value = date
  selectedHour.value = hour
  selectedMinute.value = minute
  selectedResourceInSlot.value = summary
  sidebarOpen.value = true
}

const selectedReservations = computed(() => {
  if (!selectedDate.value) return []
  if (selectedResourceInSlot.value) return selectedResourceInSlot.value.reservations
  if (selectedHour.value !== null)
    return getReservationsAt(selectedDate.value, selectedHour.value, selectedMinute.value)
  return filteredReservations.value.filter((r) => r.reservationDate === selectedDate.value)
})

const showCountsOnly = computed(() => !!selectedResourceInSlot.value)
const selectedCount = computed(() => selectedResourceInSlot.value?.count ?? 0)

const getCellHeightBySummaries = (summaries) => {
  const baseHeight = 80
  const badgeHeight = 24
  const padding = 4
  const count = summaries.length
  if (count === 0) return `${baseHeight}px`
  return `${baseHeight + (count - 1) * (badgeHeight + padding)}px`
}

const closeSidebar = () => (sidebarOpen.value = false)

// ========== 날짜 이동/선택 ==========
const prevPeriod = () => {
  const d = new Date(currentDate.value)
  if (viewMode.value === 'day') d.setDate(d.getDate() - 1)
  else if (viewMode.value === 'week') d.setDate(d.getDate() - 7)
  else if (viewMode.value === 'month') d.setMonth(d.getMonth() - 1)
  currentDate.value = d
  closeSidebar()
}
const nextPeriod = () => {
  const d = new Date(currentDate.value)
  if (viewMode.value === 'day') d.setDate(d.getDate() + 1)
  else if (viewMode.value === 'week') d.setDate(d.getDate() + 7)
  else if (viewMode.value === 'month') d.setMonth(d.getMonth() + 1)
  currentDate.value = d
  closeSidebar()
}

// ========== 날짜 선택 ==========
const openDatePicker = () => {
  const y = currentDate.value.getFullYear()
  const m = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  const d = String(currentDate.value.getDate()).padStart(2, '0')
  tempDateValue.value = `${y}-${m}-${d}`
  showDatePicker.value = true
}
const closeDatePicker = () => (showDatePicker.value = false)
const applyDatePicker = () => {
  if (!tempDateValue.value) return
  const [year, month, day] = tempDateValue.value.split('-').map(Number)
  currentDate.value = new Date(year, month - 1, day)
  showDatePicker.value = false
  closeSidebar()
}

// ========== 네비게이션 (사이드바 카드 클릭) ==========
const goToSeatReservation = (serviceId) => {
  if (!serviceId) return
  router.push(`/admin/seat-reservation-management/${serviceId}`)
}

// ========== 실행 ==========
onMounted(() => {
  getServices()
})
</script>

<template>
  <AdminLayout>
    <div v-if="!loading.valueOf()">
      <div class="reservation-management-container">
        <!-- 브레드크럼 -->
        <Breadcrumb :items="breadcrumbItems" />

        <!-- 제목 -->
        <h1 class="page-title">예약 현황</h1>

        <!-- 상단 컨트롤 바 -->
        <div class="control-bar">
          <div class="period-controls">
            <button @click="prevPeriod" class="period-nav-btn">&lt;</button>
            <button @click="openDatePicker" class="period-label-btn">
              <span class="period-label">{{ currentPeriodLabel }}</span>
            </button>
            <button @click="nextPeriod" class="period-nav-btn">&gt;</button>
          </div>

          <div class="right-controls">
            <div class="view-tabs">
              <button
                @click="viewMode = 'day'"
                :class="['view-tab', { active: viewMode === 'day' }]"
              >
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

            <div class="filter-dropdown">
              <select v-model="selectedResourceFilter" class="filter-select">
                <option value="all">전체</option>
                <option v-for="service in services" :key="service.id" :value="service.id">
                  {{ service.name }}
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
              <div class="week-header">
                <div class="time-column-header"></div>
                <div v-for="day in weekDays" :key="day.date" class="day-header">
                  <div class="day-label">{{ day.dayLabel }} {{ day.dayNum }}</div>
                </div>
              </div>

              <div class="week-grid">
                <div v-for="slot in timeSlots" :key="slot.time" class="time-row">
                  <div class="time-label">{{ slot.time }}</div>

                  <div
                    v-for="day in weekDays"
                    :key="day.date + '-' + slot.time"
                    class="time-cell"
                    :style="{
                      minHeight: getCellHeightBySummaries(
                        getSlotSummaries(day.date, slot.hour, slot.minute),
                      ),
                    }"
                    @click="selectTimeSlot(day.date, slot.hour, slot.minute)"
                  >
                    <div
                      v-for="summary in getSlotSummaries(day.date, slot.hour, slot.minute)"
                      :key="summary.resourceId"
                      class="reservation-badge"
                      :style="{ backgroundColor: summary.resourceColor }"
                      @click.stop="
                        selectTimeSlotForResource(day.date, slot.hour, slot.minute, summary)
                      "
                    >
                      <span class="badge-dot"></span>
                      <span class="badge-text">{{ summary.resourceName }}</span>
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
                    minHeight: getCellHeightBySummaries(
                      getSlotSummaries(currentDateStr, slot.hour, slot.minute),
                    ),
                  }"
                  @click="selectTimeSlot(currentDateStr, slot.hour, slot.minute)"
                >
                  <div
                    v-for="summary in getSlotSummaries(currentDateStr, slot.hour, slot.minute)"
                    :key="summary.resourceId"
                    class="reservation-badge"
                    :style="{ backgroundColor: summary.resourceColor }"
                    @click.stop="
                      selectTimeSlotForResource(currentDateStr, slot.hour, slot.minute, summary)
                    "
                  >
                    <span class="badge-dot"></span>
                    <span class="badge-text">{{ summary.resourceName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Month 뷰 -->
            <div v-if="viewMode === 'month'" class="month-view">
              <div class="month-weekday-header">
                <div class="month-weekday-label text-red-600">Sun</div>
                <div class="month-weekday-label">Mon</div>
                <div class="month-weekday-label">Tue</div>
                <div class="month-weekday-label">Wed</div>
                <div class="month-weekday-label">Thu</div>
                <div class="month-weekday-label">Fri</div>
                <div class="month-weekday-label text-primary">Sat</div>
              </div>

              <div class="month-grid">
                <div v-for="n in blanksBefore" :key="'blank-' + n" class="month-cell-blank"></div>

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

          <!-- 우측 사이드바 -->
          <transition name="slide">
            <div v-if="sidebarOpen" class="sidebar">
              <button @click="closeSidebar" class="sidebar-close-btn">&times;</button>

              <div class="sidebar-content">
                <div class="slot-brief">
                  <strong>선택된 시간</strong> :
                  <span>
                    {{ selectedDate }}
                    {{ String(selectedHour).padStart(2, '0') }}:{{
                      String(selectedMinute || 0).padStart(2, '0')
                    }}
                  </span>
                </div>

                <!-- 카드 클릭 시 예약 관리 페이지로 이동 -->
                <div
                  v-for="summary in slotSummariesForSidebar"
                  :key="summary.resourceId"
                  class="reservation-card"
                  :style="{ borderLeftColor: summary.resourceColor, cursor: 'pointer' }"
                  @click="goToSeatReservation(summary.resourceId)"
                  title="예약 관리로 이동"
                >
                  <h3 class="card-title">{{ summary.resourceName }}</h3>
                  <p class="card-info">
                    <span class="card-icon">👤</span>
                    총 {{ summary.count }} / {{ summary.capacity }} 예약됨
                  </p>
                </div>

                <div v-if="slotSummariesForSidebar.length === 0" class="no-reservations">
                  선택된 시간대에 예약된 리소스가 없습니다.
                </div>
              </div>
            </div>
          </transition>
        </div>

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
    </div>

    <div v-else class="loading-screen">loading...</div>
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

/* 로딩 화면 */
.loading-screen {
  @apply flex justify-center items-center h-screen;
}
</style>
