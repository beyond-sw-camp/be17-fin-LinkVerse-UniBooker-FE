<script setup>
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import FeatureCard from '@/components/FeatureCard.vue'
import AdminNavbar from '@/components/AdminNavbar.vue'

const router = useRouter()

const goToLogin = () => {
  router.push('/admin/login')
}

const goToSignup = () => {
  router.push('/admin/signup')
}
</script>

<template>
  <div class="admin-landing-container">
    <!-- 네비게이션 -->
    <div class="admin-landing-navbar">
      <AdminNavbar />
    </div>

    <!-- 히어로 섹션 -->
    <section class="admin-landing-hero">
      <h1 class="admin-landing-title">
        예약의 모든 데이터를 잡다<br />
        예약 신청부터 관리까지, 한 번에 해결하세요!
      </h1>
      <p class="admin-landing-description">
        고객의 예약을 통해 니즈를 파악하고 운영에 도움을 주는 통합예약 예약 서비스입니다.<br />
        소규모 모임부터 대규모 이벤트까지 안정적으로 운영하세요.
      </p>
    </section>

    <!-- 기능 섹션 -->
    <section class="admin-landing-features">
      <div class="admin-landing-grid">
        <!-- 커스텀 예약 -->
        <a href="/service">
          <FeatureCard title="커스텀 예약" bg-color="bg-[#B8D4FF]">
            <template #icon>
              <img
                src="/assets/images/landing_icon_custom.png"
                alt="커스텀 예약 아이콘"
                class="w-[120px]"
              />
            </template>
          </FeatureCard>
        </a>

        <!-- 실시간 예약관리 -->
        <a href="/service">
          <FeatureCard title="실시간 예약관리" bg-color="bg-white">
            <template #icon>
              <img
                src="/assets/images/landing_icon_reservation.png"
                alt="실시간 예약관리 아이콘"
                class="w-[120px]"
              />
            </template>
          </FeatureCard>
        </a>

        <!-- 고객관리 -->
        <a href="/service">
          <FeatureCard title="고객관리" bg-color="bg-[#B8D4FF]">
            <template #icon>
              <img
                src="/assets/images/landing_icon_customer.png"
                alt="고객관리 아이콘"
                class="w-[120px]"
              />
            </template>
          </FeatureCard>
        </a>

        <!-- 통계 분석 -->
        <a href="/service">
          <FeatureCard title="통계 분석" bg-color="bg-white">
            <template #icon>
              <img
                src="/assets/images/landing_icon_statistic.png"
                alt="통계 분석 아이콘"
                class="w-[120px]"
              />
            </template>
          </FeatureCard>
        </a>

        <!-- 권한관리 -->
        <a href="/service">
          <FeatureCard title="권한관리" bg-color="bg-[#B8D4FF]">
            <template #icon>
              <img
                src="/assets/images/landing_icon_auth.png"
                alt="권한관리 아이콘"
                class="w-[120px]"
              />
            </template>
          </FeatureCard>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 컨테이너 */
.admin-landing-container {
  @apply min-h-screen bg-gray-line flex flex-col items-center px-4;
}

/* 네비게이션 */
.admin-landing-navbar {
  @apply w-full max-w-[1194px] mt-8;
}

/* 히어로 섹션 */
.admin-landing-hero {
  @apply pt-32 pb-16 px-6 text-center;
}

.admin-landing-title {
  @apply text-3xl font-bold text-text mb-6 leading-tight;
}

.admin-landing-description {
  @apply text-sm text-gray-dark leading-relaxed;
}

/* 기능 섹션 */
.admin-landing-features {
  @apply py-12 px-6;
}

.admin-landing-grid {
  @apply container mx-auto 
         grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 
         gap-6 max-w-7xl;
}
</style>
