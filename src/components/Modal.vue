<script setup>
const props = defineProps({
  open: Boolean,
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['close'])

function handleOverlayClick(e) {
  // closeOnOverlay 설정이 되어있고 overlay를 클릭했을 때만 닫기
  if (props.closeOnOverlay && e.target === e.currentTarget) {
    console.log('close modal')
    emit('close')
  }
}
</script>

<template>
  <div v-if="open" class="components-modal-overlay" @click="handleOverlayClick">
    <!-- 모달 본문 -->
    <div class="components-modal-contents" @click.stop>
      <slot />
    </div>
  </div>
</template>
