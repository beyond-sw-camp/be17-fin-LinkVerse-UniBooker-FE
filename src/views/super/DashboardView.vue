<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { onMounted, ref, watch } from 'vue'
import dashboardApi from '@/services/dashboard/dashboard_api'

const fontFamily = 'Montserrat, Noto Sans KR, sans-serif'

const isLoading = ref(true)
const hasError = ref(false)

// 대시보드 데이터
const dashboardData = ref({
  companyStats: { currentCompanyCount: 0, monthlyNewRegistrations: [] },
  customerStats: { currentCustomerCount: 0, cumulativeRegistrations: [] },
  serviceStats: { totalServiceCount: 0, categoryCounts: [], categoryLabels: [] },
  errorLogs: [],
})

// 차트 시리즈/옵션
const companySeries = ref([{ name: '월별 신규 가입', data: [] }])
const companyOptions = ref({
  chart: { id: 'company-bar', toolbar: { show: false }, fontFamily },
  xaxis: { categories: [], labels: { style: { fontFamily } } },
  yaxis: { labels: { style: { fontFamily } } },
  dataLabels: { style: { fontFamily } },
  colors: ['#3B82F6'],
  legend: { show: false },
})

const customerSeries = ref([{ name: '누적 가입', data: [] }])
const customerOptions = ref({
  chart: { id: 'customer-line', toolbar: { show: false }, fontFamily },
  xaxis: { categories: [], labels: { style: { fontFamily } } },
  yaxis: { labels: { style: { fontFamily } } },
  stroke: { curve: 'smooth' },
  dataLabels: { style: { fontFamily } },
  colors: ['#2563EB'],
  legend: { show: false },
})

const serviceSeries = ref([])
const serviceOptions = ref({
  chart: { id: 'service-donut', toolbar: { show: false }, fontFamily },
  labels: [],
  colors: ['#1E3A8A', '#2563EB', '#60A5FA', '#93C5FD', '#BFDBFE'],
  legend: { position: 'bottom', fontFamily },
  dataLabels: { style: { fontFamily } },
})

const errorLogs = ref([
  { code: 'AUTH_401', message: '로그인 토큰이 만료되었습니다.', time: '2025-10-13 09:42:12' },
  {
    code: 'DB_CONN_FAIL',
    message: '데이터베이스 연결 실패 (timeout 5000ms).',
    time: '2025-10-13 09:45:30',
  },
  { code: 'API_404', message: '요청한 리소스를 찾을 수 없습니다.', time: '2025-10-13 09:02:17' },
  {
    code: 'VALID_001',
    message: "필수 입력값 'email'이 누락되었습니다.",
    time: '2025-10-13 10:15:09',
  },
  { code: 'AUTH_403', message: '접근 권한이 없습니다.', time: '2025-10-13 10:20:42' },
  { code: 'SRV_500', message: '내부 서버 오류가 발생했습니다.', time: '2025-10-13 10:25:54' },
  {
    code: 'FILE_413',
    message: '업로드 파일 크기가 제한(10MB)을 초과했습니다.',
    time: '2025-10-13 10:32:10',
  },
  { code: 'PAY_502', message: '결제 서버 응답이 없습니다.', time: '2025-10-13 10:48:39' },
  { code: 'USER_409', message: '이미 등록된 이메일입니다.', time: '2025-10-13 11:01:27' },
  { code: 'DATA_422', message: '잘못된 형식의 JSON 데이터입니다.', time: '2025-10-13 11:13:05' },
])

// API 호출
const getDashboardData = async () => {
  try {
    const data = await dashboardApi.getSuperDashboardData()

    // ✅ undefined 체크 추가
    if (!data || !data.companyStats || !data.customerStats || !data.serviceStats) {
      console.error('대시보드 데이터가 올바르지 않습니다:', data)
      hasError.value = true
      return
    }

    dashboardData.value = data

    // 회사 차트 업데이트
    companySeries.value[0].data = data.companyStats.monthlyNewRegistrations || []
    companyOptions.value.xaxis.categories = Array.from(
      { length: (data.companyStats.monthlyNewRegistrations || []).length },
      (_, i) => i + 1,
    )

    // 고객 차트 업데이트
    customerSeries.value[0].data = data.customerStats.cumulativeRegistrations || []
    customerOptions.value.xaxis.categories = Array.from(
      { length: (data.customerStats.cumulativeRegistrations || []).length },
      (_, i) => i + 1,
    )

    // 서비스 차트 업데이트
    serviceSeries.value = data.serviceStats.categoryCounts || []
    serviceOptions.value.labels = data.serviceStats.categoryLabels || []
  } catch (err) {
    console.error('Dashboard API error:', err)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getDashboardData()
})
</script>

<template>
  <!-- 로딩 중 -->
  <div v-if="isLoading" class="loading-screen">
    <p>대시보드 데이터를 불러오는 중...</p>
  </div>

  <!-- 에러 발생 -->
  <div v-else-if="hasError" class="error-screen">
    <p>대시보드 데이터를 불러오는 데 실패했습니다.</p>
    <button @click="getDashboardData" class="retry-button">다시 시도</button>
  </div>

  <!-- 정상 데이터 표시 -->
  <div v-else>
    <!-- 통계 차트 -->
    <div class="statistics">
      <div class="statistics-item-container">
        <div>
          <span class="title">기업</span>
          <div class="statistics-item">
            <span class="subtitle">현재 가입 수</span>
            <p class="data">{{ dashboardData.companyStats.currentCompanyCount }}</p>
            <span class="subtitle">월별 신규 가입</span>
          </div>
        </div>

        <vue-apex-charts
          type="bar"
          :options="companyOptions"
          :series="companySeries"
          height="200"
        />
      </div>

      <div class="statistics-item-container">
        <div>
          <span class="title">고객</span>
          <div class="statistics-item">
            <span class="subtitle">현재 가입 수</span>
            <p class="data">{{ dashboardData.customerStats.currentCustomerCount }}</p>
          </div>
        </div>

        <vue-apex-charts
          type="line"
          :options="customerOptions"
          :series="customerSeries"
          height="200"
        />
      </div>

      <div class="statistics-item-container">
        <div>
          <span class="title">서비스</span>
          <div class="statistics-item">
            <span class="subtitle">총 서비스 수</span>
            <p class="data">{{ dashboardData.serviceStats.totalServiceCount }}</p>
          </div>
        </div>

        <vue-apex-charts
          type="donut"
          :options="serviceOptions"
          :series="serviceSeries"
          height="200"
        />
      </div>
    </div>

    <!-- 에러 로그 테이블 -->
    <div class="error-logs-container">
      <span class="title">에러 로그</span>
      <div class="error-logs">
        <div class="components-super-table-container">
          <table class="components-super-table">
            <thead>
              <tr>
                <th>에러코드</th>
                <th>상세내용</th>
                <th>시간</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in errorLogs" :key="index">
                <td>{{ log.code }}</td>
                <td>{{ log.message }}</td>
                <td>{{ log.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 통계 영역 */
.statistics {
  @apply grid gap-4 font-mont-noto;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* 각 카드 */
.statistics-item-container {
  @apply bg-white rounded-lg p-4 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md;
}

.statistics-item {
  @apply flex flex-col gap-2;
}

.title {
  @apply text-sm font-semibold text-gray-600 mb-1;
}

.subtitle {
  @apply text-xs text-gray-500;
}

.data {
  @apply text-3xl font-bold mb-2 text-gray-800;
}

/* 차트는 가로에 맞게 반응형으로 */
.statistics-item :deep(.apexcharts-canvas) {
  width: 100% !important;
}

/*  에러 로그 영역 */
.error-logs-container {
  @apply mt-6 font-mont-noto;
}

.error-logs {
  @apply bg-white rounded-md p-3 mt-2 border border-gray-200 flex flex-col max-h-64;
}

.error-logs .components-super-table-container {
  @apply flex-1 overflow-y-auto;
}

/* 로딩 & 에러 화면 */
.loading-screen,
.error-screen {
  @apply flex flex-col justify-center items-center h-screen gap-4;
}

.retry-button {
  @apply px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors;
}
</style>
