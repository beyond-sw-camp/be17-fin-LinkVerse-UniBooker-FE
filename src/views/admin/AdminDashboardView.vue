<script setup>
import AdminLayout from '@/components/AdminLayout.vue'
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
<<<<<<< Updated upstream
=======
import dashboardApi from '@/services/dashboard/dashboard_api'
>>>>>>> Stashed changes

// ✅ KPI 더미데이터
const kpi = ref({
  totalReservations: 1284,
  activeGroups: 6,
  activeServices: 18,
  totalUsers: 342,
})

// ✅ 서비스 그룹별 운영 현황 더미데이터
const serviceGroups = ref([
  {
    serviceGroupName: '회의실 예약',
    serviceCount: 5,
    reservationCount: 320,
    status: '운영 중',
    views: 1540,
  },
  {
    serviceGroupName: '스터디룸 예약',
    serviceCount: 3,
    reservationCount: 210,
    status: '운영 중',
    views: 980,
  },
  {
    serviceGroupName: '사내 복지시설 신청',
    serviceCount: 4,
    reservationCount: 185,
    status: '마감',
    views: 750,
  },
  {
    serviceGroupName: '직원 교육 신청',
    serviceCount: 2,
    reservationCount: 90,
    status: '운영 중',
    views: 410,
  },
  {
    serviceGroupName: '이벤트 부스 예약',
    serviceCount: 4,
    reservationCount: 135,
    status: '운영 중',
    views: 520,
  },
])

// ✅ 서비스 그룹별 예약 추이 더미 데이터 (최근 7일)
const series = ref([
  { name: '회의실 예약', data: [50, 45, 60, 70, 80, 75, 90] },
  { name: '스터디룸 예약', data: [30, 35, 40, 45, 50, 55, 60] },
  { name: '사내 복지시설 신청', data: [20, 25, 22, 18, 20, 23, 25] },
  { name: '직원 교육 신청', data: [10, 12, 15, 10, 8, 11, 9] },
  { name: '이벤트 부스 예약', data: [15, 18, 20, 22, 19, 25, 23] },
])

const chartOptions = ref({
  chart: { type: 'line', toolbar: { show: true }, zoom: { enabled: false } },
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 4, strokeWidth: 2 },
  dataLabels: { enabled: false },
  xaxis: { categories: ['10/15', '10/16', '10/17', '10/18', '10/19', '10/20', '10/21'] },
  yaxis: { min: 0, title: { text: '예약 건수' } },
  tooltip: { theme: 'light' },
  legend: { position: 'top', horizontalAlign: 'center' },
  grid: { borderColor: '#E5E7EB', strokeDashArray: 4 },
})
<<<<<<< Updated upstream
=======

const getDashboardData = async () => {
  const data = await dashboardApi.getAdminDashboardData()
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
>>>>>>> Stashed changes
</script>

<template>
  <AdminLayout>
    <!-- ✅ KPI 카드 -->
    <div class="kpi-cards">
      <div v-for="(value, key) in kpi" :key="key" class="kpi-card components-white-container">
        <p class="kpi-label">
          {{
            key === 'totalReservations'
              ? '총 예약 수'
              : key === 'activeGroups'
                ? '운영중인 서비스 그룹 수'
                : key === 'activeServices'
                  ? '운영중인 서비스 수'
                  : '사용자 수'
          }}
        </p>
        <p class="kpi-value">{{ value.toLocaleString() }}</p>
      </div>
    </div>

    <!-- ✅ 서비스 그룹별 운영 현황 -->
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
                v-for="s in serviceGroups"
                :key="s.serviceGroupName"
                class="hover:bg-gray-50 transition"
              >
                <td class="text-left">{{ s.serviceGroupName }}</td>
                <td class="text-center">{{ s.serviceCount }}</td>
                <td class="text-right">{{ s.reservationCount }}</td>
                <td class="text-center">{{ s.status }}</td>
                <td class="text-right">{{ s.views.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ✅ 예약 추이 그래프 -->
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
