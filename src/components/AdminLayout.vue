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

// ===== 기본 상태 =====

const isModalOpen = ref(false)
const userData = ref(null)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

/** 로그아웃 중 플래그 (중복 검증 방지) */
const isLoggingOut = ref(false)

// ===== 메뉴 상태 =====

const selectedMainMenu = ref(null)
const serviceGroups = reactive([])
const dropdownItems = ['전체 분석', '예약 현황', '서비스 관리']
const openDropdown = ref(null)
const selectedMenuItems = ref({})

// ===== 알림 상태 =====

const isDropdownOpen = ref(false)
const notifications = ref([])

// ===== Computed =====

/**
 * 기업 로고 URL 계산
 */
const companyLogo = computed(() => {
  if (authStore.company?.logoUrl) return getCompanyLogoUrl(authStore.company.logoUrl)
  return '/assets/images/admin_logo.png'
})

/**
 * 관리자 권한 체크
 * - 로그인 상태 및 역할(ADMIN/MANAGER) 검증
 */
const isValidAdmin = computed(
  () => authStore.isLoggedIn && ['ADMIN', 'MANAGER'].includes(authStore.role),
)

// ===== 메뉴 관리 함수 =====

/**
 * 메뉴 상태 초기화
 * - 모든 메뉴 선택 해제
 */
const resetMenuState = () => {
  selectedMainMenu.value = null
  openDropdown.value = null
}

/**
 * 상단 Control 메뉴 선택
 */
const selectTopMenu = (menu) => {
  selectedMainMenu.value = menu
  openDropdown.value = null
}

/**
 * 서비스 그룹 드롭다운 토글
 */
const toggleDropdown = (index) => {
  resetMenuState()
  openDropdown.value = openDropdown.value === index ? null : index
}

/**
 * 서비스 그룹 하위 메뉴 선택
 */
const selectMenuItem = (serviceIndex, menu) => {
  resetMenuState()
  selectedMenuItems.value[serviceIndex] = menu
}

/**
 * 초기 메뉴 상태 설정
 * - 현재 라우트 경로에 따라 메뉴 상태 초기화
 */
const initMenuState = () => {
  const path = route.path

  if (path.includes('/admin/dashboard')) {
    selectedMainMenu.value = 'dashboard'
  } else if (path.includes('/admin/manager-management')) {
    selectedMainMenu.value = 'manager'
  } else if (path.includes('/admin/service-group-management')) {
    selectedMainMenu.value = 'serviceGroupManage'
  } else {
    selectedMainMenu.value = null
  }

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

// ===== 서비스 그룹 함수 =====

/**
 * 서비스 그룹 목록 조회
 */
const getServiceGroups = async () => {
  try {
    const res = await serviceApi.getServiceGroups()
    Object.assign(serviceGroups, res.data.data.resourceGroups)
  } catch (error) {
    console.error('서비스 그룹 조회 실패:', error)
  }
}

/**
 * 서비스 그룹 메뉴 링크 생성
 * - 메뉴 항목에 따라 해당하는 경로 반환
 */
const getMenuLink = (menu, sg) => {
  const nameQuery = { serviceGroupName: sg.name }

  switch (menu) {
    case '서비스 관리':
      return { path: `/admin/service-management/${sg.id}`, query: nameQuery }
    case '예약 현황':
      if (sg.serviceCategory === 'RESERVATION') {
        return { path: `/admin/reservation-management/${sg.id}`, query: nameQuery }
      } else if (sg.serviceCategory === 'SEAT') {
        return { path: `/admin/seat-reservation-status/${sg.id}`, query: nameQuery }
      } else {
        return { path: `/admin/event-reservation-status/${sg.id}`, query: nameQuery }
      }
    case '전체 분석':
      return '#'
    default:
      return '#'
  }
}

// ===== 모달 관리 함수 =====

/**
 * 프로필 모달 열기
 */
async function openModal() {
  try {
    const response = await adminApi.getMyProfile()
    userData.value = response.data?.data || response.data
    isModalOpen.value = true
  } catch {
    alert('프로필 조회에 실패했습니다.')
  }
}

// ===== 인증 관리 함수 =====

/**
 * 관리자 접근 권한 검증
 * - 로그아웃 중에는 스킵 (중복 검증 방지)
 * - 권한 없으면 자동 리다이렉트
 */
const validateAdminAccess = () => {
  if (isLoggingOut.value) {
    return
  }

  if (!isValidAdmin.value) {
    authStore.logout()
    router.push('/admin/login')
  }
}

/**
 * 로그아웃 처리
 * - 로그아웃 중 플래그 설정으로 validateAdminAccess 중복 실행 방지
 * - 백엔드 API 호출 후 스토어 초기화
 */
const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await adminApi.logout()
  } catch (error) {
    console.error('로그아웃 API 실패:', error)
  } finally {
    authStore.logout()
    router.push('/admin/login')
  }
}

// ===== 알림 관리 함수 =====

/**
 * 알림 드롭다운 토글
 */
const notiToggleDropdown = async () => {
  notificationStore.reset()
  if (!isDropdownOpen.value) {
    const data = await notifyApi.getNotifyList(0, 3)
    notifications.value = data || []
  }
  isDropdownOpen.value = !isDropdownOpen.value
}

// ===== 라이프사이클 =====

onMounted(() => {
  getServiceGroups().then(() => initMenuState())
  validateAdminAccess()
})

// ===== 감시자 =====

/**
 * 권한 변경 감시
 * - 로그아웃 중에는 검증 스킵
 */
watch(
  () => authStore.role,
  () => {
    if (!isLoggingOut.value) {
      validateAdminAccess()
    }
  },
)

/**
 * 라우트 변경 감시
 * - 메뉴 상태 초기화
 */
watch(
  () => route.path,
  () => initMenuState(),
)
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

      <!-- Control 메뉴 -->
      <div class="sub-menu-section">
        <span class="sub-menu-label">Control</span>
        <div class="sub-menu-items-container">
          <router-link
            class="sub-menu-item"
            :class="{ 'selected-menu-item': selectedMainMenu === 'dashboard' }"
            to="/admin/dashboard"
            @click="selectTopMenu('dashboard')"
          >
            전체 현황
          </router-link>

          <router-link
            v-if="authStore.role === 'ADMIN'"
            class="sub-menu-item"
            :class="{ 'selected-menu-item': selectedMainMenu === 'manager' }"
            to="/admin/manager-management"
            @click="selectTopMenu('manager')"
          >
            관리자 관리
          </router-link>

          <router-link
            class="sub-menu-item"
            :class="{ 'selected-menu-item': selectedMainMenu === 'serviceGroupManage' }"
            to="/admin/service-group-management"
            @click="selectTopMenu('serviceGroupManage')"
          >
            서비스 그룹 관리
          </router-link>
        </div>
      </div>

      <!-- 서비스 그룹 메뉴 -->
      <div class="sub-menu-section flex-1">
        <span class="sub-menu-label">Service Groups</span>
        <div class="sub-menu-items-container sub-menu-scroll">
          <div v-for="(item, index) in serviceGroups" :key="item.id">
            <!-- 상위 메뉴 토글 -->
            <div
              class="sub-menu-item"
              :class="{ 'selected-menu-item': openDropdown === index }"
              @click="toggleDropdown(index)"
            >
              {{ item.name }}
            </div>

            <!-- 하위 메뉴 -->
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
              :src="
                notificationStore.hasNotification
                  ? '/assets/icons/ic-new-notify.png'
                  : '/assets/icons/ic-no-notify.png'
              "
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
/* 레이아웃 */
.admin-layout {
  @apply flex;
}

.sub-bar-contaienr {
  @apply bg-primary h-screen text-white overflow-hidden flex flex-col max-w-[280px] w-full pr-[20px];
}

.content-body {
  @apply h-screen overflow-y-auto bg-gray-line flex-1 ml-[-20px] rounded-tl-[20px] rounded-bl-[20px] px-[30px] py-[22px];
}

/* 로고 */
.logo-section {
  @apply w-[100px] mx-[14px] my-[15px];
}

/* 서비스 그룹 생성 버튼 */
.service-group-create-button-container {
  @apply mx-[11px] max-w-[240px] w-full py-[8px] text-sm flex justify-center items-center border-2 border-white rounded-[3px] mt-[15px] cursor-pointer hover:bg-primary-hover;
}

/* 메뉴 섹션 */
.sub-menu-section {
  @apply mt-[25px];
}

.sub-menu-label {
  @apply mx-[16px] mb-[10px] block text-sm;
}

.sub-menu-items-container {
  @apply flex flex-col;
}

.sub-menu-scroll {
  @apply flex-1 overflow-y-auto max-h-[280px];
}

/* 메뉴 아이템 */
.sub-menu-item {
  @apply max-w-[252px] pl-[30px] py-[10px] text-sm cursor-pointer block
    hover:border-l-4
    hover:border-white
    hover:bg-[rgba(255,255,255,0.44)];
}

.selected-menu-item {
  @apply border-l-4 border-white bg-[rgba(255,255,255,0.44)];
}

.service-group-menu-item {
  @apply bg-[rgba(105,105,105,0.52)] text-[13px] pl-[34px] py-2 cursor-pointer text-[#C0C0C0] block
    hover:text-white
    hover:font-medium;
}

.selected-service-group-item {
  @apply text-white font-medium;
}

/* 로그아웃 버튼 */
.sub-menu-logout-button-container {
  @apply flex gap-3 items-center ml-[16px] mb-[20px] text-sm cursor-pointer hover:font-medium w-fit;
}

.sub-menu-logout-button-container img {
  @apply w-[15px] h-[15px];
}

/* 상단 바 */
.content-top {
  @apply w-full flex justify-end;
}

/* 관리자 배지 */
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

/* 콘텐츠 슬롯 */
.content-slot {
  @apply mt-[10px] w-full;
}
</style>
