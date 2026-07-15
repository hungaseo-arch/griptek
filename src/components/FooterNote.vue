<script setup lang="ts">
/** 문서 하단 안내 문구 — React 원본 FooterNote 이관. */
defineProps<{ note: string }>();
</script>

<template>
  <div
    class="doc-footer bg-graybg px-3 py-1.75 text-[8.5px] text-[#666] italic
           border-t-2 border-gold leading-[1.7]"
  >
    {{ note }}
  </div>
</template>
