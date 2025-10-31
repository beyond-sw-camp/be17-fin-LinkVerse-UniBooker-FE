<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import { reactive, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import serviceApi from '@/services/service/service_api.js'

const route = useRoute()
const router = useRouter()
const serviceGroupId = route.params.serviceGroupId
const serviceGroupName = decodeURIComponent(route.query.serviceGroupName || '')
const services = reactive([])

const breadcrumbItems = computed(() => [
  { label: '서비스 그룹', path: '/admin/service-group-managation' },
  { label: decodeURIComponent(route.query.serviceGroupName || ''), path: '' },
])

const dayMap = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
}

const selectedService = reactive({
  id: null,
  name: '',
  startTime: '',
  endTime: '',
  capacity: 0,
  description: '',
  customFields: [],
  dailyTimeSlots: [],
  exceptionTimeSlots: [],
  resourceImage: '',
})

const showDetailModal = ref(false)

/** =========================
 *   전이 규칙 (프론트 UX 선반영)
 *  ========================= */
function isBefore(a, b) {
  return new Date(a).getTime() < new Date(b).getTime()
}
function isAfter(a, b) {
  return new Date(a).getTime() > new Date(b).getTime()
}
function isBetweenInclusive(x, s, e) {
  const d = new Date(x).getTime()
  return d >= new Date(s).getTime() && d <= new Date(e).getTime()
}
function todayISO() {
  const d = new Date()
  // yyyy-mm-dd only (서버가 로컬 날짜 기준이면 시간대 보정 불필요)
  return d.toISOString().slice(0, 10)
}

/** targetStatus로 드랍 가능한지 사전 판단 */
function canMoveTo(targetStatus, r) {
  const today = todayISO()

  if (targetStatus === 'CLOSED') return true

  if (r.isAlwaysAvailable) {
    // 상시모집: 진행전은 의미 없음, 진행중만 허용
    return targetStatus === 'IN_PROGRESS'
  }

  // 기간형
  if (!r.startDate || !r.endDate) return false

  if (targetStatus === 'IN_PROGRESS') {
    return isBetweenInclusive(today, r.startDate, r.endDate)
  }
  if (targetStatus === 'PROGRESS_BEFORE') {
    return isBefore(today, r.startDate)
  }
  return false
}

/** vuedraggable :move 가드 팩토리 */
function onMoveFactory(targetStatus) {
  return (evt) => {
    const card = evt.draggedContext?.element
    if (!card) return false
    return canMoveTo(targetStatus, card)
  }
}

/** =========================
 *   상세 모달 데이터 로딩
 *  ========================= */
const viewServiceDetail = async (id) => {
  const service = services.find((s) => s.id === id)
  if (!service) return

  Object.assign(selectedService, service)
  showDetailModal.value = true

  // 커스텀 필드
  try {
    const response = await serviceApi.getResourceCustomFieldAndValue(id)
    selectedService.customFields = (response?.data?.data || []).map((field) => ({
      fieldName: field.fieldName,
      value: Array.isArray(field.values) ? field.values.join(', ') : field.values,
    }))
  } catch (error) {
    console.error('커스텀 필드 조회 실패:', error)
    selectedService.customFields = []
  }

  // 운영시간
  try {
    const res = await serviceApi.getDailyTimeSlots(id)
    const timeslots = res?.data?.data || []
    const grouped = {}
    timeslots.forEach((slot) => {
      if (!grouped[slot.dayOfWeek]) grouped[slot.dayOfWeek] = []
      grouped[slot.dayOfWeek].push(`${slot.startTime} - ${slot.endTime}`)
    })
    selectedService.dailyTimeSlots = Object.entries(grouped).map(([day, slots]) => ({
      day: dayMap[day] || day,
      slots,
    }))
  } catch (error) {
    console.error('운영시간 조회 실패:', error)
    selectedService.dailyTimeSlots = []
  }

  // 예외시간
  try {
    const res = await serviceApi.getExceptionTimeSlots(id)
    const exceptions = res?.data?.data || []
    const groupedExceptions = {}
    exceptions.forEach((ex) => {
      if (!groupedExceptions[ex.date]) groupedExceptions[ex.date] = []
      if (ex.closed) groupedExceptions[ex.date].push(ex.note ? `휴무 (${ex.note})` : '휴무')
      else groupedExceptions[ex.date].push(`${ex.startTime} - ${ex.endTime}`)
    })
    selectedService.exceptionTimeSlots = Object.entries(groupedExceptions).map(([date, slots]) => ({
      date,
      slots,
    }))
  } catch (error) {
    console.error('예외시간 조회 실패:', error)
    selectedService.exceptionTimeSlots = []
  }
}

const goToEditService = (serviceId) => {
  if (!serviceId) {
    console.warn('서비스 ID가 없습니다.')
    return
  }
  router.push({
    name: 'ServiceEdit',
    params: { serviceId },
    query: { serviceGroupId, serviceGroupName },
  })
}

/** =========================
 *   상태 변경 (낙관적 락 + 롤백)
 *  ========================= */
async function applyStatusChangeOrRollback(card, targetStatus) {
  const prevStatus = card.status
  try {
    console.log(card.id, card.version, targetStatus)
    const res = await serviceApi.changeServiceStatus(card.id, card.version, targetStatus)
    const result = res?.data?.result
    if (result) {
      // 서버가 최신 상태/버전 내려줌
      card.status = result.status
      card.version = result.version
      if (typeof result.isAlwaysAvailable === 'boolean') {
        card.isAlwaysAvailable = result.isAlwaysAvailable
      }
      if ('startDate' in result) card.startDate = result.startDate
      if ('endDate' in result) card.endDate = result.endDate
    } else {
      // 안전하게 전체 재조회
      await getServiceList(serviceGroupId)
    }
  } catch (e) {
    // 실패 시 원복 + 재조회
    card.status = prevStatus
    await getServiceList(serviceGroupId)
    // 토스트/알림 컴포넌트가 있다면 여기에 붙이세요.
    console.error('상태 변경 실패', e)
  }
}

/** vuedraggable @add 핸들러: 드랍 성공(리스트에 추가된 순간) → 서버 호출 */
function onAdd(targetStatus, evt) {
  // 드랍된 카드 추출 (vuedraggable 버전에 따라 아래 중 하나)
  const card =
    evt?.added?.element ||
    evt?.item?.__draggable_context?.element ||
    evt?.clone?.__draggable_context?.element
  if (!card) return

  // UI상 이미 target 칼럼에 들어온 상태이므로, 먼저 로컬 반영 후 서버 호출
  card.status = targetStatus
  applyStatusChangeOrRollback(card, targetStatus)
}

/** =========================
 *   상태별 computed 리스트
 *  ========================= */
const createStatusComputed = (statusName) =>
  computed({
    get: () => services.filter((s) => (s.status || '').toUpperCase() === statusName.toUpperCase()),
    set: (newList) => {
      newList.forEach((item) => {
        const original = services.find((s) => s.id === item.id)
        if (original && (original.status || '').toUpperCase() !== statusName.toUpperCase()) {
          // 여기서는 로컬 상태만 동기(실제 상태 변경 API는 @add에서 처리)
          original.status = statusName
        }
      })
    },
  })

const upcomingServices = createStatusComputed('PROGRESS_BEFORE')
const inProgressServices = createStatusComputed('IN_PROGRESS')
const finishedServices = createStatusComputed('CLOSED')

/** =========================
 *   리스트 조회
 *  ========================= */
const getServiceList = async (serviceGroupId) => {
  try {
    const response = await serviceApi.getServices(serviceGroupId)
    // response 예: [{ id, name, status, version, isAlwaysAvailable, startDate, endDate, ... }]
    services.splice(0, services.length, ...(response || []))
  } catch (error) {
    console.log('서비스 리스트 조회 실패: ', error)
  }
}

watch(
  () => route.params.serviceGroupId,
  (newId) => {
    if (newId) getServiceList(newId)
  },
  { immediate: true },
)
</script>

<template>
  <AdminLayout>
    <Breadcrumb :items="breadcrumbItems" />

    <div class="upper-bar">
      <div class="components-page-title">서비스 관리</div>
      <RouterLink
        :to="{
          name: 'ServiceCreate',
          query: { serviceGroupId: serviceGroupId, serviceGroupName: serviceGroupName },
        }"
      >
        <span class="plus-btn">+</span>
      </RouterLink>
    </div>

    <div class="content-container">
      <!-- 진행 전 서비스 -->
      <div class="status-container">
        <div class="status">
          <div class="status-upcoming"></div>
          진행 전 서비스
        </div>
        <draggable
          v-model="upcomingServices"
          group="services"
          :item-key="'id'"
          class="service-list"
          :move="onMoveFactory('PROGRESS_BEFORE')"
          @add="(evt) => onAdd('PROGRESS_BEFORE', evt)"
        >
          <template #item="{ element: s }">
            <div class="service">
              <div class="service-info">
                <span>{{ s.createdByName }} 관리자</span>
                <span>{{ s.updatedAt }}</span>
              </div>
              <div class="service-name-container">
                <span class="service-name" @click="viewServiceDetail(s.id)">
                  {{ s.name }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- 진행 중 서비스 -->
      <div class="status-container">
        <div class="status">
          <div class="status-in-progress"></div>
          진행 중인 서비스
        </div>
        <draggable
          v-model="inProgressServices"
          group="services"
          :item-key="'id'"
          class="service-list"
          :move="onMoveFactory('IN_PROGRESS')"
          @add="(evt) => onAdd('IN_PROGRESS', evt)"
        >
          <template #item="{ element: s }">
            <div class="service">
              <div class="service-info">
                <span>{{ s.createdByName }} 관리자</span>
                <span>{{ s.updatedAt }}</span>
              </div>
              <div class="service-name-container">
                <span class="service-name" @click="viewServiceDetail(s.id)">
                  {{ s.name }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- 종료된 서비스 -->
      <div class="status-container">
        <div class="status">
          <div class="status-finished"></div>
          종료된 서비스
        </div>
        <draggable
          v-model="finishedServices"
          group="services"
          :item-key="'id'"
          class="service-list"
          :move="onMoveFactory('CLOSED')"
          @add="(evt) => onAdd('CLOSED', evt)"
        >
          <template #item="{ element: s }">
            <div class="service">
              <div class="service-info">
                <span>{{ s.createdByName }} 관리자</span>
                <span>{{ s.updatedAt }}</span>
              </div>
              <div class="service-name-container">
                <span class="service-name" @click="viewServiceDetail(s.id)">
                  {{ s.name }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <Modal :open="showDetailModal">
      <div class="modal-container">
        <img class="resource-image-box" :src="selectedService.resourceImage" alt="리소스 이미지" />

        <div class="resource-info-container">
          <h2>{{ selectedService.name }}</h2>

          <!-- 운영 시간 -->
          <div class="info-row-time">
            <span class="info-label">운영시간</span>
            <div class="daily-timeslots">
              <div
                v-for="daySlot in selectedService.dailyTimeSlots"
                :key="daySlot.day"
                class="day-container"
              >
                <span>{{ daySlot.day }}</span>
                <div>
                  <div v-for="time in daySlot.slots" :key="time">{{ time }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 예외 시간 -->
          <div class="info-row-time">
            <span class="info-label">예외시간</span>
            <div class="daily-timeslots">
              <div
                v-for="item in selectedService.exceptionTimeSlots"
                :key="item.date"
                class="day-container"
              >
                <span class="w-[78px]">{{ item.date }}</span>
                <div class="w-[305px]">
                  {{ item.slots.join(', ') }}
                </div>
              </div>
            </div>
          </div>

          <!-- 인원수 -->
          <div class="info-row">
            <span class="info-label">인원수</span>
            <span>{{ selectedService.capacity }} 명</span>
          </div>

          <!-- 커스텀 필드 -->
          <div v-if="selectedService.customFields.length">
            <div
              v-for="(field, index) in selectedService.customFields"
              :key="index"
              class="info-row"
            >
              <span class="info-label">{{ field.fieldName }}</span>
              <span>{{ field.value }}</span>
            </div>
          </div>

          <!-- 설명 -->
          <div class="service-info-description-container">
            <span class="info-label">설명</span>
            <p>{{ selectedService.description }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <Button class="modal-btn" :theme="'gray'" @click="showDetailModal = false">닫기</Button>
          <Button class="modal-btn" @click="goToEditService(selectedService.id)">수정</Button>
        </div>
      </div>
    </Modal>
  </AdminLayout>
</template>

<style scoped>
.upper-bar {
  @apply flex;
}
.upper-bar div {
  @apply grow;
}
.plus-btn {
  @apply font-semibold text-2xl text-gray-dark cursor-pointer p-2;
}
.content-container {
  @apply flex gap-3 h-full;
}
.status-container {
  @apply grow flex flex-col bg-[#F4F4F4] rounded-[5px] min-h-[550px] w-[480px];
}
.status {
  @apply flex bg-gray-deep rounded-tl-[5px] rounded-tr-[5px] px-[15px] py-[12px] font-medium items-center text-[14px];
}
.status-upcoming {
  @apply rounded-full w-4 h-4 mr-3 bg-blue-300 border-2 border-blue-500;
}
.status-in-progress {
  @apply rounded-full w-4 h-4 mr-3 bg-green-300 border-2 border-green-500;
}
.status-finished {
  @apply rounded-full w-4 h-4 mr-3 bg-red-300 border-2 border-red-500;
}
.service-list {
  @apply mx-[10px] my-[15px] rounded-md flex flex-col gap-2 h-full overflow-y-auto;
}
.service {
  @apply bg-white rounded-md cursor-pointer;
}
.service-info {
  @apply flex justify-between text-[12px] text-text border-b border-gray-line p-[13px];
}
.service-name {
  @apply text-blue-600 hover:font-medium hover:underline cursor-pointer text-[14px];
}
.service-image {
  @apply w-full h-40 bg-gray-200 rounded-md;
}
.info-row {
  @apply flex gap-2 mb-3 items-center  min-w-[300px] text-[14px];
}
.info-label {
  @apply w-24 text-[#535353] text-[14px];
}
.modal-footer {
  @apply flex float-right gap-1 mt-2 w-full justify-end;
}
.modal-btn {
  @apply w-[80px] text-sm rounded-[5px];
}

.service-name-container {
  @apply px-[14px] py-[10px];
}

.resource-image-box {
  @apply w-full h-[220px] object-cover rounded-[5px];
}

.modal-container {
  @apply w-[512px] max-h-[500px] flex flex-col overflow-y-auto;
}

.modal-container h2 {
  @apply text-[18px] font-bold mt-[15px] mb-[15px];
}

.resource-info-container {
  @apply p-[5px] flex-1;
}

.service-info-description-container {
  @apply flex items-start gap-2 mt-[10px];
}

.service-info-description-container p {
  @apply text-[14px] mb-[20px] max-w-[650px];
}

::-webkit-scrollbar-track {
  background: #eeeeee;
}

.info-row-time {
  @apply flex gap-2 mb-3;
}

.day-container {
  @apply flex gap-3 text-[14px] mb-[2px];
}
</style>
