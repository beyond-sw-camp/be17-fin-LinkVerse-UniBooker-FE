<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import { onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import dashboardApi from '@/services/admin/dashboard_api'

const dashboardData = ref({
  summary: {},
  serviceGroups: [],
  reservationTrends: [],
})

const series = ref([])
const chartOptions = ref({
  chart: { type: 'line', toolbar: { show: true }, zoom: { enabled: false } },
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 4, strokeWidth: 2 },
  dataLabels: { enabled: false },
  xaxis: { categories: [] }, // 초기값 빈 배열
  yaxis: { min: 0, title: { text: '예약 건수' } },
  tooltip: {
    theme: 'light',
    x: {
      formatter: function (val, opts) {
        // val = x축 값(index), trends는 getDashboardData 안에서 설정
        if (!dashboardData.value.reservationTrends.length) return ''
        const dateStr = dashboardData.value.reservationTrends[opts.dataPointIndex].date
        return dateStr // yyyy-MM-dd 표시
      },
    },
  },
  legend: { position: 'top', horizontalAlign: 'center' },
  grid: { borderColor: '#E5E7EB', strokeDashArray: 4 },
})

const getDashboardData = async () => {
  const data = await dashboardApi.getDashboardData()
  dashboardData.value = data

  console.log(dashboardData.value)

  if (dashboardData.value.reservationTrends?.length) {
    const trends = dashboardData.value.reservationTrends

    // xaxis 날짜: 일(day)만 표시
    chartOptions.value.xaxis.categories = trends.map((t) => {
      const d = new Date(t.date)
      return d.getDate() // 1~31 숫자
    })

    // 그룹 이름 추출
    const groupNames = Object.keys(trends[0].groups || {})

    // series 구성
    series.value = groupNames.map((name) => ({
      name,
      data: trends.map((t) => t.groups[name] || 0),
    }))
  } else {
    // 데이터가 없을 경우 series 초기화
    series.value = []
    chartOptions.value.xaxis.categories = []
  }
}
onMounted(() => {
  getDashboardData()
})
</script>

<template>
  <AdminLayout>
    <div v-if="dashboardData.summary && Object.keys(dashboardData.summary).length">
      <!-- KPI 카드 -->
      <div class="kpi-cards">
        <div
          v-for="(value, key) in dashboardData.summary"
          :key="key"
          class="kpi-card components-white-container"
        >
          <p class="kpi-label">
            {{
              key === 'totalReservations'
                ? '총 예약 수'
                : key === 'activeServiceGroups'
                  ? '운영중인 서비스 그룹 수'
                  : key === 'activeServices'
                    ? '운영중인 서비스 수'
                    : '사용자 수'
            }}
          </p>
          <p class="kpi-value">{{ value.toLocaleString() }}</p>
        </div>
      </div>

      <!-- 서비스 그룹별 운영 현황 -->
      <div class="service-group-table mt-6">
        <span class="table-title">서비스 그룹별 운영 현황</span>
        <div class="components-white-container mt-2">
          <div class="components-super-table-container">
            <table class="components-super-table">
              <thead>
                <tr>
                  <th>그룹명</th>
                  <th>서비스 수</th>
                  <th>예약 건수</th>
                  <th>상태</th>
                  <th>조회수</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="s in dashboardData.serviceGroups"
                  :key="s.name"
                  class="hover:bg-gray-50 transition"
                >
                  <td class="text-left">{{ s.name }}</td>
                  <td class="text-center">{{ s.serviceCount }}</td>
                  <td class="text-right">{{ s.reservationCount }}</td>
                  <td class="text-center">{{ s.status === 'ACTIVE' ? '활성' : '비활성' }}</td>
                  <td class="text-right">{{ s.viewCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 예약 추이 그래프 -->
      <div class="reservation-trend-chart mt-6">
        <span class="table-title">예약 추이 그래프</span>
        <div class="components-white-container mt-2 chart-container">
          <VueApexCharts
            type="line"
            height="320"
            :width="'100%'"
            :options="chartOptions"
            :series="series"
          />
        </div>
      </div>
    </div>
    <div v-else>loading...</div>
  </AdminLayout>
</template>

<style scoped>
.kpi-cards {
  @apply flex gap-3;
}

.kpi-card {
  @apply flex-1 text-center p-4 rounded-2xl shadow border border-gray-100 bg-white;
}

.kpi-label {
  @apply text-sm text-gray-500 mb-1;
}

.kpi-value {
  @apply text-2xl font-semibold text-gray-800;
}

.table-title {
  @apply text-lg font-semibold text-gray-800;
}

.chart-container {
  @apply w-full p-1;
}
</style>
