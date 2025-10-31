<script setup>
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import serviceApi from '@/services/service/service_api'
import { onMounted, reactive } from 'vue'

const router = useRouter()
const serviceGroups = reactive([])
const getServiceGroups = async () => {
  try {
    const response = await serviceApi.getServiceGroups(1)
    const data = response.data.data

    Object.assign(serviceGroups, data.resourceGroups)
  } catch (error) {
    console.log('서비스 그룹 목록 조회 실패: ', error)
  }
}

const deleteServiceGroup = async (serviceGroupId) => {
  // 삭제 확인
  const isConfirmed = window.confirm('정말 이 서비스 그룹을 삭제하시겠습니까?')
  if (!isConfirmed) return

  try {
    const response = await serviceApi.deleteServiceGroup(serviceGroupId)
    const data = response.data.data
    const index = serviceGroups.findIndex((s) => s.id === serviceGroupId)
    if (index !== -1) serviceGroups.splice(index, 1)
  } catch (error) {
    console.log('서비스 그룹 삭제 실패: ', error)
  }
}

const goServiceManagement = (serviceGroupId, serviceGroupName) => {
  router.push({
    path: `/admin/service-management/${serviceGroupId}`,
    query: { serviceGroupName }
  })
}

const goCreate = () => {
  router.push({ name: 'ServiceGroupCreate' })
}

const goEdit = (serviceGroupId) => {
  router.push(`/admin/service-group-edit/${serviceGroupId}`)
}

onMounted(() => {
  getServiceGroups()
})
</script>

<template>
  <AdminLayout>
    <!-- 페이지 헤더 -->
    <div class="components-page-title">
      <span class="haeder"
        >서비스 그룹 관리
        <img src="/assets/icons/ic-dark-gray-plus.png" alt="추가하기" @click="goCreate"
      /></span>
    </div>

    <div class="service-group-list">
      <div v-for="s in serviceGroups" class="service-group-container">
        <div class="service-group-container-top">
          <div class="create-by-info">
            <span
              @click="goServiceManagement(s.id, s.name)"
              class="service-group-name"
              style="cursor: pointer"
            >
              {{ s.name }}
            </span>
            <p>{{ s.administrator }} 관리자 | {{ new Date(s.createdAt).toLocaleDateString() }}</p>
          </div>
          <img
            @click="deleteServiceGroup(s.id)"
            src="/assets/icons/ic-dark-gray-plus.png"
            alt="삭제하기"
          />
        </div>

        <div class="service-group-description">
          {{ s.description }}
        </div>

        <div class="service-group-container-bottom">
          <div class="in-progress-service-group">
            <img src="/assets/icons/ic-in-progress.png" alt="진행 중" />
            <p>
              <span>{{ s.activeServiceCount }}</span> / {{ s.serviceCount }}
            </p>
          </div>

          <div class="resource-group-edit-button" @click="goEdit(s.id)">
            <img src="/assets/icons/ic-white-pencil.png" alt="수정" />
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.haeder {
  @apply flex items-center gap-2;
}

.haeder > img {
  @apply w-[22px] h-[22px] cursor-pointer;
}

.service-group-container {
  @apply bg-white rounded-[15px] flex flex-col gap-4 px-[22px] py-[18px] w-[350px];
}

.service-group-container-top {
  @apply flex justify-between items-start;
}

.service-group-container-top > img {
  @apply w-[25px] h-[25px] rotate-45 cursor-pointer;
}

.create-by-info > span {
  @apply font-medium;
}

.create-by-info > p {
  @apply text-[12px] text-[#ABABAB];
}

.service-group-description {
  @apply text-[14px] text-text;
}

.in-progress-service-group {
  @apply flex items-center gap-2;
}

.in-progress-service-group > img {
  @apply w-[20px] h-[20px];
}

.in-progress-service-group p {
  @apply text-[14px] text-[#8E8E8E];
}

.in-progress-service-group span {
  @apply text-text;
}

.resource-group-edit-button {
  @apply bg-black rounded-[50%] w-[36px] h-[36px] flex justify-center items-center cursor-pointer;
}

.resource-group-edit-button > img {
  @apply w-[15px] h-[15px];
}

.service-group-container-bottom {
  @apply flex justify-between;
}

.service-group-list {
  @apply flex flex-wrap gap-3 mt-[15px];
}

.service-group-name {
  @apply cursor-pointer text-black hover:text-[#2563EB] hover:underline;
}

</style>
