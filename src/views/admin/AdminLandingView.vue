<script setup>
import { useRouter } from 'vue-router'
import FeatureCard from '@/components/FeatureCard.vue'
import { SECTION_IDS } from '@/constants/section-ids'

const router = useRouter()

const featureCards = [
  {
    id: SECTION_IDS.CUSTOM_RESERVATION,
    title: '커스텀 예약',
    icon: 'landing_icon_custom.png',
    bgColor: 'bg-[#B8D4FF]',
  },
  {
    id: SECTION_IDS.REALTIME_MANAGEMENT,
    title: '실시간 예약관리',
    icon: 'landing_icon_reservation.png',
    bgColor: 'bg-white',
  },
  {
    id: SECTION_IDS.SMART_CUSTOMER,
    title: '고객관리',
    icon: 'landing_icon_customer.png',
    bgColor: 'bg-[#B8D4FF]',
  },
  {
    id: SECTION_IDS.STATISTICS_ANALYTICS,
    title: '통계 분석',
    icon: 'landing_icon_statistic.png',
    bgColor: 'bg-white',
  },
  {
    id: SECTION_IDS.PERMISSION_MANAGEMENT,
    title: '권한관리',
    icon: 'landing_icon_auth.png',
    bgColor: 'bg-[#B8D4FF]',
  },
]

const handleFeatureClick = (sectionId) => {
  router.push({
    name: 'serviceIntro',
    query: {
      section: sectionId,
    },
  })
}
</script>

<template>
  <div class="admin-landing-container">
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

    <section class="admin-landing-features">
      <div class="admin-landing-grid">
        <div
          v-for="feature in featureCards"
          :key="feature.id"
          @click="handleFeatureClick(feature.id)"
          @keypress.enter="handleFeatureClick(feature.id)"
          @keypress.space.prevent="handleFeatureClick(feature.id)"
          tabindex="0"
          role="button"
          :aria-label="`${feature.title} 상세보기`"
        >
          <FeatureCard :title="feature.title" :bg-color="feature.bgColor">
            <template #icon>
              <img
                :src="`/assets/images/${feature.icon}`"
                :alt="`${feature.title} 아이콘`"
                class="w-[120px]"
              />
            </template>
          </FeatureCard>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.admin-landing-container {
  @apply min-h-screen bg-gray-line flex flex-col items-center px-4;
}

/* 네비게이션 */
.admin-landing-navbar {
  @apply w-full max-w-[1194px] mt-[30px];
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

.admin-landing-features {
  @apply py-12 px-6;
}

.admin-landing-grid {
  @apply container mx-auto 
         grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 
         gap-6 max-w-7xl;
}

.admin-landing-grid > div {
  @apply cursor-pointer transition-all duration-300;
}

.admin-landing-grid > div:hover {
  @apply transform scale-105;
}

.admin-landing-grid > div:focus {
  @apply outline-none ring-2 ring-primary ring-offset-2 rounded-3xl;
}

.admin-landing-grid > div:active {
  @apply transform scale-100;
}
</style>
