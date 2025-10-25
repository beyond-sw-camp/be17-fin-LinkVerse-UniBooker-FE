<script setup>
import { ref, computed, defineEmits } from 'vue'

const emits = defineEmits(['select'])

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
          'is-today': isToday(day)
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
</style>