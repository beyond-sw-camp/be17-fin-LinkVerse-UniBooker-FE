<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  totalItems: { type: Number, required: true }, // 전체 아이템 수
  itemsPerPage: { type: Number, default: 4 }, 	// 한 페이지당 아이템 수
  modelValue: { type: Number, default: 1 }, 		// v-model 현재 페이지
  maxVisiblePages: { type: Number, default: 5 } // 표시할 최대 페이지 버튼 수
})

const emit = defineEmits(['update:modelValue'])

// 내부 상태 (현재 vue의 currentPage)
const currentPage = ref(props.modelValue)

// 부모에서 props 변경 시 내부 상태 동기화
watch(() => props.modelValue, (newVal) => {currentPage.value = newVal})

// 전체 페이지 수 계산
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

// 표시할 페이지 범위 계산
const visiblePages = computed(() => {
  const total = totalPages.value
  const max = props.maxVisiblePages
  const current = currentPage.value

  let start = Math.max(1, current - Math.floor(max / 2))
  let end = start + max - 1
  if (end > total) {
    end = total
    start = Math.max(1, end - max + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 페이지 변경 함수
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    emit('update:modelValue', page) // 부모로 반영
  }
}
</script>

<template>
  <div class="flex justify-center items-center gap-2 mt-8">
    <!-- 이전 버튼 -->
    <button
      class="pagination-btn-base"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      &lt;
    </button>

    <!-- 페이지 번호 버튼들 -->
    <button
      v-for="page in visiblePages" :key="page" class="pagination-btn-base"
      :class="{
        'pagination-btn-click': page === currentPage,
        'pagination-btn': page !== currentPage
      }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <!-- 다음 버튼 -->
    <button
      class="pagination-btn-base"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      &gt;
    </button>
  </div>
</template>

<style scoped>
.pagination-btn-base {
  @apply min-w-[36px] h-9 rounded-md text-sm text-gray-dark font-medium transition;
}

.pagination-btn:disabled {
	@apply opacity-50 cursor-not-allowed;
}

.pagination-btn-click {
 @apply bg-primary text-white;
}

.pagination-btn {
	@apply bg-white border border-gray-300;
}

.pagination-btn:hover {
	@apply bg-gray-200;
}
</style>
