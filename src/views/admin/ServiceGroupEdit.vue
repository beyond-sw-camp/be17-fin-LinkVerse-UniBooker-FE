<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import Dropdown from '@/components/Dropdown.vue'
import Input from '@/components/Input.vue'
import CustomFieldAdd from '@/components/CustomFieldAdd.vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import serviceApi from '@/services/admin/service_api'

// 라우터
const router = useRouter()
const route = useRoute()
const serviceGroupId = ref(route.params.id)
const userId = ref(5)

// --- 폼 데이터 상태 ---
const name = ref('')
const description = ref('')
const thumbnail = ref('')
const selectedCategory = ref('')
const isAlwaysAvailable = ref(false)

// 커스텀 필드
const serviceCustomFields = ref([])
const userCustomFields = ref([])

// 카테고리
const categoryOptions = ref([
  { label: '예약형', value: 'RESERVATION' },
  { label: '좌석형', value: 'SEAT' },
  { label: '신청형', value: 'EVENT' },
])

// 문자열 → Enum 변환 함수
const mapToEnum = (type) => {
  switch (type) {
    case 'TEXT':
      return 'TEXT'
    case 'NUMBER':
      return 'NUMBER'
    case 'DATE':
      return 'DATE'
    case 'TIME':
      return 'TIME'
    case 'RADIO':
      return 'RADIO'
    case 'CHECKBOX':
      return 'CHECKBOX'
    case 'BOOLEAN':
      return 'BOOLEAN'
    default:
      return 'TEXT'
  }
}

// 기존 서비스 그룹 정보 조회
const getServiceGroupInfo = async () => {
  try {
    const res = await serviceApi.getServiceGroupInfo(serviceGroupId.value)
    const data = res.data.data

    name.value = data.name
    description.value = data.description
    thumbnail.value = data.thumbnail
    selectedCategory.value = data.category
    isAlwaysAvailable.value = data.isAlwaysAvailable

    serviceCustomFields.value = data.customFields?.filter((f) => f.targetType === 'RESOURCE') || []
    userCustomFields.value = data.customFields?.filter((f) => f.targetType === 'USER') || []
  } catch (err) {
    console.error('서비스 그룹 정보 조회 실패:', err)
  }
}

// 수정 API 호출
const saveServiceGroup = async () => {
  if (!serviceGroupId.value) {
    alert('유효한 서비스 그룹 ID가 없습니다.')
    return
  }

  try {
    const formData = {
      userId: userId.value,
      name: name.value,
      description: description.value,
      thumbnail: thumbnail.value,
      category: selectedCategory.value,
      isAlwaysAvailable: isAlwaysAvailable.value,
      customFields: [
        ...serviceCustomFields.value.map((f) => ({
          fieldName: f.fieldName || '',
          description: f.description || '',
          dataType: mapToEnum(f.dataType || 'TEXT'),
          targetType: 'RESOURCE',
          required: f.required ?? false,
        })),
        ...userCustomFields.value.map((f) => ({
          fieldName: f.fieldName || '',
          description: f.description || '',
          dataType: mapToEnum(f.dataType || 'TEXT'),
          targetType: 'USER',
          required: f.required ?? false,
        })),
      ],
    }

    await serviceApi.editServiceGroup(serviceGroupId.value, formData)
    alert('서비스 그룹 정보가 수정되었습니다!')
    router.back()
  } catch (err) {
    console.error('서비스 그룹 정보 수정 실패:', err)
    alert('수정 중 오류가 발생했습니다.')
  }
}

const goBack = () => router.back()

onMounted(() => getServiceGroupInfo())
</script>

<template>
  <AdminLayout>
    <div class="components-page-title"><span>서비스 그룹 수정</span></div>

    <!-- 이미지 업로드 -->
    <section>
      <div class="form-label-container">
        <div>커버 이미지</div>
        <p>고객들이 어떤 서비스 그룹인지 쉽게 알 수 있도록 알맞은 이미지를 업로드 해주세요.</p>
      </div>
      <div id="service-group-image-upload">
        <label for="file-upload" class="file-upload-label"> 이미지 업로드 </label>
        <input id="file-upload" type="file" class="file-upload-input" />
      </div>
    </section>

    <!-- 이름 -->
    <section>
      <div class="form-label-container">
        <div>서비스 그룹 이름 <span>*</span></div>
        <p>어떤 종류의 서비스인가요? ( ex. 회의실 예약, 사내 동아리 모집 등 )</p>
      </div>
      <Input
        v-model="name"
        class="text-input"
        type="text"
        placeholder="서비스 이름을 작성해주세요."
      />
    </section>

    <!-- 설명 -->
    <section>
      <div class="form-label-container">
        <div>서비스 그룹 설명 <span>*</span></div>
      </div>
      <textarea v-model="description" placeholder="서비스 그룹 설명을 작성해주세요."></textarea>
    </section>

    <!-- 상시 모집 -->
    <section>
      <div class="form-label-container">
        <div>상시모집인가요? <span>*</span></div>
        <p>상시모집일 경우 서비스를 생성함과 동시에 예약/신청을 받게 됩니다.</p>
      </div>
      <div class="radio-button-container">
        <Input
          v-model="isAlwaysAvailable"
          class="radio-style"
          type="radio"
          label="예"
          :value="true"
        />
        <Input
          v-model="isAlwaysAvailable"
          class="radio-style"
          type="radio"
          label="아니오"
          :value="false"
        />
      </div>
    </section>

    <!-- 카테고리 -->
    <section>
      <div class="form-label-container">
        <div>카테고리 <span>*</span></div>
        <Dropdown
          v-model="selectedCategory"
          class="dropdown-style"
          :options="categoryOptions"
          placeholder="카테고리를 선택해주세요."
        />
      </div>
    </section>

    <!-- 서비스 입력 항목 -->
    <section>
      <div class="form-label-container">
        <div>서비스 입력 항목</div>
      </div>
      <CustomFieldAdd
        :customFields="serviceCustomFields"
        @add-field="serviceCustomFields.push($event)"
      />
    </section>

    <!-- 고객 입력 항목 -->
    <section>
      <div class="form-label-container">
        <div>고객 입력 항목</div>
      </div>
      <CustomFieldAdd :customFields="userCustomFields" @add-field="userCustomFields.push($event)" />
    </section>

    <!-- 버튼 -->
    <div class="button-container">
      <Button theme="gray" @click="goBack">돌아가기</Button>
      <Button @click="saveServiceGroup">수정하기</Button>
    </div>
  </AdminLayout>
</template>
<style scoped>
.form-label-container:first-child {
  @apply mt-[20px];
}

.form-label-container {
  @apply flex gap-3 items-center mt-[35px] mb-[6px];
}

.form-label-container > div {
  @apply flex gap-1 text-[15px];
}

.form-label-container span {
  @apply text-[#E23148];
}

.form-label-container p {
  @apply text-[12px] text-[#929292] flex items-center gap-2;
}

.form-label-container img {
  @apply w-[14px] h-[14px] cursor-pointer;
}

#service-group-image-upload {
  @apply rounded-[3px] bg-[#D9D9D9] w-[507px] h-[264px] flex items-center justify-center cursor-pointer;
}

.file-upload-input {
  @apply hidden;
}

.file-upload-label {
  @apply w-full h-full flex items-center justify-center cursor-pointer text-[15px] text-gray-dark;
}

.text-input {
  @apply w-[600px] text-[14px];
}

textarea {
  @apply resize-none rounded placeholder-gray-400 hover:placeholder-gray-600 outline-none border-b-2 transition-all duration-200 focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed text-[14px] px-2.5 py-2.5 w-[1000px] h-[125px];
}

.radio-button-container {
  @apply mt-[18px] flex flex-col gap-2;
}

.radio-style {
  @apply text-[14px] w-fit;
}

.dropdown-style {
  @apply text-[14px];
}

.button-container {
  @apply mt-[50px] flex gap-2;
}

.button-container button {
  @apply text-[14px] px-[22px];
}

.resource-create-question-container {
  @apply relative inline-block;
}

.question-icon {
  @apply cursor-pointer;
}

.category-description-box {
  display: none;
  @apply absolute top-full left-0 bg-white border border-gray-300 
  rounded-[3px] p-3 w-[380px] shadow-md text-xs leading-relaxed z-10;
}

.resource-create-question-container:hover .category-description-box {
  display: block;
}
</style>
