<script setup>
import { onMounted, reactive, ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/UseStore'
import { useRouter, useRoute } from 'vue-router'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import AccountManageModal from './AccountManageModal.vue'
import serviceApi from '@/services/service/service_api'
import adminApi from '@/services/admin/admin_api'
import { getCompanyLogoUrl } from '@/utils/imageUrl'
import notifyApi from '@/services/notification/notification_api'
import { useNotificationStore } from '@/stores/notificationStore'

const isModalOpen = ref(false)
const userData = ref(null)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// 상단 메뉴 상태
const selectedMainMenu = ref(null) // 'dashboard', 'manager', 'serviceGroupManage', null

// 서비스 그룹 상태
const serviceGroups = reactive([])
const dropdownItems = ['전체 분석', '예약 현황', '서비스 관리']
const openDropdown = ref(null)
const selectedMenuItems = ref({})

// 기업 로고
const companyLogo = computed(() => {
  if (authStore.company?.logoUrl) return getCompanyLogoUrl(authStore.company.logoUrl)
  return '/assets/images/admin_logo.png'
})

// 상단 메뉴 선택
const selectTopMenu = (menu) => {
  selectedMainMenu.value = menu
  openDropdown.value = null
}

// 모달 열기
async function openModal() {
  try {
    const response = await adminApi.getMyProfile()
    userData.value = response.data?.data || response.data
    isModalOpen.value = true
  } catch {
    alert('프로필 조회에 실패했습니다.')
  }
}

// 로그아웃
const handleLogout = async () => {
  try {
    await adminApi.logout()
  } finally {
    authStore.logout()
    router.push('/admin/login')
  }
}

// 관리자 권한 체크
const isValidAdmin = computed(() =>
  authStore.isLoggedIn && ['ADMIN', 'MANAGER'].includes(authStore.role)
)
const validateAdminAccess = () => {
  if (!isValidAdmin.value) {
    authStore.logout()
    alert('관리자 권한이 필요합니다.')
    router.push('/admin/login')
  }
}

// 서비스 그룹 목록
const getServiceGroups = async () => {
  try {
    const res = await serviceApi.getServiceGroups()
    Object.assign(serviceGroups, res.data.data.resourceGroups)
  } catch (error) {}
}

// 서비스 그룹 메뉴 링크
const getMenuLink = (menu, sg) => {
  const nameQuery = { serviceGroupName: sg.name }
  switch (menu) {
    case '서비스 관리':
      return { path: `/admin/service-management/${sg.id}`, query: nameQuery }
    case '예약 현황':
      if (sg.serviceCategory === 'RESERVATION') {
        return { path: `/admin/reservation-management/${sg.id}`, query: nameQuery }
      } else if (sg.serviceCategory === 'SEAT') {
        return { path: `/admin/seat-reservation-management/${sg.id}`, query: nameQuery }
      } else {
        return { path: `/admin/event-reservation-status/${sg.id}`, query: nameQuery }
      }
    case '전체 분석':
      return '#'
    default:
      return '#'
  }
}

// 드롭다운 토글
const toggleDropdown = (index) => {
  selectedMainMenu.value = null
  openDropdown.value = openDropdown.value === index ? null : index
}

// 하위 메뉴 선택
const selectMenuItem = (serviceIndex, menu) => {
  selectedMainMenu.value = null
  selectedMenuItems.value[serviceIndex] = menu
}

// 알림
const isDropdownOpen = ref(false)
const notifications = ref([])
const notiToggleDropdown = async () => {
  notificationStore.reset()
  if (!isDropdownOpen.value) {
    const data = await notifyApi.getNotifyList(0, 3)
    notifications.value = data || []
  }
  isDropdownOpen.value = !isDropdownOpen.value
}

// 초기 메뉴 상태
const initMenuState = () => {
  const path = route.path
  if (path.includes('/admin/dashboard')) selectedMainMenu.value = 'dashboard'
  else if (path.includes('/admin/manager-management')) selectedMainMenu.value = 'manager'
  else if (path.includes('/admin/service-group-management')) selectedMainMenu.value = 'serviceGroupManage'
  else selectedMainMenu.value = null

  serviceGroups.forEach((sg, i) => {
    dropdownItems.forEach((menu) => {
      const link = getMenuLink(menu, sg)
      if (link.path && path.includes(link.path)) {
        openDropdown.value = i
        selectedMenuItems.value[i] = menu
      }
    })
  })
}

onMounted(() => {
  getServiceGroups().then(() => initMenuState())
  validateAdminAccess()
})

watch(() => authStore.role, () => validateAdminAccess())
watch(() => route.path, () => initMenuState())

</script>

<template>
  <div class="admin-layout">
    <!-- 서브바 -->
    <div class="sub-bar-contaienr">
      <div class="logo-section">
        <img src="/assets/images/unibooker_white_logo.png" alt="UniBooker 로고" />
      </div>

      <router-link to="/admin/service-group-create" class="service-group-create-button-container">
        서비스 그룹 생성
      </router-link>

      <!-- 상단 Control 메뉴 -->
      <div class="sub-menu-section">
        <span class="sub-menu-label">Control</span>
        <div class="sub-menu-items-container">
          <router-link
            class="sub-menu-item"
            :class="{ 'selected-menu-item': selectedMainMenu === 'dashboard' }"
            to="/admin/dashboard"
            @click="selectTopMenu('dashboard')"
          >전체 현황</router-link>

          <router-link
            v-if="authStore.role === 'ADMIN'"
            class="sub-menu-item"
            :class="{ 'selected-menu-item': selectedMainMenu === 'manager' }"
            to="/admin/manager-management"
            @click="selectTopMenu('manager')"
          >관리자 관리</router-link>

          <router-link
            class="sub-menu-item"
            :class="{ 'selected-menu-item': selectedMainMenu === 'serviceGroupManage' }"
            to="/admin/service-group-management"
            @click="selectTopMenu('serviceGroupManage')"
          >서비스 그룹 관리</router-link>
        </div>
      </div>

      <!-- 서비스 그룹 메뉴 -->
      <div class="sub-menu-section flex-1">
        <span class="sub-menu-label">Service Groups</span>
        <div class="sub-menu-items-container sub-menu-scroll">
          <div v-for="(item, index) in serviceGroups" :key="item.id">
            <!-- 상위 메뉴: 이동 없음, 드롭다운만 토글 -->
            <div
              class="sub-menu-item"
              :class="{ 'selected-menu-item': openDropdown === index }"
              @click="toggleDropdown(index)"
            >
              {{ item.name }}
            </div>

            <div v-if="openDropdown === index">
              <router-link
                v-for="child in dropdownItems"
                :key="child"
                :to="getMenuLink(child, item)"
                class="service-group-menu-item"
                :class="{ 'selected-service-group-item': selectedMenuItems[index] === child }"
                @click.stop="selectMenuItem(index, child)"
              >
                {{ child }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 로그아웃 -->
      <div class="sub-menu-logout-button-container" @click="handleLogout">
        <img src="/assets/icons/ic-logout.png" alt="로그아웃" /> Logout
      </div>
    </div>

    <!-- 본문 -->
    <div class="content-body">
      <div class="content-top">
        <div class="admin-badge">
          <img
            @click="openModal"
            :src="companyLogo"
            alt="기업 로고"
            @error="$event.target.src = '/assets/images/admin_logo.png'"
          />
          <span @click="openModal">{{ authStore.user?.name }} 관리자님</span>
          <button @click.stop="notiToggleDropdown" class="super-notify-btn">
            <img
              :src="notificationStore.hasNotification
                ? '/assets/icons/ic-new-notify.png'
                : '/assets/icons/ic-no-notify.png'"
              alt="알림 아이콘"
              class="notify-icon"
            />
          </button>
          <NotificationDropdown
            type="admin"
            v-if="isDropdownOpen"
            :notifications="notifications"
            @close="isDropdownOpen = false"
          />
        </div>
      </div>

      <div class="content-slot">
        <slot />
      </div>
    </div>
  </div>

  <AccountManageModal :open="isModalOpen" :userData="userData" @close="isModalOpen = false" />
</template>


<style scoped>
.sub-bar-contaienr {
  @apply bg-primary h-screen text-white overflow-hidden flex flex-col max-w-[280px] w-full pr-[20px];
}

.logo-section {
  @apply w-[100px] mx-[14px] my-[15px];
}

.service-group-create-button-container {
  @apply mx-[11px] max-w-[240px] w-full py-[8px] text-sm flex justify-center items-center border-2 border-white rounded-[3px] mt-[15px] cursor-pointer hover:bg-primary-hover;
}

.sub-menu-section {
  @apply mt-[25px];
}

.sub-menu-label {
  @apply mx-[16px] mb-[10px] block text-sm;
}

.sub-menu-item {
  @apply max-w-[252px] pl-[30px] py-[10px] text-sm cursor-pointer block
    hover:border-l-4
    hover:border-white
    hover:bg-[rgba(255,255,255,0.44)];
}

.selected-menu-item {
  @apply border-l-4 border-white bg-[rgba(255,255,255,0.44)];
}

.sub-menu-logout-button-container {
  @apply flex gap-3 items-center ml-[16px] mb-[20px] text-sm cursor-pointer hover:font-medium w-fit;
}

.sub-menu-logout-button-container img {
  @apply w-[15px] h-[15px];
}

.sub-menu-scroll {
  @apply flex-1 overflow-y-auto max-h-[280px];
}

.service-group-menu-item {
  @apply bg-[rgba(105,105,105,0.52)] text-[13px] pl-[34px] py-2 cursor-pointer text-[#C0C0C0] block
  hover:text-white
  hover:font-medium;
}

.selected-service-group-item {
  @apply text-white font-medium;
}

.admin-layout {
  @apply flex;
}

.content-body {
  @apply h-screen overflow-y-auto bg-gray-line flex-1 ml-[-20px] rounded-tl-[20px] rounded-bl-[20px] px-[30px] py-[22px];
}

.content-top {
  @apply w-full flex justify-end;
}

.admin-badge {
  @apply bg-white flex items-center rounded-[20px] px-[12px] py-[6px] text-xs text-[#7D7D7D] font-medium cursor-pointer relative;
}

.admin-badge img:first-child {
  @apply h-[25px] mx-3;
}

.admin-badge span {
  @apply mx-[3px] mt-[1.5px];
}

.admin-badge img:last-child {
  @apply w-[17px] h-[18px];
}

.content-slot {
  @apply mt-[10px] w-full;
}

/* 관리자 추가 모달 스타일 */
.add-modal-container {
  @apply px-[30px] py-[20px] flex flex-col;
}

h3 {
  @apply text-[18px] font-medium mb-[3px];
}

.add-modal-container p {
  @apply text-[12px] text-gray-dark;
}

.input-field-container {
  @apply mt-[35px] flex flex-col gap-6;
}

.input-field-item {
  @apply flex flex-col gap-1;
}

label {
  @apply text-[14px];
}

.input-field-item span {
  @apply text-[#FF2222];
}

.add-modal-container input {
  @apply bg-gray-line px-[14px] py-[10px] text-[14px] rounded-[3px];
}

.add-modal-button-container {
  @apply flex gap-3 mt-[70px];
}

.add-modal-button-container button {
  @apply py-[10px];
}
</style>
