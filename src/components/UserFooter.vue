<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPrivacy = () => {
  router.push('/privacy')
}

const goToTerms = () => {
  router.push('/terms')
}

const goToContact = () => {
  router.push('/contact')
}
</script>

<template>
  <footer class="user-footer">
    <div class="user-footer-container">
      <!-- 링크 메뉴 -->
      <nav class="user-footer-nav">
        <button @click="goToPrivacy" class="user-footer-nav-item">개인정보처리방침</button>
        <span class="user-footer-divider">|</span>
        <button @click="goToTerms" class="user-footer-nav-item">이용약관</button>
        <span class="user-footer-divider">|</span>
        <button @click="goToContact" class="user-footer-nav-item">비지니스 문의</button>
      </nav>

      <!-- 저작권 정보 -->
      <div class="user-footer-copyright">
        <div class="user-footer-copyright-text">
          Copyright LinkVerse. All rights reserved.
          <img
            src="/assets/images/unibooker_blue_logo.svg"
            alt="UniBooker"
            class="user-footer-logo"
          />
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.user-footer {
  @apply w-full h-[30px] bg-gray-50 border-t border-gray-200 mt-auto;
}

.user-footer-container {
  @apply max-w-7xl mx-auto px-6 flex flex-col items-center;
}

.user-footer-nav {
  @apply my-4 flex items-center gap-5;
}

.user-footer-nav-item {
  @apply text-sm font-normal text-gray-400 hover:text-gray-500 hover:font-medium transition-colors cursor-pointer bg-transparent border-none;
}

.user-footer-divider {
  @apply text-gray-400 text-sm;
}

.user-footer-copyright {
  @apply text-center;
}

.user-footer-copyright-text {
  @apply text-xs text-gray-800 flex items-center;
}

.user-footer-logo {
  @apply h-3.5 w-auto ml-1 inline-block grayscale opacity-60;
}
</style>
