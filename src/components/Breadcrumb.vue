<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // 예시: [{ label: '기업 목록', path: '/admin/companies' }, { label: '서비스 그룹' }]
  },
})

const goTo = (path) => {
  if (path) router.push(path)
}
</script>

<template>
  <div class="breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <span
        class="breadcrumb-item"
        :class="{ 'text-gray-400 cursor-default': !item.path }"
        @click="goTo(item.path)"
      >
        {{ item.label }}
      </span>

      <!-- 마지막 항목에는 '>' 표시 안함 -->
      <span v-if="index < items.length - 1">
        <img class="arrow-style" src="/assets/icons/ic-down-arrow-gray-dark.png" alt="방향" />
      </span>
    </template>
  </div>
</template>

<style scoped>
.breadcrumb {
  @apply flex text-[12px] text-gray-dark gap-2 items-center mb-[4px];
}

.breadcrumb-item {
  @apply cursor-pointer hover:underline;
}

.breadcrumb-item.text-gray-400 {
  @apply no-underline pointer-events-none;
}

.arrow-style {
  @apply -rotate-90 w-[14px] h-[14px];
}
</style>
