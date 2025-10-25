<script setup>
import { ref } from 'vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Calendar from '@/components/Calendar.vue'
import Modal from '@/components/Modal.vue'
import SeatBoard from '@/components/SeatBoard.vue'


const serviceType = ref("SEAT")
const showForceModal = ref(false)

// 날짜 선택
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const showCalendar = ref(false)

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

// Calendar에서 날짜 선택했을 때 닫기
const selectDate = (date) => {
  selectedDate.value = date
  showCalendar.value = false
}

// 시간 및 인원수
const times = ['09:30', '10:30', '11:30', '13:30', '14:00', '15:00', '16:00']
const selectedTime = ref('')
const peopleCount = ref(2)

const increase = () => { peopleCount.value += 1 }
const decrease = () => { if (peopleCount.value > 1) peopleCount.value -= 1 }

// 예약 버튼 클릭
const reserve = (serviceType) => {
    if (serviceType == "SEAT") {
      // 좌석 선택 모달창 띄우기
      showForceModal.value = true
    }
}
</script>

<template>
  <div class="detail-page">
    <Modal :open="showForceModal" :closeOnOverlay="false" @close="showForceModal=false">
      <SeatBoard />
      <div class="p-6">
        <Button @click="showForceModal = false">예약하기</Button>
      </div>
    </Modal>

    <!-- 상단 이미지 -->
    <img src="/assets/images/service/meeting_room.jpg" alt="회의실" class="header-image" />

    <div class="content-wrapper">
      <!-- 왼쪽 설명 -->
      <div class="info-section">
        <h2 class="title">회의실 A</h2>
        <p class="desc">
          회의실 A는 최대 6명까지 이용 가능합니다. <br />
          회의실 내에는 대형 모니터가 설치되어 있으며, 화상회의 및 프레젠테이션이 가능합니다. 이용 후 정리정돈 부탁드립니다.
        </p>
        
        <table class="details-table">
          <tbody>
            <tr>
              <th>장소</th>
              <td>4층 회의실</td>
            </tr>
            <tr>
              <th>수용 가능 인원</th>
              <td>최소 2명, 최대 6명</td>
            </tr>
            <tr>
              <th>사용 가능 밴드</th>
              <td>커스텀 팀 전용</td>
            </tr>     
          </tbody>
        </table>
      </div>

      <!-- 오른쪽 예약 박스 -->
      <div class="reservation-box">
        <div class="form-group">
          <label>날짜</label>
           <div class="relative" @click="toggleCalendar">
            <Input type="text" class="cursor-pointer" v-model="selectedDate" readonly />
            <div v-if="showCalendar" class="date-picker" @click.stop>
              <Calendar @select="selectDate"/>
            </div>
          </div>
        </div>

        <div v-if="false" class="form-group">
          <label>시간</label>
          <div class="time-grid">
            <button v-for="(time, index) in times" :key="index" :class="['time-btn', { active: selectedTime === time }]" @click="selectedTime = time">
              {{ time }}
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label>인원수</label>
          <div class="people-control">
            <button class="count-btn" @click="decrease">−</button>
            <span class="count">{{ peopleCount }}명</span>
            <button class="count-btn" @click="increase">＋</button>
          </div>
        </div>

        <div class="form-group">
            <label>NUMBER</label>
            <div>
                <Input type="number" />
            </div>
        </div>
        <div class="form-group">
            <label>TEXT</label>
            <div>
                <Input type="text" v-model="value" />
            </div>
        </div>
        <div class="form-group">
            <label>DATE</label>
            <div>
                <Input type="date" v-model="value" />
            </div>
        </div>
        <div class="form-group">
            <label>TIME</label>
            <div>
                <Input type="time" v-model="value" />
            </div>
        </div>
        <div class="form-group">
            <label>RADIO</label>
            <div>
                <Input type="radio" v-model="value" />
            </div>
        </div>
        <div class="form-group">
            <label>CHECKBOX</label>
            <div>
                <Input type="checkbox" v-model="value" />
            </div>
        </div>

        <Button @click="reserve(serviceType)">예약하기</Button>
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
  top: 80px;         /* 상단에서 떨어진 거리 */
  max-height: 500px;  /* 고정 높이 설정 */
  overflow-y: auto;   /* 내부 스크롤 가능 */
}

.form-group label {
  @apply block text-sm font-semibold mb-2 text-gray-700;
}

/* 날짜 */
.date-picker {
  @apply fixed z-50 mt-2 left-[50%] translate-x-[-33%] translate-y-[-45%] scale-75 origin-top-left;
}

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
</style>
