<script setup>
import { ref } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import Dropdown from '@/components/Dropdown.vue'
import CustomFieldAdd from '@/components/CustomFieldAdd.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import DayAndTimeAdd from '@/components/DayAndTimeAdd.vue'

const category = ref([
  { label: '예약형', value: 'RESERVATION' },
  { label: '좌석형', value: 'SEAT' },
  { label: '신청형', value: 'EVENT' },
])

// 브레드크럼 항목
const breadcrumbItems = [{ label: 'Service Group', path: '#!' }, { label: '회의실 예약' }]
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
        <label for="file-upload" class="file-upload-label"> 이미지 업로드 </label>
        <input id="file-upload" type="file" class="file-upload-input" />
      </div>
      <!-- TODO: 이미지 슬라이드 컨테이너 생성 (이미지 업로드 로직 구현 후) -->
    </section>

    <!-- 서비스 이름 -->
    <section>
      <div class="form-label-container">
        <div>서비스 이름 <span>*</span></div>
        <p>어떤 서비스인가요? ( ex. 회의실 A, 클라이밍 동아리 등등 )</p>
      </div>
      <Input class="text-input" type="text" placeholder="서비스 이름을 작성해주세요." />
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
      <Input class="text-input" type="number" placeholder="숫자로만 작성해주세요." />
    </section>

    <!-- 서비스 정보 -->
    <section>
      <div class="form-label-container">
        <div>서비스 정보 <span>*</span></div>
      </div>

      <!-- 예약/신청 기간 -->
      <div class="service-info-section">
        <div class="service-info-form-item-label-container">
          <span>예약/신청 기간</span>
          <p>해당 서비스의 예약/신청이 가능한 기간을 입력해 주세요.</p>
        </div>

        <div class="service-info-form-inputs">
          <Input class="text-input" type="date" placeholder="시작 날짜" />
          <span>~</span>
          <Input class="text-input" type="date" placeholder="종료 날짜" />
        </div>
      </div>

      <!-- 시간 간격 선택 -->
       <div class="service-info-section">
        <div class="service-info-form-item-label-container">
          <span>시간 간격 선택</span>
        </div>

        <div class="service-info-form-inputs">
          <Input class="text-input" type="radio" placeholder="시작 날짜" label="1시간"/>
          <Input class="text-input" type="radio" placeholder="종료 날짜" label="30분"/>
        </div>
      </div>

      <!-- 서비스 이용 시간  -->
       <div class="service-info-section">
        <div class="service-info-form-item-label-container">
          <span>시간 간격 선택</span>
          <p>해당 서비스의 이용 가능한 시간을 입력해 주세요. 휴게 시간을 포함한 전체 시간을 입력하신 뒤 휴게 시간을 제거하시면 됩니다.</p>
        </div>

        <div class="service-info-form-inputs">
          <DayAndTimeAdd />
        </div>
      </div>
    </section>

    <!-- 버튼 컨테이너 -->
    <div class="button-container">
      <Button theme="gray">초기화</Button>
      <Button>생성하기</Button>
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
  @apply rounded-[3px] bg-[#D9D9D9] w-[300px] h-[200px] flex items-center justify-center cursor-pointer;
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
