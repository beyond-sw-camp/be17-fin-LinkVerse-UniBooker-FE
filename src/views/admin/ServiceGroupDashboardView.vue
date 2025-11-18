<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import dashboardApi from '@/services/dashboard/dashboard_api'


/** 기본 설정 */
const route = useRoute()

const headerItems = ref([
  { label: '총 서비스 수', key: 'resourceCount' },
  { label: '누적 예약 수', key: 'cumReservationCount' },
  { label: '누적 취소 수', key: 'cumCancleCount' },
  { label: '이용자 수', key: 'useCustomerCount', subKey: 'totalCustomerCount' }
])

/** 대시보드 데이터 */
const dashboardData = ref({})


/** 
 * 성별 사용자 차트 */
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

/** 
 * 연령대별 사용자 차트 */
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

/** 
 * 조회수 증감률 */
const calcChangePercent = (today, yesterday) => {
  if (yesterday === 0) {
    if (today === 0) return 0
    return 100
  }
  return ((today - yesterday) / yesterday) * 100;
}


/**
* 시간대별 예약 현황 차트 */
const timeSlotChartOptions = ref({
  chart: { type: 'bar', height: 280, toolbar: { show: false } },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '10%',
      borderRadius: 4
    }
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: []
  },
  yaxis: { title: { text: '예약 건수' } },
  fill: { opacity: 1 },
  colors: ['#5B8FF9'],
  grid: { borderColor: '#E5E7EB' }
})

const timeSlotSeries = ref([
  { name: '예약 건수', data: [] }
])

// 막대 너비 설정
const calculateColumnWidth = (count) => {
  if (count <= 3) return '10%'       // 아주 적음 (얇게)
  if (count <= 6) return '20%'       // 적음
  if (count <= 10) return '30%'      // 중간
  if (count <= 15) return '40%'      // 많음
  return '50%'                       // 매우 많음 (넓게)
}

// 시간별 예약 수 데이터 설정
const applyReservaionHourlyDate = () => {
  const list = dashboardData.value.houlryReservationCounts || []

  const categories = list.map(i => `${i.hour}시`)
  const values = list.map(i => i.count)
  const columnWidth = calculateColumnWidth(categories.length)

  timeSlotChartOptions.value = {
    ...timeSlotChartOptions.value,
    plotOptions: {
      ...timeSlotChartOptions.value.plotOptions,
      bar: {
        ...timeSlotChartOptions.value.plotOptions.bar,
        columnWidth: columnWidth
      }
    },
    xaxis: {
      ...timeSlotChartOptions.value.xaxis,
      categories
    }
  }

  timeSlotSeries.value = [
    { name: '예약 건수', data: values }
  ]
}


/** 
 * 시간 추이별 차트 */
const timeTrendChartOptions = ref({
  chart: { type: 'line', height: 250, toolbar: { show: false } },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#52C41A'],
  xaxis: { categories: [] },
  yaxis: { min: 0, max: 100 },
  dataLabels: { enabled: false },
  grid: { borderColor: '#E5E7EB' },
  markers: { size: 4 }
})

const timeTrendSeries = ref([{ name: '조회 수', data: [] }])

// 시간별 조회 수 데이터 설정
const applyViewHourlyData = () => {
  const list = dashboardData.value.hourlyViewCounts || []

  timeTrendChartOptions.value = {
    ...timeTrendChartOptions.value,
    xaxis: {
      ...timeTrendChartOptions.value.xaxis,
      categories: list.map(i => `${i.hour}시`)
    }
  }

  timeTrendSeries.value = [
    { name: '조회 수', data: list.map(i => i.viewCount) }
  ]
}


// 리소스 그룹별 대시보드 API 호출
const getServiceGroupDashboardData = async () => {
  const response = await dashboardApi.getAdminResourceGroupDashboardData(route.params.serviceGroupId)
  dashboardData.value = response.data
}

// 다른 리소스 그룹 선택 했을 시 라우터 감시
watch(
  () => route.path,
  () => getServiceGroupDashboardData()
)

// 시간별 조회수 데이터 감지
watch(
  () => dashboardData.value.hourlyViewCounts,
  () => { applyViewHourlyData() }
)

// 시간별 예약수 데이터 감지
watch(
  () => dashboardData.value.houlryReservationCounts,
  () => { applyReservaionHourlyDate() }
)

// 화면 로드시 api 호출 및 데이터 설정
onMounted(() => {
  getServiceGroupDashboardData()
})
</script>

<template>
  <AdminLayout>
    <div class="dashboard-container">
      <!-- 1. 상단 섹션 -->
      <div class="kpi-cards">
        <div v-for="item in headerItems" class="kpi-card" :key="item.key">
          <p class="kpi-label">{{ item.label }}</p>
          <!-- 서브 값이 있는 경우 -->
          <p class="kpi-value" v-if="item.subKey">{{ dashboardData[item.key] }} / {{ dashboardData[item.subKey] }}</p>
          <!-- 일반 값 -->
          <p class="kpi-value" v-else>{{ dashboardData[item.key] }}</p>
        </div>
      </div>

      <!-- 2. 중간 섹션 -->
      <div class="middle-section">
        <!-- 서비스별 성과 -->
        <div class="card service-performance-card">
          <h3 class="card-title">서비스별 성과</h3>
          <div class="performance-list">
            <div v-for="service in dashboardData.performanceByResources" :key="service.resourceName" class="performance-item">
              <div class="performance-header">
                <span class="service-name">{{ service.resourceName }}</span>
                <span class="service-percent">{{ service.count }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: service.count + '%' }"></div>
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
            <div class="view-number">{{ dashboardData.todayViewCount }}<span class="unit">명</span></div>
            <div class="view-change">
              <span>전일 대비</span>
              <span :class="calcChangePercent(dashboardData.todayViewCount, dashboardData.yesterDayViewCount) >= 0 ? 'positive' : 'negative'">
                {{ calcChangePercent(dashboardData.todayViewCount, dashboardData.yesterDayViewCount) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 하단 섹션 -->
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
          </div>
          <VueApexCharts
            type="line"
            height="250"
            :options="timeTrendChartOptions.value"
            :series="timeTrendSeries.value"
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
  @apply grid grid-cols-6 gap-4 mb-6;
}

.middle-section .card{
  @apply h-[400px];
}

.service-performance-card {
  @apply col-span-2;
}

.service-performance-card .performance-list {
  @apply h-[300px] space-y-4 overflow-y-auto pr-2;
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
  @apply col-span-3;
}

.user-characteristics-card .characteristics-content {
  @apply flex flex-row justify-center items-center h-[80%];
}

.user-characteristics-card .chart-section {
  @apply flex flex-col justify-center items-center w-1/2;
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

