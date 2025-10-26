<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { reactive, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import serviceApi from '@/services/admin/service_api.js'

const route = useRoute()
const router = useRouter()
const serviceGroupId = route.params.serviceGroupId
const serviceGroupName = decodeURIComponent(route.query.serviceGroupName || '')
const services = reactive([])

const breadcrumbItems = computed(() => [
  { label: '서비스 그룹', path: '/admin/service-group-managation' },
  { label: decodeURIComponent(route.query.serviceGroupName || ''), path: '' },
])

const selectedService = reactive({
  id: null,
  name: '',
  startTime: '',
  endTime: '',
  capacity: 0,
  description: '',
  customFields: [],
})

const showDetailModal = ref(false)

// 모달 열기
const viewServiceDetail = async (id) => {
  const service = services.find((s) => s.id === id)
  if (service) {
    Object.assign(selectedService, service)
    showDetailModal.value = true

    try {
      const response = await serviceApi.getResourceCustomFieldAndValue(id)
      selectedService.customFields = (response.data.data || []).map((field) => ({
        fieldName: field.fieldName,
        value: Array.isArray(field.values) ? field.values.join(', ') : field.values,
      }))
    } catch (error) {
      console.error('커스텀 필드 조회 실패:', error)
      selectedService.customFields = []
    }
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
    query: {
      serviceGroupId: serviceGroupId, // 그룹정보도 필요할 경우
      serviceGroupName: serviceGroupName,
    },
  })
}

// 상태별 computed
const createStatusComputed = (statusName) =>
  computed({
    get: () => services.filter((s) => s.status.toUpperCase() === statusName.toUpperCase()),
    set: (newList) => {
      newList.forEach((item) => {
        const original = services.find((s) => s.id === item.id)
        if (original && original.status.toUpperCase() !== statusName.toUpperCase()) {
          original.status = statusName
          console.log(`${original.name} 상태가 ${statusName}로 변경됨`)
          // 필요시 API 호출
        }
      })
    },
  })

const upcomingServices = createStatusComputed('UPCOMING')
const inProgressServices = createStatusComputed('IN_PROGRESS')
const finishedServices = createStatusComputed('FINISHED')

// 서비스 리스트 조회
const getServiceList = async (serviceGroupId) => {
  try {
    const response = await serviceApi.getServiceList(serviceGroupId)
    console.log('서비스 리스트 응답 : ', response.data)
    // 실제 배열은 resources
    services.splice(0, services.length, ...response.data.data.resources)
  } catch (error) {
    console.log('서비스 리스트 조회 실패: ', error)
  }
}

watch(
  () => route.params.serviceGroupId,
  (newId, oldId) => {
    if (newId) {
      getServiceList(newId)
    }
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
          query: {
            serviceGroupId: serviceGroupId,
            serviceGroupName: serviceGroupName,
          },
        }"
      >
        <span class="plus-btn">+</span>
      </RouterLink>
      <!-- <span class="plus-btn" @click="createService">+</span> -->
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
          :item-key="'serviceId'"
          class="service-list"
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
          :item-key="'serviceId'"
          class="service-list"
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

          <div class="info-row">
            <span class="info-label">시작시간</span>
            <span>{{ selectedService.startTime }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">종료시간</span>
            <span>{{ selectedService.endTime }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">인원수</span>
            <span>{{ selectedService.capacity }} 명</span>
          </div>

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
  @apply flex gap-2 mb-2 items-center  min-w-[300px] text-[14px];
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
  @apply flex flex-col items-start gap-2;
}

.service-info-description-container p {
  @apply text-[14px] mb-[20px];
}

::-webkit-scrollbar-track {
  background: #eeeeee;
}
</style>
