<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import TimeSlotModal from '@/components/TimeSlotModal.vue'
import ExceptionModal from '@/components/ExceptionModal.vue'
import { useRoute, useRouter } from 'vue-router'
import serviceApi from '@/services/admin/service_api'

const route = useRoute()
const router = useRouter()
const serviceGroupId = route.params.serviceGroupId
const serviceGroup = ref(null)

const thumbnail = ref('')
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
const exceptions = ref([])
const customFieldDefinitions = ref([])
const customFieldValues = ref([])

// 모달 ref
const timeSlotRef = ref(null)
const exceptionRef = ref(null)

watch(timeInterval, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    timeSlotRef.value?.resetAll?.()
    exceptionRef.value?.resetAll?.()
    exceptions.value = []
  }
})

// 서비스 그룹 정보 조회
const getServiceGroup = async () => {
  serviceGroup.value = await serviceApi.getServiceGroupFieldInfo(serviceGroupId)
  customFieldDefinitions.value = await serviceApi.getServiceCustomFields(serviceGroupId)
  customFieldValues.value = customFieldDefinitions.value.map((field) => ({
    customFieldId: field.id,
    values: [''],
  }))
}

// 서비스 생성
const createService = async () => {
  try {
    const timeSlots = timeSlotRef.value?.getTimeSlots?.() || []
    const exceptionSlots = exceptionRef.value?.getExceptionSlots?.() || []

    const formatDate = (dateStr) => {
      if (!dateStr) return null
      const date = new Date(dateStr)
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
    }

    const formattedCustomFields = customFieldValues.value.map((field) => ({
      customFieldId: field.customFieldId,
      values: field.values,
    }))

    const formData = {
      name: name.value,
      description: description.value,
      resourceGroupId: Number(serviceGroupId),
      resourceImage: thumbnail.value || null,
      startDate: formatDate(startDate.value),
      endDate: formatDate(endDate.value),
      startTime: startTime.value || null,
      endTime: endTime.value || null,
      timeInterval: timeInterval.value,
      capacity: capacity.value ? Number(capacity.value) : null,
      row: row.value ? Number(row.value) : null,
      col: col.value ? Number(col.value) : null,
      customFieldValues: formattedCustomFields,
      timeSlots,
      exceptionSlots,
    }

    console.log('📦 요청 데이터:', formData)

    const response = await serviceApi.createService(formData)
    alert('서비스가 성공적으로 생성되었습니다!')
    router.push(
      `/admin/service-management/${serviceGroupId}?serviceGroupName=${serviceGroup.value?.name}`,
    )
  } catch (error) {
    console.error('❌ 서비스 생성 실패:', error)
    alert('서비스 생성 중 오류가 발생했습니다.')
  }
}

const breadcrumbItems = computed(() => [
  { label: 'Service Groups', path: '#!' },
  { label: serviceGroup.value?.name || '', path: '#!' },
])

const resetValues = () => {
  name.value = ''
  description.value = ''
  capacity.value = null
  startDate.value = ''
  endDate.value = ''
  startTime.value = ''
  endTime.value = ''
  timeInterval.value = 60
  row.value = null
  col.value = null
}

const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('imageType', 'serviceGroup')

    const presignedUrl = await serviceApi.getServiceGroupPresignedURL(formData)
    if (!presignedUrl) throw new Error('Presigned URL을 가져오지 못했습니다.')
    await serviceApi.uploadImage(presignedUrl, file)

    const cloudFrontDomain = 'https://d2h9e9y86awp4t.cloudfront.net'
    const s3Path = presignedUrl.split('.com')[1].split('?')[0]
    thumbnail.value = cloudFrontDomain + s3Path
  } catch (error) {
    console.error('이미지 업로드 과정에서 오류 발생:', error)
    alert('이미지 업로드 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  getServiceGroup()
})
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

    <div v-if="serviceGroup">
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
            <template v-else> 이미지 업로드 </template>
          </label>
          <input id="file-upload" type="file" class="file-upload-input" @change="onFileChange" />
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
        <textarea v-model="description" placeholder="서비스 설명을 작성해주세요."></textarea>
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
      <section v-if="serviceGroup.category == 'SEAT'">
        <div class="form-label-container">
          <div>행 <span>*</span></div>
          <p>좌석의 행 수를 입력해주세요.</p>
        </div>
        <Input
          class="text-input"
          v-model="row"
          type="number"
          placeholder="숫자로만 작성해주세요."
        />
      </section>

      <!-- 열 -->
      <section v-if="serviceGroup.category == 'SEAT'">
        <div class="form-label-container">
          <div>열 <span>*</span></div>
          <p>좌석의 열 수를 입력해주세요.</p>
        </div>
        <Input
          class="text-input"
          v-model="col"
          type="number"
          placeholder="숫자로만 작성해주세요."
        />
      </section>

      <!-- 서비스 정보 -->
      <section class="mt-[40px]">
        <div class="form-label-container">
          <div>서비스 정보 <span>*</span></div>
        </div>

        <!-- 예약/신청 기간 -->
        <div v-if="!serviceGroup.isAlwaysAvailable" class="service-info-section">
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
        <div v-if="serviceGroup.category != 'EVENT'" class="service-info-section">
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
        <div v-if="serviceGroup.category != 'EVENT'" class="service-info-section">
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
        <div v-if="serviceGroup.category != 'EVENT'" class="service-info-section mt-[40px]">
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
        <!-- 커스텀 필드 -->
        <div v-if="customFieldDefinitions.length" class="service-info-section mt-[40px]">
          <div v-for="(field, index) in customFieldDefinitions" :key="field.id" class="mb-[20px]">
            <div class="service-info-form-item-label-container">
              <span>{{ field.fieldName }}</span>
              <span v-if="field.required" class="required">*</span>
              <p>{{ field.description }}</p>
            </div>

            <div class="service-info-form-inputs">
              <!-- TEXT -->
              <Input
                v-if="field.dataType === 'TEXT'"
                type="text"
                class="text-input"
                placeholder="문자를 입력해주세요"
                v-model="customFieldValues[index].values[0]"
              />

              <!-- NUMBER -->
              <Input
                v-else-if="field.dataType === 'NUMBER'"
                type="number"
                class="text-input"
                placeholder="숫자를 입력해주세요"
                v-model="customFieldValues[index].values[0]"
              />

              <!-- DATE -->
              <Input
                v-else-if="field.dataType === 'DATE'"
                type="date"
                class="text-input"
                v-model="customFieldValues[index].values[0]"
              />

              <!-- TIME -->
              <Input
                v-else-if="field.dataType === 'TIME'"
                type="time"
                class="text-input"
                v-model="customFieldValues[index].values[0]"
              />

              <!-- BOOLEAN -->
              <label v-else-if="field.dataType === 'BOOLEAN'">
                <Input
                  type="checkbox"
                  label="허용"
                  v-model="customFieldValues[index].values[0]"
                  true-value="true"
                  false-value="false"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- 버튼 컨테이너 -->
      <div class="button-container">
        <Button theme="gray" @click="resetValues">초기화</Button>
        <Button @click="createService">생성하기</Button>
      </div>
    </div>
    <div v-else>loading...</div>
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

.form-label-container span,
.required {
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
  @apply flex flex-col gap-2;
}
</style>
