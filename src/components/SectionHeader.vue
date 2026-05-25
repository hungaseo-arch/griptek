<script setup lang="ts">
/** 파란색 섹션 헤더 바 — React 원본 s.secHdr (div 형태) 이관. */
withDefaults(defineProps<{ align?: 'left' | 'center' }>(), { align: 'center' });
</script>

<template>
  <div
    class="bg-midblue text-white font-bold text-[10px] px-2.5 py-1.25"
    :class="align === 'left' ? 'text-left' : 'text-center'"
  >
    <slot />
  </div>
</template>
