<script setup lang="ts">
/** 약관 목록 — React 원본 Proforma Invoice 의 Terms & Conditions 표 이관. */
defineProps<{ items: string[] }>();
</script>

<template>
  <table class="w-full border-collapse mb-3.5">
    <tbody>
      <tr v-for="(t, i) in items" :key="i" :class="i % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-white'">
        <td class="px-2 py-1 text-[9px] italic text-[#444] ">{{ t }}</td>
      </tr>
    </tbody>
  </table>
</template>
