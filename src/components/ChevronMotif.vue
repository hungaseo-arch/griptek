<script setup lang="ts">
// 브랜드 셰브론 모티프 배경 — navy 박스 우측 상단 장식. 여러 hero 에서 공용.
withDefaults(defineProps<{ opacity?: number }>(), { opacity: 0.2 });
</script>

<template>
  <div
    class="hidden md:block absolute right-0 top-0 h-full w-1/3"
    :style="`opacity:${opacity};background:
      linear-gradient(135deg, transparent 49%, var(--color-midblue) 50%, var(--color-midblue) 60%, transparent 61%),
      linear-gradient(135deg, transparent 64%, var(--color-lightblue) 65%, var(--color-lightblue) 75%, transparent 76%);`"
  ></div>
</template>
