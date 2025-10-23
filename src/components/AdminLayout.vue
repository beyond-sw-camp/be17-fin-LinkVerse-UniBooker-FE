<script setup>
import { onMounted, reactive, ref } from 'vue'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import Modal from './Modal.vue'
import Button from './Button.vue'
import serviceApi from '@/services/admin/service_api'

const isProfileModalOpen = ref(false)
const isEditModalOpen = ref(false)

const openEditModal = () => {
  isEditModalOpen.value = true
}

const openProfileModal = () => {
  isProfileModalOpen.value = true
}

const closeAddModal = () => {
  isProfileModalOpen.value = false
}

// 서비스 그룹 목록 조회
const serviceGroups = reactive([])
const getServiceGroups = async () => {
  try {
    const response = await serviceApi.getServiceGroups()
    const data = response.data.data

    Object.assign(serviceGroups, data.resourceGroups)
  } catch (error) {
    console.log('서비스 그룹 목록 조회 실패: ', error)
  }
}
// 서비스 그룹의 드롭다운 메뉴 항목
const dropdownItems = ['전체 분석', '예약 현황', '예약 관리', '서비스 관리']
const getMenuLink = (menu, serviceGroupId, serviceGroupName) => {
  switch (menu) {
    case '서비스 관리':
      return `/admin/service-management/${serviceGroupId}?serviceGroupName=${serviceGroupName}`
    case '예약 관리':
      return `/admin/reservation-management/${serviceGroupId}?serviceGroupName=${serviceGroupName}`
    case '예약 현황':
      return '#'
    case '전체 분석':
      return '#'
    default:
      return '#'
  }
}
const openDropdown = ref(null) // 열려있는 서비스 그룹
const selectedMenuItems = ref(
  // 드롭다운 메뉴 항목의 초기값은 첫 번째 메뉴인 '전체 분석'
  // 이후에는 마지막으로 머물렀던 메뉴 항목을 유지
  Object.fromEntries(serviceGroups.map((_, i) => [i, dropdownItems[0]])),
)

// 드롭다운 토글
const toggleDropdown = (index) => {
  if (openDropdown.value === index) {
    openDropdown.value = null
  } else {
    openDropdown.value = index
  }
}

// 드롭다운 메뉴 선택
const selectMenuItem = (serviceIndex, menu) => {
  selectedMenuItems.value[serviceIndex] = menu
}

// 알림 관련 상태, 예시
const isDropdownOpen = ref(false)
const notifications = ref([
  { id: 1, message: '신규 기업 회원가입 요청이 도착했습니다.', time: '2분 전' },
  { id: 2, message: '서버 점검이 내일 오전 9시에 예정되어 있습니다.', time: '1시간 전' },
  { id: 3, message: '신청서가 검토 완료되었습니다.', time: '어제' },
])

// 알림 아이콘 클릭 토글
const notiToggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

onMounted(() => {
  getServiceGroups()
})
</script>

<template>
  <div class="admin-layout">
    <!-- 서브메뉴바 -->
    <div class="sub-bar-contaienr">
      <!-- UniBooker 로고 -->
      <div class="logo-section">
        <img src="/public/assets/images/unibooker_white_logo.png" alt="UniBooker 로고 이미지" />
      </div>

      <!-- 리소스 그룹 생성 버튼 -->
      <router-link to="/admin/service-group-create" class="service-group-create-button-container"
        >서비스 그룹 생성</router-link
      >

      <!-- Control 섹션 -->
      <div class="sub-menu-section">
        <span class="sub-menu-label">Control</span>
        <div class="sub-menu-items-container">
          <router-link class="sub-menu-item" to="/admin/dashboard">전체 현황</router-link>
          <router-link class="sub-menu-item" to="/admin/manager-management"
            >관리자 관리</router-link
          >
          <router-link class="sub-menu-item" to="/admin/service-group-managation"
            >서비스 그룹 관리</router-link
          >
        </div>
      </div>

      <!-- Service Groups 섹션 -->
      <div class="sub-menu-section flex-1">
        <span class="sub-menu-label">Service Groups</span>
        <div class="sub-menu-items-container sub-menu-scroll">
          <div v-for="(item, index) in serviceGroups" :key="index">
            <router-link
              to="#!"
              class="sub-menu-item"
              :class="{ 'selected-menu-item': openDropdown === index }"
              @click="toggleDropdown(index)"
            >
              {{ item.name }}
            </router-link>
            <div v-if="openDropdown === index">
              <router-link
                v-for="child in dropdownItems"
                :key="child"
                :to="getMenuLink(child, item.id, item.name)"
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

      <!-- 로그아웃 버튼 -->
      <div class="sub-menu-logout-button-container">
        <img src="/public/assets/icons/ic-logout.png" alt="로그아웃" />
        Logout
      </div>
    </div>

    <!-- 서브메뉴 별 내용이 표시되는 곳 -->
    <div class="content-body">
      <div class="content-top">
        <div class="admin-badge">
          <img src="/public/assets/images/admin_logo.png" alt="기업 로고 이미지" />
          <span @click="openProfileModal">김아영 관리자님</span>
          <button @click.stop="notiToggleDropdown" class="super-notify-btn">
            <img src="/assets/icons/ic-new-notify.png" alt="알림 아이콘" class="notify-icon" />
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
        <!-- 여기에 내용이 들어갑니다! -->
        <slot />
      </div>
    </div>
  </div>

  <!-- 관리자 추가 버튼 클릭 시 뜨는 모달 -->
  <Modal :open="isProfileModalOpen" @close="isProfileModalOpen = false">
    <div class="add-modal-container">
      <h3>관리자 추가</h3>
      <p>
        기업의 관리자를 추가할 수 있습니다. 입력하신 이메일로 가입에 필요한 계정 정보(이메일 및
        비밀번호)가 발송됩니다. 정확한 안내를 위해 이메일 주소를 신중하게 입력해주세요.
      </p>

      <div class="input-field-container">
        <div class="input-field-item">
          <label>이름 <span>*</span></label>
          <input type="text" placeholder="관리자의 이름을 입력해주세요." />
        </div>
        <div class="input-field-item">
          <label>이메일 <span>*</span></label>
          <input type="email" placeholder="관리자의 이메일을 입력해주세요." />
        </div>
        <div class="input-field-item">
          <label>연락처 <span>*</span></label>
          <input type="phone" placeholder="관리자의 연락처를 입력해주세요." />
        </div>
      </div>

      <div class="add-modal-button-container">
        <Button class="button-px" theme="gray" @click="closeAddModal">취소</Button>
        <Button class="button-px">추가하기</Button>
      </div>
    </div>
  </Modal>
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
  @apply w-[90px];
}

.admin-badge span {
  @apply ml-[3px] mr-[12px];
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

.button-px {
  @apply px-0;
}
</style>
