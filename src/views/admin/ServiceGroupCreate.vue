<script setup>
import { ref } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue'
import Dropdown from '@/components/Dropdown.vue'
import CustomFieldAdd from '@/components/CustomFieldAdd.vue';
import serviceApi from '@/services/admin/service_api'
import { useRouter } from 'vue-router';

const router = useRouter()

// --- 카테고리 ---
const category = ref([
  { label: '예약형', value: 'RESERVATION' },
  { label: '좌석형', value: 'SEAT' },
  { label: '신청형', value: 'EVENT' },
])

// --- 폼 데이터 상태 ---
const name = ref('')
const description = ref('')
const thumbnail = ref('')
const selectedCategory = ref('')
const isAlwaysAvailable = ref(false)

// --- 커스텀 필드 ---
const serviceCustomFields = ref([])
const userCustomFields = ref([])

// ---서비스 그룹 이미지 업로드---
const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // 1. FormData 생성 및 백엔드에서 presigned URL 요청
    const formData = new FormData()
    formData.append('file', file)
    formData.append('imageType', 'serviceGroup')

    const presignedUrl = await serviceApi.getServiceGroupPresignedURL(formData)
    if (!presignedUrl) throw new Error('Presigned URL을 가져오지 못했습니다.')

    console.log('Presigned URL:', presignedUrl)

    // 2. S3에 이미지 업로드
    await serviceApi.uploadImage(presignedUrl, file)

    // 3. CloudFront URL로 변환
    const cloudFrontDomain = 'https://d2h9e9y86awp4t.cloudfront.net'
    const s3Path = presignedUrl.split('.com')[1].split('?')[0] // 쿼리 제거
    thumbnail.value = cloudFrontDomain + s3Path

    console.log('CloudFront URL:', thumbnail.value)

  } catch (error) {
    console.error('이미지 업로드 과정에서 오류 발생:', error)
    alert('이미지 업로드 중 오류가 발생했습니다.')
  }
}


// --- 문자열 → Enum 변환 함수 ---
const mapToEnum = (type) => {
  switch(type) {
    case 'TEXT': return 'TEXT'
    case 'NUMBER': return 'NUMBER'
    case 'DATE': return 'DATE'
    case 'TIME': return 'TIME'
    case 'RADIO': return 'RADIO'
    case 'CHECKBOX': return 'CHECKBOX'
    case 'BOOLEAN': return 'BOOLEAN'
    default: return 'TEXT'
  }
}

// --- 생성 API 호출 ---
const createServiceGroup = async () => {
  try {
    const formData = {
      name: name.value,
      description: description.value,
      thumbnail: thumbnail.value,
      category: selectedCategory.value,
      isAlwaysAvailable: isAlwaysAvailable.value,
      customFields: [
        ...serviceCustomFields.value.map(f => ({
          fieldName: f.fieldName,                // name → fieldName
          description: f.description || '', // description 그대로
          dataType: mapToEnum(f.dataType),      // 문자열 → Enum
          targetType: 'RESOURCE',
          required: f.required || false
        })),
        ...userCustomFields.value.map(f => ({
          fieldName: f.fieldName,
          description: f.description || '',
          dataType: mapToEnum(f.dataType),
          targetType: 'USER',
          required: f.required || false,
          options: f.options
        }))
      ]
    }

    console.log('보내는 데이터:', formData)

    const response = await serviceApi.createServiceGroup(formData)
    console.log('✅ 서비스 그룹 생성 성공:', response.data)
    alert('서비스 그룹이 성공적으로 생성되었습니다!')
    router.push({ name: 'ServiceGroupManagement' })
  } catch (error) {
    console.error('❌ 서비스 그룹 생성 실패:', error)
    alert('서비스 그룹 생성 중 오류가 발생했습니다.')
  }
}
</script>
<template>
  <AdminLayout>
    <!-- 페이지 헤더 -->
    <div class="components-page-title">
      <span>서비스 그룹 생성</span>
    </div>

    <!-- 서비스 그룹 정보 입력 폼 -->
    <!-- 서비스 그룹 이미지 -->
    <section>
      <div class="form-label-container">
        <div>커버 이미지</div>
        <p>고객들이 어떤 서비스 그룹인지 쉽게 알 수 있도록 알맞은 이미지를 업로드 해주세요.</p>
      </div>
      <div id="service-group-image-upload">
        <label for="file-upload" class="file-upload-label">
          <template v-if="thumbnail">
            <img :src="thumbnail" class="service-group-thumbnail" alt="미리보기" />
          </template>
          <template v-else>
            이미지 업로드
          </template>
        </label>
        <input id="file-upload" type="file" class="file-upload-input"  @change="onFileChange"/>
      </div>
    </section>

    <!-- 서비스 그룹 이름 -->
    <section>
      <div class="form-label-container">
        <div>서비스 그룹 이름 <span>*</span></div>
        <p>어떤 종류의 서비스인가요? ( ex. 회의실 예약, 사내 동아리 모집 등등 )</p>
      </div>
      <Input v-model="name" class="text-input" type="text" placeholder="서비스 이름을 작성해주세요." />
    </section>

    <!-- 서비스 그룹 설명 -->
    <section>
      <div class="form-label-container">
        <div>서비스 그룹 설명 <span>*</span></div>
      </div>
      <textarea v-model="description" placeholder="서비스 그룹 설명을 작성해주세요."></textarea>
    </section>

    <!-- 상시 모집 여부 확인 -->
    <section>
      <div class="form-label-container">
        <div>상시모집인가요? <span>*</span></div>
        <p>
          상시모집일 경우 서비스를 생성함과 동시에 예약/신청을 받게 됩니다. 상시모집이 아닐 경우
          서비스의 시작 날짜와 종료 날짜를 설정할 수 있습니다.
        </p>
      </div>
      <div class="radio-button-container">
        <Input v-model="isAlwaysAvailable" class="radio-style" type="radio" label="예" :value="true" />
<Input v-model="isAlwaysAvailable" class="radio-style" type="radio" label="아니오" :value="false" />
      </div>
    </section>

    <!-- 카테고리 -->
    <section>
      <div class="form-label-container">
        <div>카테고리 <span>*</span></div>
        <p>
          서비스 그룹의 예약/신청 유형에 맞는 카테고리를 선택해 주세요.
          <div class="resource-create-question-container">
            <img class="question-icon" src="/public/assets/icons/ic-question.png" alt="추가안내" />
            <div class="category-description-box">
              각 카테고리 별로 아래의 필수 입력 항목이 자동으로 생성됩니다. <br/><br/>

              - RESERVATION(예약형) - 서비스 이용 기간, 이용 시간, 인원수 <br/>
              - SEAT(좌석형) - 서비스 이용 기간, 이용 시간, 인원수, 좌석 구조(행, 열) <br/>
              - EVENT(신청형) - 서비스 이용 기간, 인원수 <br/>
            </div>
          </div>
        </p>
      </div>
      <Dropdown         v-model="selectedCategory"
 class="dropdown-style" :options="category" placeholder="카테고리를 선택해주세요." width="w-48" />
    </section>

    <!-- 서비스 입력 항목 -->
    <section>
      <div class="form-label-container">
        <div>서비스 입력 항목</div>
        <p>
          예약/신청 서비스 생성 시 기재해야 할 항목이 있다면 추가해주세요. ( 서비스 생성 후 수정 및
          추가 가능합니다. )
        </p>
      </div>
      <div class="service-custom-field-container">
        <CustomFieldAdd :customFields="serviceCustomFields" @add-field="serviceCustomFields.push($event)" />
      </div>
    </section>

    <!-- 고객 입력 항목 -->
    <section>
      <div class="form-label-container">
        <div>고객 입력 항목</div>
        <p>
          예약/신청 고객에게 받아야 정보가 있다면 추가해주세요. ( 서비스 생성 후 수정 및 추가
          가능합니다. )
        </p>
      </div>
      <div class="service-custom-field-container">
        <CustomFieldAdd :customFields="userCustomFields" @add-field="userCustomFields.push($event)" />
      </div>
    </section>

    <!-- 버튼 컨테이너 -->
    <div class="button-container">
      <Button theme="gray">초기화</button>
      <Button @click="createServiceGroup">생성하기</Button>
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

.service-group-thumbnail {
  @apply max-w-full max-h-full;
}

.file-upload-input {
  @apply hidden;
}

.file-upload-label {
  @apply flex w-full h-full flex items-center justify-center cursor-pointer text-[15px] text-gray-dark;
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
  @apply text-[14px] 
}

.button-container {
  @apply mt-[50px] flex gap-2;
}

.button-container button {
  @apply text-[14px] px-[22px]
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
