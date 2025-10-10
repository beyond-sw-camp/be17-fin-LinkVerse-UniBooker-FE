<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 링크 메뉴 -->
      <nav class="footer-nav">
        <a href="/privacy" class="footer-nav-item">개인정보처리방침</a>
        <span class="footer-divider">|</span>
        <a href="/terms" class="footer-nav-item">이용약관</a>
        <span class="footer-divider">|</span>
        <a href="/contact" class="footer-nav-item">비지니스 문의</a>
      </nav>

      <!-- 저작권 정보 -->
      <div class="footer-copyright">
        <p class="footer-copyright-text">
          Copyright LinkVerse. All rights reserved.
          <img src="/public/assets/images/unibooker_logo.svg" alt="UniBooker" class="footer-logo" />
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 필요시 로직 추가
</script>

<style scoped>
.footer {
  @apply w-full bg-gray-50 border-t border-gray-200 mt-auto;
}

.footer-container {
  @apply max-w-7xl mx-auto px-6 py-6 flex flex-col items-center gap-3;
}

/* 네비게이션 링크 */
.footer-nav {
  @apply flex items-center gap-4;
}

.footer-nav-item {
  @apply text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors;
}

.footer-divider {
  @apply text-gray-400 text-sm;
}

/* 저작권 정보 */
.footer-copyright {
  @apply text-center;
}

.footer-copyright-text {
  @apply text-xs text-gray-500 flex items-center gap-1;
}

/* 풋터 로고 */
.footer-logo {
  @apply h-4 w-auto inline-block;
}

.footer {
  @apply w-full bg-gray-50 border-t border-gray-200 mt-auto;
}

.footer-container {
  @apply max-w-7xl mx-auto px-6 py-6 flex flex-col items-center gap-3;
}

/* 네비게이션 링크 */
.footer-nav {
  @apply flex items-center gap-4;
}

.footer-nav-item {
  @apply text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors;
}

.footer-divider {
  @apply text-gray-400 text-sm;
}

/* 저작권 정보 */
.footer-copyright {
  @apply text-center;
}

.footer-copyright-text {
  @apply text-xs text-gray-500 flex items-center gap-1;
}

/* 풋터 로고 */
.footer-logo {
  @apply h-4 w-auto inline-block;
}
</style>
