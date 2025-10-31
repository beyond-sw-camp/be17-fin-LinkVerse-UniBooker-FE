<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

const emits = defineEmits(['select'])
const props = defineProps({
  disabledDates: { // 부모에서 비활성화 시킬 날짜
    type: Array,
    default: () => []
  },
  selectedDate: { // 부모에서 현재 선택된 날짜
    type: String,
    default: null
  }
})

/* 상수 */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

/* 상태 */
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const selectedDate = ref(today.getDate())

// 이번 달의 첫째 날 요일
const firstDayOfMonth = computed(() => 
  new Date(currentYear.value, currentMonth.value, 1).getDay()
)

// 이번 달의 마지막 날짜
const daysInMonth = computed(() => 
  new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
)

/* 메서드 */
// 날짜 선택
function selectDate(day) {
  if (isDisabled(day)) return // 비활성 날짜 선택 불가
  selectedDate.value = day
  const date = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  emits('select', date)
}

// 이전 달로 이동
function prevMonth() {
  currentMonth.value = currentMonth.value === 0 ? 11 : currentMonth.value - 1
  if (currentMonth.value === 11) currentYear.value--
  selectedDate.value = null // 달을 넘길 때 선택은 초기화
}

// 다음 달로 이동
function nextMonth() {
  currentMonth.value = currentMonth.value === 11 ? 0 : currentMonth.value + 1
  if (currentMonth.value === 0) currentYear.value++
  selectedDate.value = null // 달을 넘길 때 선택은 초기화
}

// 오늘 날짜 여부 확인
function isToday(day) {
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  )
}

// 비활성 날짜 확인
function isDisabled(day) {
  const date = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return props.disabledDates.includes(date)
}

/*
// 달력에 이전, 다음달 날짜 표시
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  const days = []

  // 이전 달 날짜 채우기
  for (let i = firstDay.getDay() - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    days.push({
      day,
      dateStr: date.toISOString().slice(0, 10),
      currentMonth: false
    })
  }

  // 이번 달 날짜
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    days.push({
      day: d,
      dateStr: date.toISOString().slice(0, 10),
      currentMonth: true
    })
  }

  // 다음 달 날짜 채우기
  const total = days.length
  const nextDaysCount = 42 - total
  for (let n = 1; n <= nextDaysCount; n++) {
    const date = new Date(year, month + 1, n)
    days.push({
      day: n,
      dateStr: date.toISOString().slice(0, 10),
      currentMonth: false
    })
  }

  return days
})
*/

watch(() => props.selectedDate, (newDate) => {
    if (!newDate) return

    const dateObj = new Date(newDate)
    if (isNaN(dateObj)) return // 유효하지 않으면 무시

    // 부모에서 받은 날짜로 현재 달력 이동 및 선택 표시
    currentYear.value = dateObj.getFullYear()
    currentMonth.value = dateObj.getMonth()
    selectedDate.value = dateObj.getDate()
  },
  { immediate: true } // 모달이 처음 열릴 때도 바로 반영되게
)
</script>

<template>
  <div class="calendar-container">
    <!-- 헤더 -->
    <div class="calendar-header">
      <button @click="prevMonth">
        <img src="/assets/icons/ic-left-arrow.png" alt="previous" class="w-6 h-6">
      </button>
      <h2 class="current-month">
        {{ MONTHS[currentMonth] }} {{ currentYear }}
      </h2>
      <button @click="nextMonth">
        <img src="/assets/icons/ic-right-arrow.png" alt="next" class="w-6 h-6">
      </button>
    </div>
    
    <!-- 요일 -->
    <div class="weekday-grid">
      <div v-for="day in DAYS_OF_WEEK" :key="day">{{ day }}</div>
    </div>
    
    <!-- 날짜 -->
    <div class="date-grid">
      <div v-for="n in firstDayOfMonth" :key="'empty-' + n"></div>

      <!-- 날짜 표시 -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        @click="selectDate(day)"
        class="date-cell"
        :class="{
          'is-selected': day === selectedDate,
          'is-today': isToday(day),
          'is-disabled': isDisabled(day)          
        }"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 캘린더 컨테이너 */
.calendar-container {
  @apply max-w-sm mx-auto p-7 bg-white rounded-lg shadow;
}

/* 헤더 */
.calendar-header {
  @apply flex justify-between items-center mb-7;
}
.current-month {
  @apply text-gray-dark text-xl;
}

/* 요일 */
.weekday-grid {
  @apply grid grid-cols-7 text-center text-gray-dark/50 text-sm mb-7 gap-4;
}

/* 날짜 */
.date-grid {
  @apply grid grid-cols-7 text-center text-gray-dark text-xl gap-4;
}

/* 개별 날짜 셀 */
.date-cell {
  @apply cursor-pointer rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200;
}

.date-cell:not(.is-selected):hover {
  @apply bg-gray-line;
}

.is-selected {
  @apply text-white bg-primary;
}

.is-today {
  position: relative;
}
.is-today::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: theme('colors.primary');
}

.is-selected.is-today::after {
  background-color: theme('colors.white');
}

.is-disabled {
  @apply text-gray-400 cursor-not-allowed opacity-50;
}
.is-disabled:hover {
  @apply bg-transparent;
}
</style>