<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import { onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// ===== 대시보드 데이터 =====
const dashboardData = ref({
  totalServices: 1234,
  weeklyReservations: 6,
  weeklyCancel: 6,
  currentUsers: 12,
  totalUsers: 235,
  viewCount: 645,
  viewChangePercent: -8.8
})

// ===== 서비스별 성과 데이터 =====
const servicePerformance = ref([
  { name: '회의실 A', percent: 87 },
  { name: '회의실 B', percent: 63 },
  { name: '회의실 C', percent: 55 },
])

// ===== 성별 사용자 차트 =====
const genderChartOptions = ref({
  chart: { type: 'donut', height: 200 },
  labels: ['여성', '남성'],
  colors: ['#5B8FF9', '#FF6B9D'],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: false
        }
      }
    }
  },
})
const genderSeries = ref([68, 68])

// ===== 연령대별 사용자 차트 =====
const ageChartOptions = ref({
  chart: { type: 'donut', height: 200 },
  labels: ['10대', '20대'],
  colors: ['#5B8FF9', '#BDD7FF'],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: false
        }
      }
    }
  },
})
const ageSeries = ref([30, 68])

// ===== 시간대별 예약 현황 차트 =====
const timeSlotChartOptions = ref({
  chart: { type: 'bar', height: 280, toolbar: { show: false } },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      borderRadius: 4
    }
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: ['0시', '2시', '4시', '6시', '8시', '10시', '12시', '14시', '16시', '18시', '20시', '22시']
  },
  yaxis: { title: { text: '예약 건수' } },
  fill: { opacity: 1 },
  colors: ['#5B8FF9'],
  grid: { borderColor: '#E5E7EB' }
})
const timeSlotSeries = ref([
  {
    name: '예약 건수',
    data: [5, 8, 12, 15, 22, 28, 35, 30, 25, 20, 15, 10]
  }
])

// ===== 조회 수 추이 차트 =====
const viewTrendChartOptions = ref({
  chart: { type: 'line', height: 120, toolbar: { show: false }, sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  colors: ['#52C41A'],
  tooltip: { enabled: true },
  markers: { size: 0 }
})
const viewTrendSeries = ref([
  {
    name: '조회 수',
    data: [200, 250, 300, 280, 320, 290, 310, 280, 260, 300, 320, 280]
  }
])

const todayViewStats = ref({
  totalToday: 148,             // 오늘 조회 수 총합
  yesterdayTotal: 120,         // 어제 조회 수
  changePercent: +23,          // 전일 대비 %
  peakHour: '14시',            // 피크 시간대
  hourlyViews: [2,4,5,3,8,12,20,18,14,10,8,6,4,5,9,12,15,13,10,8,6,4,3,2], // 미니 차트
  lastHourChange: +5           // 직전 1시간 대비 변화량
})


// ===== 성별 연령 차트 (파이차트 + 바차트) =====
const genderAgeChartOptions = ref({
  chart: { type: 'donut', height: 150 },
  labels: ['남성', '여성'],
  colors: ['#5B8FF9', '#FF6B9D'],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '60%'
      }
    }
  }
})
const genderAgeSeries = ref([58, 42])

// 연령대별 막대 데이터
const ageData = ref([
  { age: '10대', male: 11, female: 6 },
  { age: '20대', male: 34, female: 23 },
  { age: '30대', male: 28, female: 32 },
  { age: '40대', male: 17, female: 23 },
  { age: '50대', male: 8, female: 12 },
  { age: '60대', male: 2, female: 4 }
])

// ===== 시간 추이별 차트 =====
const selectedTimePeriod = ref('시간별')
const timeTrendChartOptions = ref({
  chart: { type: 'line', height: 250, toolbar: { show: false } },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#52C41A'],
  xaxis: {
    categories: ['08일', '09일', '10일', '11일', '12일', '13일', '14일']
  },
  yaxis: { min: 0, max: 400 },
  dataLabels: { enabled: false },
  grid: { borderColor: '#E5E7EB' },
  markers: { size: 4 }
})
const timeTrendSeries = ref([
  {
    name: '조회 수',
    data: [200, 250, 300, 280, 320, 350, 330]
  }
])

// ===== 시간별/월별 탭 전환 =====
const switchTimePeriod = (period) => {
  selectedTimePeriod.value = period
  if (period === '시간별') {
    timeTrendChartOptions.value.xaxis.categories = ['08일', '09일', '10일', '11일', '12일', '13일', '14일']
    timeTrendSeries.value = [{ name: '조회 수', data: [200, 250, 300, 280, 320, 350, 330] }]
  } else {
    timeTrendChartOptions.value.xaxis.categories = ['1월', '2월', '3월', '4월', '5월', '6월']
    timeTrendSeries.value = [{ name: '조회 수', data: [2000, 2500, 2800, 3000, 3200, 3500] }]
  }
}

onMounted(() => {
  // API 호출 예정
})
</script>

<template>
  <AdminLayout>
    <div class="dashboard-container">
      <!-- KPI 카드 영역 -->
      <div class="kpi-cards">
        <div class="kpi-card">
          <p class="kpi-label">총 서비스 수</p>
          <p class="kpi-value">{{ dashboardData.totalServices.toLocaleString() }}</p>
        </div>
        <div class="kpi-card">
          <p class="kpi-label">누적 예약 수</p>
          <p class="kpi-value">{{ dashboardData.weeklyReservations }}</p>
        </div>
        <div class="kpi-card">
          <p class="kpi-label">누적 취소 수</p>
          <p class="kpi-value">{{ dashboardData.weeklyCancel }}</p>
        </div>
        <div class="kpi-card">
          <p class="kpi-label">이용자 수</p>
          <p class="kpi-value">{{ dashboardData.currentUsers }} / {{ dashboardData.totalUsers }}</p>
        </div>
      </div>

      <!-- 중간 섹션 -->
      <div class="middle-section">
        <!-- 서비스별 성과 -->
        <div class="card service-performance-card">
          <h3 class="card-title">서비스별 성과</h3>
          <div class="performance-list">
            <div v-for="service in servicePerformance" :key="service.name" class="performance-item">
              <div class="performance-header">
                <span class="service-name">{{ service.name }}</span>
                <span class="service-percent">{{ service.percent }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: service.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 사용자 특성별 이용 -->
        <div class="card user-characteristics-card">
          <h3 class="card-title">사용자 특성별 이용</h3>
          <div class="characteristics-content">
            <!-- 성별 차트 -->
            <div class="chart-section">
              <VueApexCharts
                type="donut"
                height="150"
                :options="genderChartOptions"
                :series="genderSeries"
              />
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-dot" style="background: #5B8FF9"></span>
                  <span>여성 68%</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot" style="background: #BDD7FF"></span>
                  <span>남성 68%</span>
                </div>
              </div>
            </div>

            <!-- 연령대별 차트 -->
            <div class="chart-section">
              <VueApexCharts
                type="donut"
                height="150"
                :options="ageChartOptions"
                :series="ageSeries"
              />
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-dot" style="background: #5B8FF9"></span>
                  <span>10대 30%</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot" style="background: #BDD7FF"></span>
                  <span>20대 68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 오늘 조회 수 -->
        <div class="card view-count-card">
          <h3 class="card-title">오늘 조회 수</h3>

          <div class="view-stats">
            <div class="view-number">
              {{ todayViewStats.totalToday }}<span class="unit">명</span>
            </div>

            <div class="view-change">
              <span>전일 대비</span>
              <span :class="todayViewStats.changePercent >= 0 ? 'positive' : 'negative'">
                {{ todayViewStats.changePercent }}%
              </span>
            </div>
          </div>

          <!-- 미니 라인 차트 -->
          <svg viewBox="0 0 100 40" class="mini-line-chart">
            <polyline
              :points="todayViewStats.hourlyViews.map((v, i) => `${i * (100 / (todayViewStats.hourlyViews.length - 1))},${40 - (v / Math.max(...todayViewStats.hourlyViews)) * 40}`).join(' ')"
              fill="none"
              stroke="#5B8FF9"
              stroke-width="2"
            />
          </svg>

          <!-- 피크 시간대 / 직전 1시간 대비 -->
          <div class="today-extra-info">
            <div class="extra-row">
              <span class="extra-label">피크 시간대</span>
              <span class="extra-value">{{ todayViewStats.peakHour }}</span>
            </div>
            <div class="extra-row">
              <span class="extra-label">직전 1시간 대비</span>
              <span class="extra-value" :class="todayViewStats.lastHourChange >= 0 ? 'positive' : 'negative'">
                {{ todayViewStats.lastHourChange >= 0 ? '+' : '' }}{{ todayViewStats.lastHourChange }}명
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 섹션 -->
      <div class="bottom-section">
        <!-- 시간대별 예약 현황 -->
        <div class="card time-slot-card">
          <h3 class="card-title">시간대별 예약 현황</h3>
          <VueApexCharts
            type="bar"
            height="280"
            :options="timeSlotChartOptions"
            :series="timeSlotSeries"
          />
        </div>

        <!-- 시간 추이별 -->
        <div class="card time-trend-card">
          <div class="time-trend-header">
            <h3 class="card-title">시간 추이별</h3>
            <div class="time-tabs">
              <button
                class="time-tab"
                :class="{ active: selectedTimePeriod === '시간별' }"
                @click="switchTimePeriod('시간별')"
              >
                시간별
              </button>
              <button
                class="time-tab"
                :class="{ active: selectedTimePeriod === '월별' }"
                @click="switchTimePeriod('월별')"
              >
                월별
              </button>
            </div>
          </div>
          <VueApexCharts
            type="line"
            height="250"
            :options="timeTrendChartOptions"
            :series="timeTrendSeries"
          />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard-container {
  @apply w-full;
}

.kpi-cards {
  @apply grid grid-cols-4 gap-4 mb-6 mt-5;
}

.kpi-card {
  @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center;
}

.kpi-card .kpi-label {
  @apply text-sm text-gray-500 mb-2;
}

.kpi-card .kpi-value {
  @apply text-2xl font-bold text-gray-800;
}

.card {
  @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-6;
}

.card .card-title {
  @apply text-lg font-semibold text-gray-800 mb-4;
}

.middle-section {
  @apply grid grid-cols-3 gap-4 mb-6;
}

.middle-section .card{
  @apply h-[500px];
}

.service-performance-card {
  @apply col-span-1;
}

.service-performance-card .performance-list {
  @apply h-[400px] space-y-4 overflow-y-auto pr-2;
  max-height: 100%;
}

.service-performance-card .performance-item {
  @apply space-y-2;
}

.service-performance-card .performance-header {
  @apply flex justify-between items-center;
}

.service-performance-card .service-name {
  @apply text-sm text-gray-700;
}

.service-performance-card .service-percent {
  @apply text-sm font-semibold text-gray-800;
}

.service-performance-card .progress-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.service-performance-card .progress-fill {
  @apply h-full bg-blue-500 transition-all duration-300;
}

.user-characteristics-card {
  @apply col-span-1;
}

.user-characteristics-card .characteristics-content {
  @apply space-y-6;
}

.user-characteristics-card .chart-section {
  @apply flex flex-col items-center;
}

.user-characteristics-card .chart-legend {
  @apply flex gap-4 mt-2;
}

.user-characteristics-card .legend-item {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.user-characteristics-card .legend-dot {
  @apply w-3 h-3 rounded-full;
}

.visitor-card {
  @apply col-span-1;
}

.visitor-card .visitor-header {
  @apply flex justify-between items-center mb-4;
}

.visitor-card .visitor-label {
  @apply text-sm font-medium text-gray-700;
}

.visitor-card .visitor-tabs {
  @apply flex gap-2;
}

.visitor-card .tab-btn {
  @apply px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50;
}

.visitor-card .tab-btn.active {
  @apply bg-gray-800 text-white border-gray-800;
}

.visitor-card .visitor-stats {
  @apply mb-4;
}

.visitor-card .stat-item {
  @apply mb-2;
}

.visitor-card .stat-label {
  @apply text-xs text-gray-500 block mb-1;
}

.visitor-card .stat-value-row {
  @apply flex items-baseline gap-1;
}

.visitor-card .stat-value {
  @apply text-3xl font-bold text-gray-800;
}

.visitor-card .stat-unit {
  @apply text-sm text-gray-600;
}

.visitor-card .stat-change {
  @apply text-sm font-medium;
}

.visitor-card .stat-change.positive {
  @apply text-green-600;
}

.visitor-card .visitor-mini-chart {
  @apply mt-3;
}

.visitor-card .mini-line-chart {
  @apply w-full h-10;
}

.visitor-card .visitor-info {
  @apply text-xs text-gray-500 mt-12;
}

.bottom-section {
  @apply grid grid-cols-4 gap-4;
}

.bottom-section .card {
  @apply h-[350px];
}

.time-slot-card {
  @apply col-span-2;
}

.view-count-card {
  @apply col-span-1;
}

.view-count-card .view-stats {
  @apply mb-4;
}

.view-count-card .view-number {
  @apply text-3xl font-bold text-gray-800 mb-2;
}

.view-count-card .view-number .unit {
  @apply text-sm text-gray-600 ml-1;
}

.view-count-card .view-change {
  @apply flex items-center gap-2 text-sm;
}

.view-count-card .view-change .positive {
  @apply text-green-600 font-medium;
}

.view-count-card .view-change .negative {
  @apply text-red-600 font-medium;
}

.view-count-card .view-legend {
  @apply flex items-center gap-2 mt-12 justify-center;
}

.view-count-card .legend-line {
  @apply w-8 h-0.5 bg-green-500;
}

.view-count-card .legend-text {
  @apply text-xs text-gray-600;
}

.gender-age-card {
  @apply col-span-1;
}

.gender-age-card .gender-age-content {
  @apply flex gap-4;
}

.gender-age-card .pie-section {
  @apply flex-shrink-0 relative;
}

.gender-age-card .pie-labels {
  @apply absolute inset-0 flex flex-col items-center justify-center gap-2;
}

.gender-age-card .pie-label-item {
  @apply text-center;
}

.gender-age-card .pie-value {
  @apply text-lg font-bold;
}

.gender-age-card .pie-value.male {
  @apply text-blue-500;
}

.gender-age-card .pie-value.female {
  @apply text-pink-500;
}

.gender-age-card .pie-unit {
  @apply text-xs text-gray-500 ml-1;
}

.gender-age-card .bar-section {
  @apply flex-1 space-y-3;
}

.gender-age-card .age-bar-row {
  @apply flex items-center gap-2;
}

.gender-age-card .age-label {
  @apply text-xs text-gray-600 w-10 flex-shrink-0;
}

.gender-age-card .age-bars {
  @apply flex-1 space-y-1;
}

.gender-age-card .age-bar {
  @apply relative h-4;
}

.gender-age-card .bar-fill {
  @apply h-full rounded transition-all;
}

.gender-age-card .bar-fill.male {
  @apply bg-blue-400;
}

.gender-age-card .bar-fill.female {
  @apply bg-pink-400;
}

.gender-age-card .bar-value {
  @apply absolute right-0 top-0 text-[10px] text-gray-600 leading-4;
}

.time-trend-card {
  @apply col-span-2;
}

.time-trend-card .time-trend-header {
  @apply flex justify-between items-center mb-4;
}

.time-trend-card .time-tabs {
  @apply flex gap-2;
}

.time-trend-card .time-tab {
  @apply px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50;
}

.time-trend-card .time-tab.active {
  @apply bg-gray-800 text-white border-gray-800;
}

.today-extra-info {
  @apply mt-6 space-y-2 text-sm;
}

.extra-row {
  @apply flex justify-between text-gray-700;
}

.extra-label {
  @apply text-xs text-gray-500;
}

.extra-value {
  @apply font-medium;
}

.extra-value.positive {
  @apply text-green-600;
}

.extra-value.negative {
  @apply text-red-600;
}

.mini-line-chart {
  @apply w-full h-12 mt-4;
}

</style>

