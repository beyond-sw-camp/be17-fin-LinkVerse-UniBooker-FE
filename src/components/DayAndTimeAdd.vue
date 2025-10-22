<template>
  <div class="p-4 space-y-4">
    <!-- 요일 선택 -->
    <div class="flex space-x-2">
      <button
        v-for="day in days"
        :key="day"
        @click="toggleDay(day)"
        :class="[
          'px-3 py-1 rounded border',
          selectedDays.includes(day) ? 'bg-blue-600 text-white' : 'bg-gray-100',
        ]"
      >
        {{ day }}
      </button>
    </div>

    <!-- 시간 선택 + 간격 -->
    <div class="flex items-center space-x-3">
      <!-- 시작 시간 -->
      <div class="flex items-center space-x-1">
        <Dropdown
          v-model="startHour"
          :options="hourOptions"
          placeholder="시"
          width="w-20"
          maxHeight="20vh"
        />
        <Dropdown
          v-model="startMinute"
          :options="minuteOptions"
          placeholder="분"
          width="w-20"
          maxHeight="20vh"
        />
      </div>

      <span>~</span>

      <!-- 종료 시간 -->
      <div class="flex items-center space-x-1">
        <Dropdown
          v-model="endHour"
          :options="hourOptions"
          placeholder="시"
          width="w-20"
          maxHeight="20vh"
        />
        <Dropdown
          v-model="endMinute"
          :options="minuteOptions"
          placeholder="분"
          width="w-20"
          maxHeight="20vh"
        />
      </div>

      <!-- 간격 선택 -->
      <Dropdown
        v-model="interval"
        :options="intervalOptions"
        width="w-24"
        placeholder="간격"
      />

      <button
        @click="addSlot"
        class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        추가
      </button>
    </div>

    <!-- 추가된 시간대 목록 -->
    <div v-if="timeSlots.length" class="mt-4 border-t pt-4 space-y-2">
      <div
        v-for="(slot, i) in timeSlots"
        :key="i"
        class="flex justify-between items-center border rounded px-3 py-2"
      >
        <span>{{ slot.days.join(', ') }} | {{ slot.start }} ~ {{ slot.end }}</span>
        <button @click="removeSlot(i)" class="text-red-600 hover:text-red-800">삭제</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Dropdown from '@/components/Dropdown.vue' // ⬅️ 당신이 올린 컴포넌트 import

/** 요일 선택 */
const days = ['월', '화', '수', '목', '금', '토', '일']
const selectedDays = ref([])

/** 시간 관련 state */
const startHour = ref('')
const startMinute = ref('')
const endHour = ref('')
const endMinute = ref('')
const interval = ref(60)

/** 드롭다운 옵션 */
const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const val = String(i).padStart(2, '0')
  return { label: val, value: val }
})

/** interval에 따른 분 옵션 */
const minuteOptions = computed(() => {
  return interval.value === 60
    ? [
        { label: '00', value: '00' },
      ]
    : [
        { label: '00', value: '00' },
        { label: '30', value: '30' },
      ]
})

/** 간격 옵션 */
const intervalOptions = [
  { label: '1시간', value: 60 },
  { label: '30분', value: 30 },
]

/** 시간대 목록 */
const timeSlots = ref([])

/** 요일 선택 */
const toggleDay = (day) => {
  const idx = selectedDays.value.indexOf(day)
  if (idx >= 0) selectedDays.value.splice(idx, 1)
  else selectedDays.value.push(day)
}

/** 시간 문자열로 변환 */
const getTimeString = (h, m) => `${h}:${m}`

/** 추가 */
const addSlot = () => {
  if (selectedDays.value.length === 0) return alert('요일을 선택해주세요.')
  if (!startHour.value || !startMinute.value || !endHour.value || !endMinute.value)
    return alert('시간을 모두 선택해주세요.')

  const start = getTimeString(startHour.value, startMinute.value)
  const end = getTimeString(endHour.value, endMinute.value)

  const startMin = Number(startHour.value) * 60 + Number(startMinute.value)
  const endMin = Number(endHour.value) * 60 + Number(endMinute.value)

  if (startMin >= endMin) return alert('종료 시간이 시작 시간보다 늦어야 합니다.')

  timeSlots.value.push({
    days: [...selectedDays.value],
    start,
    end,
  })
}

/** 삭제 */
const removeSlot = (i) => {
  timeSlots.value.splice(i, 1)
}
</script>
