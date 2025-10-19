<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { ref } from 'vue'

const fontFamily = 'Montserrat, Noto Sans KR, sans-serif'

// 기업 Bar Chart
const companySeries = ref([
  { name: '월별 신규 가입', data: [5, 10, 8, 12, 7, 9, 15, 11, 6, 14, 10, 13] },
])
const companyOptions = ref({
  chart: { id: 'company-bar', toolbar: { show: false }, fontFamily },
  xaxis: {
    categories: Array.from({ length: 12 }, (_, i) => i + 1),
    labels: { style: { fontFamily } },
  },
  yaxis: { labels: { style: { fontFamily } } },
  dataLabels: { style: { fontFamily } },
  colors: ['#3B82F6'],
  legend: { show: false },
})

// 고객 Line Chart
const customerSeries = ref([
  { name: '누적 가입', data: [50, 80, 120, 150, 180, 200, 230, 260, 300, 340, 400, 456] },
])
const customerOptions = ref({
  chart: { id: 'customer-line', toolbar: { show: false }, fontFamily },
  xaxis: {
    categories: Array.from({ length: 12 }, (_, i) => i + 1),
    labels: { style: { fontFamily } },
  },
  yaxis: { labels: { style: { fontFamily } } },
  stroke: { curve: 'smooth' },
  dataLabels: { style: { fontFamily } },
  colors: ['#2563EB'],
  legend: { show: false },
})

// 서비스 Donut Chart
const serviceSeries = ref([80, 100, 54])
const serviceOptions = ref({
  chart: { id: 'service-donut', toolbar: { show: false }, fontFamily },
  labels: ['예약', '좌석 예매', '이벤트 신청'],
  colors: ['#1E3A8A', '#2563EB', '#60A5FA'],
  legend: { position: 'bottom', fontFamily },
  dataLabels: { style: { fontFamily } },
})

// 에러 로그 데이터
const errorLogs = ref([
  { code: 'AUTH_401', message: '로그인 토큰이 만료되었습니다.', time: '2025-10-13 09:42:12' },
  {
    code: 'DB_CONN_FAIL',
    message: '데이터베이스 연결 실패 (timeout 5000ms).',
    time: '2025-10-13 09:45:30',
  },
  { code: 'API_404', message: '요청한 리소스를 찾을 수 없습니다.', time: '2025-10-13 10:02:17' },
  {
    code: 'VALID_001',
    message: '필수 입력값 ‘email’이 누락되었습니다.',
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
</script>

<template>
  <!-- 통계 차트 -->
  <div class="statistics">
    <div class="statistics-item-container">
      <div>
        <span class="title">기업</span>
        <div class="statistics-item">
          <span class="subtitle">현재 가입 수</span>
          <p class="data">123</p>
          <span class="subtitle">월별 신규 가입</span>
        </div>
      </div>

      <vue-apex-charts type="bar" :options="companyOptions" :series="companySeries" height="200" />
    </div>

    <div class="statistics-item-container">
      <div>
        <span class="title">고객</span>
        <div class="statistics-item">
          <span class="subtitle">현재 가입 수</span>
          <p class="data">456</p>
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
          <p class="data">234</p>
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
</style>
