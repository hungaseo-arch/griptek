<script setup lang="ts">
/** A4 문서 페이지 래퍼 — React 원본 s.page 스타일(794×1123, 그림자, 패딩) 이관. */
import { watchEffect } from 'vue';

const props = defineProps<{ title?: string }>();

// PDF 저장 기본 파일명 = document.title → 문서 명칭(예: 'Quotation - QT-20260626-ASC-1')과 동일하게.
watchEffect(() => { if (props.title) document.title = props.title; });
</script>

<template>
  <div
    :title="title"
    class="doc-page w-198.5 mx-auto bg-white box-border min-h-280.75 px-8.5 py-7.5
           text-[#1a1a1a] shadow-[0_4px_24px_rgba(0,0,0,0.14)]"
  >
    <slot />
  </div>
</template>
