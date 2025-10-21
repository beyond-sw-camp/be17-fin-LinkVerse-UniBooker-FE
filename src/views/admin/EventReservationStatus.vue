<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'  
import AdminLayout from '@/components/AdminLayout.vue'

/* 예시 데이터 */
const services = ref([
  { id: 1, title: '보드게임 동아리 모집', startDate: '2025-10-20', endDate: '2025-10-26', isFull: false },
  { id: 2, title: '밴드 동아리 모집', startDate: '2025-10-18', endDate: '2025-10-23', isFull: true },
  { id: 3, title: '캠퍼스 플리마켓 부스 신청', startDate: '2025-10-21', endDate: '2025-10-27', isFull: false },
  { id: 4, title: '공예 클래스 참가 모집', startDate: '2025-10-16', endDate: '2025-10-22', isFull: false },
  { id: 5, title: '스포츠 체험단 신청', startDate: '2025-10-19', endDate: '2025-10-25', isFull: false },
  { id: 6, title: '악기 대여 신청', startDate: '2025-10-22', endDate: '2025-10-29', isFull: true },
  { id: 7, title: '사진 동아리 신규 회원 모집', startDate: '2025-10-23', endDate: '2025-10-30', isFull: true },
  { id: 8, title: '독서 모임 신청', startDate: '2025-10-17', endDate: '2025-10-21', isFull: false },
  { id: 9, title: '헬스클럽 회원 모집', startDate: '2025-10-25', endDate: '2025-10-31', isFull: false },
  { id: 10, title: '봉사활동 신청', startDate: '2025-10-20', endDate: '2025-10-24', isFull: false },
])

const router = useRouter()

/* --- 날짜 및 네비게이션 로직 --- */
const today = new Date()
today.setHours(0, 0, 0, 0)
const currentDate = ref(new Date(today))

/* 주간 날짜 계산 (오늘을 중앙에 배치) */
const weekDates = computed(() => {
  const centerIndex = 3 // 중앙(4번째 칸)에 오늘 오게
  const start = new Date(currentDate.value)
  start.setDate(start.getDate() - centerIndex)
  start.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
})

/* 주간 이동 함수 */
const goPrevWeek = () => currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() - 7))
const goNextWeek = () => currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + 7))


/* --- 정렬 및 필터링 로직 --- */
const sortedServices = computed(() => {
  const weekStart = weekDates.value[0];
  const weekEnd = new Date(weekDates.value[6]);
  weekEnd.setHours(23, 59, 59, 999);

  const visibleServices = services.value.filter(service => {
    const serviceStart = new Date(service.startDate);
    const serviceEnd = new Date(service.endDate);
    serviceEnd.setHours(23, 59, 59, 999);
    return serviceStart <= weekEnd && serviceEnd >= weekStart;
  });

  return visibleServices.sort((a, b) => {
    const as = +new Date(a.startDate), bs = +new Date(b.startDate)
    if (as !== bs) return as - bs
    const ad = +new Date(a.endDate) - as
    const bd = +new Date(b.endDate) - bs
    return bd - ad
  })
})

/* --- 스타일 계산 로직 --- */
const formatDate = (date, fmt='short') => {
  if (fmt === 'weekday') return date.toLocaleString('en-US', { weekday:'short' })
  if (fmt === 'day') return date.getDate()
  return date.toISOString().split('T')[0].replace(/-/g,'/')
}

const CELL_PCT = 100 / 7, ROW_H = 30, ROW_GAP = 10, TOP_OFFSET = 8

const getBarStyle = (service, index) => {
  const s0 = new Date(weekDates.value[0]); s0.setHours(0,0,0,0)
  const s6 = new Date(weekDates.value[6]); s6.setHours(0,0,0,0)
  const svcS = new Date(service.startDate); svcS.setHours(0,0,0,0)
  const svcE = new Date(service.endDate);   svcE.setHours(0,0,0,0)

  const barS = svcS < s0 ? s0 : svcS
  const barE = svcE > s6 ? s6 : svcE

  const startIdx = Math.max(0, Math.round((barS - s0) / 86400000))
  const days = Math.max(1, Math.round((barE - barS) / 86400000) + 1)

  return {
    left: `calc(${startIdx * CELL_PCT}% + 1px)`,
    width: `calc(${days * CELL_PCT}% - 2px)`,
    top: `${TOP_OFFSET + index * (ROW_H + ROW_GAP)}px`,
    height: `${ROW_H}px`,
    zIndex: 10 + index,
  }
}

/* --- 스와이프 로직 (개선됨) --- */
const isDragging = ref(false)
const startX = ref(0)
const timelineEl = ref(null) // 타임라인 DOM 요소를 참조
const swipeThreshold = 50

// 마우스를 누를 때
const onMouseDown = (e) => {
  isDragging.value = true
  startX.value = e.clientX
  timelineEl.value.style.transition = 'none' // 드래그 중에는 애니메이션 효과를 끔
}

// 마우스를 움직일 때
const onMouseMove = (e) => {
  if (isDragging.value) {
    const deltaX = e.clientX - startX.value
    timelineEl.value.style.transform = `translateX(${deltaX}px)` // 마우스를 따라 움직임
  }
}

// 마우스를 뗄 때
const onMouseUp = (e) => {
  if (!isDragging.value) return
  isDragging.value = false
  const deltaX = e.clientX - startX.value
  
  timelineEl.value.style.transition = 'transform 0.3s ease' // 애니메이션 효과 다시 켬

  if (deltaX > swipeThreshold) { // 오른쪽으로 충분히 스와이프
    timelineEl.value.style.transform = 'translateX(100%)' // 오른쪽으로 완전히 슬라이드 아웃
    setTimeout(() => {
      goPrevWeek()
      timelineEl.value.style.transition = 'none'
      timelineEl.value.style.transform = 'translateX(0)'
    }, 300)
  } else if (deltaX < -swipeThreshold) { // 왼쪽으로 충분히 스와이프
    timelineEl.value.style.transform = 'translateX(-100%)' // 왼쪽으로 완전히 슬라이드 아웃
    setTimeout(() => {
      goNextWeek()
      timelineEl.value.style.transition = 'none'
      timelineEl.value.style.transform = 'translateX(0)'
    }, 300)
  } else { // 스와이프 거리가 충분하지 않으면
    timelineEl.value.style.transform = 'translateX(0)' // 제자리로 복귀
  }
}

// 마우스가 영역을 벗어날 때
const onMouseLeave = () => {
  if (isDragging.value) {
    isDragging.value = false
    timelineEl.value.style.transition = 'transform 0.3s ease'
    timelineEl.value.style.transform = 'translateX(0)' // 드래그 중 벗어나면 제자리로 복귀
  }
}

const goToReservationPage = () => {
  router.push('/admin/event-reservation-management')
}

/* ✅ 색상 통일 함수 */
const getBarColor = (svc) => {
  return svc.isFull
    ? 'bg-gray-200 border-gray-300 text-gray-500'
    : 'bg-blue-100 border-blue-300 text-blue-800'
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- 상단 컨트롤 -->
      <div class="flex items-center justify-between">
        <h1 class="page-title">예약 현황</h1>
        <div class="flex items-center gap-2">
          <button @click="goPrevWeek" class="nav-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button @click="goNextWeek" class="nav-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <!-- 캘린더 패널 -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <!-- 헤더 -->
        <div class="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        <div
          v-for="d in weekDates"
          :key="d"
          class="py-2"
          :class="{ 'text-text font-semibold': d.toDateString() === new Date().toDateString() }"
        >
          <div>{{ formatDate(d,'weekday') }}</div>
          <div class="font-semibold text-gray-700">{{ formatDate(d,'day') }}</div>
        </div>

        </div>

        <!-- 타임라인 영역 -->
        <div 
          class="relative h-[450px] rounded-lg timeline-bg overflow-hidden"
          :class="{ 'cursor-grabbing': isDragging }"
          @mousedown.prevent="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseLeave"
        >
          <!-- 막대들을 감싸는 컨테이너 (ref로 참조) -->
          <div ref="timelineEl" class="absolute inset-0">
            <div
              v-for="(svc, idx) in sortedServices"
              :key="svc.id"
              class="reservation-bar"
              :class="getBarColor(svc)"
              :style="getBarStyle(svc, idx)"
              @click="goToReservationPage"
            >
              <span class="dot"></span>
              <span class="font-medium text-[13px] mr-2">{{ svc.title }}</span>
              <span class="text-[11px] opacity-70">
                {{ formatDate(new Date(svc.startDate)) }} ~ {{ formatDate(new Date(svc.endDate)) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.page-title { @apply text-xl font-medium text-gray-900; }
.nav-btn { @apply p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors; }

.timeline-bg {
  cursor: grab;
  background-image: linear-gradient(to right, theme('colors.gray.200') 1px, transparent 1px);
  background-size: calc(100% / 7) 100%;
}
.timeline-bg.cursor-grabbing {
  cursor: grabbing;
}

.reservation-bar {
  @apply absolute flex items-center gap-2 px-3 rounded-md border shadow-sm whitespace-nowrap overflow-hidden transition-all duration-300 cursor-pointer hover:brightness-95;
}

.dot {
  @apply w-2 h-2 rounded-full flex-shrink-0;
  background-color: currentColor;
}
</style>

