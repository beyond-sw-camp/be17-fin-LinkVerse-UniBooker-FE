<script setup>
import { useRouter } from 'vue-router'
import AdminNavbar from '@/components/AdminNavbar.vue'

const router = useRouter()
</script>

<template>
  <div class="service-page-container">
    <!-- 히어로 섹션 (네비게이션 포함) -->
    <section class="service-page-hero-section">
      <!-- 히어로 콘텐츠 그리드 -->
      <div class="service-page-hero-grid">
        <!-- 왼쪽: 텍스트 -->
        <div class="service-page-hero-text">
          <p class="service-page-hero-subtitle">대규모 예약의 새로운 기준</p>
          <h1 class="service-page-hero-title">UniBooker</h1>
          <p class="service-page-hero-description">
            수십 명이 동시에 접속해도 밀리지 않는 예약 시스템을<br />
            이제 구독만으로 우리 기업에 도입하세요.
          </p>
        </div>

        <!-- 오른쪽: 이미지 -->
        <div class="service-page-main-image">
          <img
            src="/public/assets/images/6c43f219c30ef9799c70a95471f2a836.gif"
            alt="서비스소개 배경"
            class="service-page-gif"
          />
        </div>
      </div>
    </section>

    <!-- UniBooker 소개 섹션 -->
    <section class="service-page-intro">
      <div class="service-page-intro-content">
        <p class="service-page-intro-text">
          <span class="service-page-intro-brand">UniBooker</span>는 수천 명이 동시에 접속해도 밀리지
          않는 예약 시스템으로<br />
          고객, 기업, 기관, 이벤트 등 어떤 산업에서도 활용 가능한
          <strong>통합 예약 관리 플랫폼입니다.</strong>
        </p>
      </div>
    </section>

    <!-- 기능 섹션 1: 커스텀 예약 설정 -->
    <section class="service-page-feature">
      <div class="service-page-feature-container">
        <!-- 텍스트 (왼쪽) -->
        <div class="service-page-feature-text-l">
          <h2 class="service-page-feature-title">커스텀 예약 설정</h2>
          <p class="service-page-feature-description">
            하나의 틀에 맞추지 않습니다.<br />
            기업마다 다른 운영 방식, 유연하게 대응하세요.
          </p>
          <p class="service-page-feature-detail">
            산업별, 기업별로 필요한 예약 정책은 모두 다릅니다.<br />
            UniBooker는 각 기업의 운영 방식에 맞춰<br />
            예약 규칙을 자유롭게 설정할 수 있습니다.
          </p>
        </div>

        <!-- 이미지 (오른쪽) -->
        <div class="service-page-feature-image">
          <div class="service-page-placeholder"></div>
        </div>
      </div>
    </section>

    <!-- 기능 섹션 2: 실시간 예약 관리 -->
    <section class="service-page-feature service-page-feature-reverse">
      <div class="service-page-feature-container">
        <!-- 이미지 (왼쪽) -->
        <div class="service-page-feature-image">
          <div class="service-page-placeholder service-page-placeholder-blue"></div>
        </div>

        <!-- 텍스트 (오른쪽) -->
        <div class="service-page-feature-text-r">
          <h2 class="service-page-feature-title">실시간 예약 관리</h2>
          <p class="service-page-feature-description">
            동시 접속 1만 명도 문제없습니다.<br />
            정확하고 빠른 예약 처리, 지금 경험하세요.
          </p>
          <p class="service-page-feature-detail">
            수강신청 오픈, 인기 이벤트 등록처럼<br />
            특정 시간에 트래픽이 집중되는 상황에서도<br />
            UniBooker는 모든 요청을 안정적으로 처리합니다.
          </p>
        </div>
      </div>
    </section>

    <!-- 기능 섹션 3: 스마트 고객 관리 -->
    <section class="service-page-feature">
      <div class="service-page-feature-container">
        <!-- 텍스트 (왼쪽) -->
        <div class="service-page-feature-text-l">
          <h2 class="service-page-feature-title">스마트 고객 관리</h2>
          <p class="service-page-feature-description">
            예약하는 순간부터 데이터가 쌓입니다.<br />
            고객을 이해하고, 더 나은 서비스를 제공하세요.
          </p>
          <p class="service-page-feature-detail">
            단순히 예약만 받는 것이 아닙니다.<br />
            고객의 예약 패턴을 분석하고 관리하여<br />
            더욱 효율적인 운영이 가능합니다.
          </p>
        </div>

        <!-- 이미지 (오른쪽) -->
        <div class="service-page-feature-image">
          <div class="service-page-placeholder"></div>
        </div>
      </div>
    </section>

    <!-- 기능 섹션 4: 실시간 통계 & 분석 -->
    <section class="service-page-feature service-page-feature-reverse">
      <div class="service-page-feature-container">
        <!-- 이미지 (왼쪽) -->
        <div class="service-page-feature-image">
          <div class="service-page-placeholder service-page-placeholder-blue"></div>
        </div>

        <!-- 텍스트 (오른쪽) -->
        <div class="service-page-feature-text-r">
          <h2 class="service-page-feature-title">실시간 통계 & 분석</h2>
          <p class="service-page-feature-description">
            어떤 서비스가 인기 있나요? 언제 가장 바쁜가요?<br />
            한눈에 보는 운영 인사이트.
          </p>
          <p class="service-page-feature-detail">
            실시간 대시보드로 예약 현황을 모니터링하고<br />
            축적된 데이터로 더 효율적인 운영 전략을 수립하세요.
          </p>
        </div>
      </div>
    </section>

    <!-- 기능 섹션 5: 유연한 권한 관리 -->
    <section class="service-page-feature">
      <div class="service-page-feature-container">
        <!-- 텍스트 (왼쪽) -->
        <div class="service-page-feature-text-l">
          <h2 class="service-page-feature-title">유연한 권한 관리</h2>
          <p class="service-page-feature-description">
            누가 무엇을 할 수 있는지 명확하게<br />
            보안과 효율, 두 마리 토끼를 잡으세요.
          </p>
          <p class="service-page-feature-detail">
            여러 관리자가 함께 시스템을 운영할 때<br />
            권한을 명확하게 나누면 보안도 강화되고<br />
            업무도 효율적입니다.
          </p>
        </div>

        <!-- 이미지 (오른쪽) -->
        <div class="service-page-feature-image">
          <div class="service-page-placeholder"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 컨테이너 */
.service-page-container {
  @apply min-h-screen bg-gray-line flex flex-col items-center;
}

/* 히어로 섹션 전체 (네비게이션 포함) */
.service-page-hero-section {
  @apply w-full bg-gray-line flex flex-col items-center;
}

.service-page-hero-grid {
  @apply w-full max-w-7xl ml-10 px-20 py-10
         grid grid-cols-1 lg:grid-cols-2 gap-12 items-center;
}

.service-page-main-image {
  @apply w-full flex items-center;
}

/* 히어로 콘텐츠 */
.service-page-hero {
  @apply w-full flex flex-col items-start text-left max-w-7xl pt-40 pb-20 w-full;
}

.service-page-hero-subtitle {
  @apply text-base text-gray-dark mb-2;
}

.service-page-hero-title {
  @apply text-6xl font-bold text-text mb-6;
}

.service-page-hero-description {
  @apply text-base text-gray-dark leading-relaxed;
}

/* UniBooker 소개 섹션 */
.service-page-intro {
  @apply w-full bg-primary py-20 px-6;
}

.service-page-intro-content {
  @apply max-w-4xl mx-auto;
}

.service-page-intro-text {
  @apply text-base text-white leading-relaxed text-center;
}

.service-page-intro-brand {
  @apply font-bold;
}

/* 기능 섹션 */
.service-page-feature {
  @apply w-full py-20 px-6;
}

.service-page-feature-container {
  @apply max-w-5xl mx-auto 
         grid grid-cols-1 lg:grid-cols-2 
         gap-12 items-center;
}

/* 텍스트 영역 */
.service-page-feature-text-l {
  @apply space-y-4 text-left ml-10 flex flex-col items-start;
}

.service-page-feature-text-r {
  @apply space-y-4 text-right mr-10 flex flex-col items-end;
}

.service-page-feature-title {
  @apply text-3xl font-bold text-text mb-4;
}

.service-page-feature-description {
  @apply text-base text-text leading-relaxed font-medium;
}

.service-page-feature-detail {
  @apply text-sm text-gray-dark leading-relaxed;
}

/* 이미지 영역 */
.service-page-feature-image {
  @apply w-full;
}

.service-page-placeholder {
  @apply w-full h-80 bg-white rounded-2xl shadow-md;
}

.service-page-placeholder-blue {
  @apply bg-[#B8D4FF];
}

/* 역방향 레이아웃 */
.service-page-feature-reverse .service-page-feature-container {
  @apply lg:grid-flow-dense;
}

.service-page-feature-reverse .service-page-feature-text {
  @apply lg:col-start-2;
}

.service-page-feature-reverse .service-page-feature-image {
  @apply lg:col-start-1 lg:row-start-1;
}

/* 반응형 */
@media (max-width: 1023px) {
  .service-page-hero-title {
    @apply text-4xl;
  }

  .service-page-feature-title {
    @apply text-2xl;
  }

  .service-page-placeholder {
    @apply h-60;
  }
}
</style>
