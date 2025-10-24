<script setup>
import { ref, watch } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import TimeSlotModal from '@/components/TimeSlotModal.vue'
import { useRoute, useRouter } from 'vue-router'
import serviceApi from '@/services/admin/service_api'
import ExceptionModal from '@/components/ExceptionModal.vue'

const route = useRoute()
const router = useRouter()
const serviceGroupId = route.params.serviceGroupId
const serviceGroupName = decodeURIComponent(route.query.serviceGroupName || '')

const thumbnail = ref('')

const category = ref([
  { label: '예약형', value: 'RESERVATION' },
  { label: '좌석형', value: 'SEAT' },
  { label: '신청형', value: 'EVENT' },
])

// 커스텀 필드 데이터 더미
const customFields = ref([
  {
    fieldName: '최대 인원',
    description: '예약 가능한 최대 인원 수를 입력해주세요.',
    dataType: 'NUMBER',
  },
  { fieldName: '서비스 이름', description: '서비스의 이름을 입력해주세요.', dataType: 'TEXT' },
  { fieldName: '시작일', description: '서비스가 시작되는 날짜를 선택해주세요.', dataType: 'DATE' },
  { fieldName: '운영 시간', description: '서비스 운영 시간을 입력해주세요.', dataType: 'TIME' },
  {
    fieldName: '예약 유형',
    description: '예약형, 좌석형 중 하나를 선택해주세요.',
    dataType: 'RADIO',
    options: ['예약형', '좌석형'],
  },
  {
    fieldName: '추가 옵션',
    description: '선택 가능한 추가 옵션을 모두 선택해주세요.',
    dataType: 'CHECKBOX',
    options: ['옵션1', '옵션2'],
  },
  {
    fieldName: '온라인 결제 가능',
    description: '서비스에 온라인 결제를 허용할지 여부를 선택해주세요.',
    dataType: 'BOOLEAN',
  },
])

const name = ref('')
const description = ref('')
const capacity = ref(null)
const startDate = ref('')
const endDate = ref('')
const startTime = ref('')
const endTime = ref('')
const timeInterval = ref(60)
const row = ref(null)
const col = ref(null)
const exceptions = ref([]) // 예외 일정 배열

// 두 모달을 ref로 연결
const timeSlotRef = ref(null)
const exceptionRef = ref(null)

watch(timeInterval, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    // 값이 바뀌면 바로 초기화
    timeSlotRef.value?.resetAll?.()
    exceptionRef.value?.resetAll?.()
    exceptions.value = []
  }
})

// 생성 요청
const createService = async () => {
  try {
    const formData = {
      name: name.value,
      description: description.value,
      resourceGroupId: Number(serviceGroupId),
      startDate: startDate.value || null,
      endDate: endDate.value || null,
      startTime: startTime.value || null,
      endTime: endTime.value || null,
      timeInterval: timeInterval.value,
      capacity: capacity.value ? Number(capacity.value) : null,
      row: row.value ? Number(row.value) : null,
      col: col.value ? Number(col.value) : null,
    }

    const response = await serviceApi.createService(formData)
    alert('서비스가 성공적으로 생성되었습니다!')
    console.log('✅ 등록 완료:', response.data)
    router.push(`/admin/service-management/${serviceGroupId}?serviceGroupName=${serviceGroupName}`)
  } catch (error) {
    console.error('❌ 서비스 생성 실패:', error)
    alert('서비스 생성 중 오류가 발생했습니다.')
  }
}

// 브레드크럼 항목
const breadcrumbItems = [{ label: 'Service Groups', path: '#!' }, { label: serviceGroupName }]

// 입력값 초기화
const resetValues = () => {
  name.value = ''
  description.value = ''
  capacity.value = null
  startDate.value = ''
  endDate.value = ''
  startTime.value = ''
  endTime.value = ref('')
  timeInterval.value = ref(60)
  row.value = null
  col.value = null
}

// ---서비스 이미지 업로드---
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
</script>

<template>
  <AdminLayout>
    <!-- 페이지 헤더 -->
    <div class="components-page-title">
      <div class="head">
        <Breadcrumb :items="breadcrumbItems" />
        <span>서비스 생성</span>
      </div>
    </div>

    <!-- 서비스 정보 입력 폼 -->
    <!-- 서비스 이미지 -->
    <section>
      <div class="form-label-container">
        <div>커버 이미지</div>
        <p>고객들이 어떤 서비스인지 쉽게 알 수 있도록 알맞은 이미지를 업로드 해주세요.</p>
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

    <!-- 서비스 이름 -->
    <section>
      <div class="form-label-container">
        <div>서비스 이름 <span>*</span></div>
        <p>어떤 서비스인가요? ( ex. 회의실 A, 클라이밍 동아리 등등 )</p>
      </div>
      <Input
        class="text-input"
        v-model="name"
        type="text"
        placeholder="서비스 이름을 작성해주세요."
      />
    </section>

    <!-- 서비스 설명 -->
    <section>
      <div class="form-label-container">
        <div>서비스 설명 <span>*</span></div>
      </div>
      <textarea placeholder="서비스 설명을 작성해주세요."></textarea>
    </section>

    <!-- 수용 인원 -->
    <section>
      <div class="form-label-container">
        <div>수용 인원 <span>*</span></div>
        <p>해당 서비스의 최대 수용 인원 수를 알려주세요.</p>
      </div>
      <Input
        class="text-input"
        v-model="capacity"
        type="number"
        placeholder="숫자로만 작성해주세요."
      />
    </section>

    <!-- 행 -->
    <section>
      <div class="form-label-container">
        <div>행 <span>*</span></div>
        <p>좌석의 행 수를 입력해주세요.</p>
      </div>
      <Input class="text-input" v-model="row" type="number" placeholder="숫자로만 작성해주세요." />
    </section>

    <!-- 열 -->
    <section>
      <div class="form-label-container">
        <div>열 <span>*</span></div>
        <p>좌석의 열 수를 입력해주세요.</p>
      </div>
      <Input class="text-input" v-model="col" type="number" placeholder="숫자로만 작성해주세요." />
    </section>

    <!-- 서비스 정보 -->
    <section class="mt-[40px]">
      <div class="form-label-container">
        <div>서비스 정보 <span>*</span></div>
      </div>

      <!-- 예약/신청 기간 -->
      <div class="service-info-section">
        <div class="service-info-form-item-label-container !mt-[5px]">
          <span>예약/신청 기간</span>
          <p>해당 서비스의 예약/신청이 가능한 기간을 입력해 주세요.</p>
        </div>

        <div class="service-info-form-inputs">
          <Input class="text-input" v-model="startDate" type="date" placeholder="시작 날짜" />
          <span>~</span>
          <Input class="text-input" v-model="endDate" type="date" placeholder="종료 날짜" />
        </div>
      </div>

      <!-- 시간 간격 선택 -->
      <div class="service-info-section">
        <div class="service-info-form-item-label-container">
          <span>시간 간격 선택</span>
        </div>

        <div class="service-info-form-radio">
          <Input
            type="radio"
            label="1시간"
            :value="60"
            name="timeInterval"
            v-model="timeInterval"
            class="text-input"
          />
          <Input
            type="radio"
            label="30분"
            :value="30"
            name="timeInterval"
            v-model="timeInterval"
            class="text-input"
          />
        </div>
      </div>

      <!-- 서비스 이용 시간  -->
      <div class="service-info-section">
        <div class="service-info-form-item-label-container">
          <span>정기 이용 시간 (매주 반복)</span>
          <p>
            매주 반복되는 기본 운영 시간을 등록하세요. 휴게 시간을 포함한 전체 시간을 입력하신 뒤
            휴게 시간을 제거하시면 됩니다.
          </p>
        </div>

        <div class="service-info-form-inputs">
          <TimeSlotModal ref="timeSlotRef" :interval="timeInterval" />
        </div>
      </div>

      <!-- 제외 시간  -->
      <div class="service-info-section mt-[40px]">
        <div class="service-info-form-item-label-container">
          <span>예외 일정</span>
          <p>특정 날짜에만 적용되는 일정이 있거나 휴무나 점검 시간 등을 입력해 주세요.</p>
        </div>

        <div class="service-info-form-inputs">
          <ExceptionModal
            ref="exceptionRef"
            :interval="timeInterval"
            v-model:modelValue="exceptions"
          />
        </div>
      </div>

      <!-- 커스텀 필드 -->
      <div class="service-info-section mt-[40px]">
        <div v-for="(field, index) in customFields" :key="index" class="mb-[20px]">
          <div class="service-info-form-item-label-container">
            <span>{{ field.fieldName }}</span>
            <p>{{ field.description }}</p>
          </div>
          <div class="service-info-form-inputs">
            <!-- NUMBER -->
            <Input
              v-if="field.dataType === 'NUMBER'"
              type="number"
              class="text-input"
              placeholder="숫자를 입력해주세요"
            />

            <!-- TEXT -->
            <Input
              v-else-if="field.dataType === 'TEXT'"
              type="text"
              class="text-input"
              placeholder="문자를 입력해주세요"
            />

            <!-- DATE -->
            <Input v-else-if="field.dataType === 'DATE'" type="date" class="text-input" />

            <!-- TIME -->
            <Input v-else-if="field.dataType === 'TIME'" type="time" class="text-input" />

            <!-- RADIO -->
            <div v-else-if="field.dataType === 'RADIO'" class="option-list">
              <label v-for="(option, idx) in field.options" :key="idx">
                <Input type="radio" :name="`radio-${index}`" :value="option" :label="`${option}`" class="text-input"/>
              </label>
            </div>

            <!-- CHECKBOX -->
            <div v-else-if="field.dataType === 'CHECKBOX'" class="option-list">
              <label v-for="(option, idx) in field.options" :key="idx">
                <Input type="checkbox" :value="option" :label="`${option}`" class="text-input"/>
              </label>
            </div>

            <!-- BOOLEAN -->
            <label v-else-if="field.dataType === 'BOOLEAN'"> <Input type="checkbox" label="허용" class="text-input"/></label>
          </div>
        </div>
      </div>
    </section>

    <!-- 버튼 컨테이너 -->
    <div class="button-container">
      <Button theme="gray" @click="resetValues">초기화</Button>
      <Button @click="createService">생성하기</Button>
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

.service-info-form-item-label-container {
  @apply flex gap-3 items-center mt-[20px] mb-[6px];
}

.service-info-form-item-label-container span {
  @apply text-[14px];
}

.service-info-form-item-label-container p {
  @apply text-[12px] text-[#929292];
}

.service-info-form-inputs {
  @apply flex gap-2 items-center max-w-[400px];
}

.service-info-section {
  @apply ml-[4px];
}

.service-info-form-radio {
  @apply flex flex-col gap-3 pt-[8px] pb-[15px];
}

.exception-modal-open-button {
  @apply bg-blue-600 text-white w-[40px] h-[40px] rounded text-[30px] items-center flex justify-center;
}

.option-list {
  @apply flex flex-col gap-2
}
</style>
