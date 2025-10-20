<script setup>
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/AdminLayout.vue'

const router = useRouter()

const goEdit = () => { router.push('/admin/service-group-edit') }
</script>

<template>
  <AdminLayout>
    <!-- 페이지 헤더 -->
    <div class="components-page-title">
      <span class="haeder"
        >서비스 그룹 관리 <img src="/assets/icons/ic-dark-gray-plus.png" alt="추가하기"
      /></span>
    </div>

    <div class="service-group-list">
      <div class="service-group-container">
        <div class="service-group-container-top">
          <div class="create-by-info">
            <span>회의실 예약</span>
            <p>유현경 관리자 | 2025.10.13</p>
          </div>
          <img src="/assets/icons/ic-dark-gray-plus.png" alt="삭제하기" />
        </div>

        <div class="service-group-description">
          여의도 본사에서 근무하시는 분들 중 회의실 대여가 필요하시면 예약하세요.
        </div>

        <div class="service-group-container-bottom">
          <div class="in-progress-service-group">
            <img src="/public/assets/icons/ic-in-progress.png" alt="진행 중" />
            <p><span>3</span> / 5</p>
          </div>

          <div class="resource-group-edit-button" @click="goEdit">
            <img src="/public/assets/icons/ic-white-pencil.png" alt="수정" />
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
  @apply bg-white rounded-[15px] flex flex-col gap-4 px-[22px] py-[18px] max-w-[370px];
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
    @apply flex justify-between
}

.service-group-list {
    @apply flex flex-wrap gap-3 mt-[15px]
}
</style>
