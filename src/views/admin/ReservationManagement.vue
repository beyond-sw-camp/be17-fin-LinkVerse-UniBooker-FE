<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Dropdown from '@/components/Dropdown.vue'
import { ref, onMounted, nextTick } from 'vue'
import { Calendar } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const serviceGroupName = '회의실 예약'
const breadcrumbItems = [
  { label: '서비스 그룹', path: '/admin/service-group-management' },
  { label: serviceGroupName, path: '' },
]

const dropdownOptions = [{ label: '전체', value: 'all' }]
const selectedOption = ref('all')

const calendarEl = ref(null)
let calendar = null
const currentView = ref('timeGridWeek')

onMounted(async () => {
  await nextTick()
  calendar = new Calendar(calendarEl.value, {
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
    initialView: currentView.value,
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    allDaySlot: false,
    height: 'auto',
    nowIndicator: true,
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: true },
    slotLabelContent: () => '',
    slotMinHeight: 40,
    titleFormat: { month: 'long' },
    dayHeaderContent: (arg) => {
      const date = arg.date
      const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
      const day = date.getDate()
      return `${weekday} ${day}`
    },
    eventOverlap: false, // 이벤트 겹치지 않고 세로로 쌓임
    eventOrder: 'title', // 제목 기준 정렬
    events: [
      {
        title: '회의실 A',
        start: '2025-10-19T08:00:00',
        end: '2025-10-19T09:00:00',
        color: '#fce7f3',
        textColor: '#000',
      },
      {
        title: '회의실 A',
        start: '2025-10-19T16:00:00',
        end: '2025-10-19T17:00:00',
        color: '#fce7f3',
        textColor: '#000',
      },
      {
        title: '회의실 D',
        start: '2025-10-19T16:00:00',
        end: '2025-10-19T17:00:00',
        color: '#fef9c3',
        textColor: '#000',
      },
      {
        title: '대강당 회의실 102',
        start: '2025-10-19T16:00:00',
        end: '2025-10-19T17:00:00',
        color: '#dcfce7',
        textColor: '#000',
      },
    ],
    eventDidMount: (info) => {
      info.el.style.width = '100%'
      info.el.style.marginBottom = '4px'
    },
  })
  calendar.render()
})

const changeView = (viewType) => {
  currentView.value = viewType
  if (calendar) calendar.changeView(viewType)
}
</script>

<template>
  <AdminLayout>
    <Breadcrumb :items="breadcrumbItems" />
    <div class="upper-bar">
      <div class="components-page-title">예약 현황</div>
      <div class="flex items-center gap-3">
        <div class="view-switch">
          <button
            :class="['view-btn', currentView === 'timeGridDay' && 'active']"
            @click="changeView('timeGridDay')"
          >
            Day
          </button>
          <button
            :class="['view-btn', currentView === 'timeGridWeek' && 'active']"
            @click="changeView('timeGridWeek')"
          >
            Week
          </button>
          <button
            :class="['view-btn', currentView === 'dayGridMonth' && 'active']"
            @click="changeView('dayGridMonth')"
          >
            Month
          </button>
        </div>
      </div>
      <Dropdown
        v-model="selectedOption"
        :options="dropdownOptions"
        placeholder="전체"
        width="w-[160px]"
      />
    </div>

    <div ref="calendarEl" class="calendar-container"></div>
  </AdminLayout>
</template>

<style scoped>
.upper-bar {
  @apply flex gap-3 items-center mb-3;
}
.view-switch {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}
.view-btn {
  @apply px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors;
}
.view-btn:hover {
  @apply bg-gray-100;
}
.view-btn.active {
  @apply bg-white text-black shadow-sm;
}
.calendar-container {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 1rem;
  min-height: 600px;
}

:deep(.fc) {
  font-family: 'Pretendard', sans-serif;
  background-color: white;
  border-radius: 12px;
  padding: 10px;
}
:deep(.fc-toolbar-title) {
  @apply text-sm;
}
:deep(.fc-prev-button),
:deep(.fc-next-button) {
  @apply bg-white text-gray-700 font-medium px-3 py-1.5 border-none;
}
:deep(.fc-prev-button:hover),
:deep(.fc-prev-button:focus),
:deep(.fc-next-button:hover),
:deep(.fc-next-button:focus) {
  @apply bg-white text-black shadow-md;
}
:deep(.fc-col-header-cell-cushion) {
  @apply text-sm font-normal;
}
:deep(.fc-timegrid-slot-label) {
  display: none !important;
}

:deep(.fc-event) {
  display: block !important;
  width: 100% !important;
  box-sizing: border-box;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  padding: 0.25rem 0.5rem;
  text-align: left;
}
</style>
