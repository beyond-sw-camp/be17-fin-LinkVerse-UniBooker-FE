<script setup>
import PageNation from './components/PageNation.vue';
// App.vue는 최상위 컴포넌트
// 라우터 뷰만 렌더링
</script>

<template>
  <RouterView />
  <PageNation
  :total-items="120"
  v-model:current-page="page" />
  
</template>

<style>
/* 전역 스타일은 assets/styles/index.css에서 관리 */
</style>
