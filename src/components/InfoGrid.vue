<script setup lang="ts">
/** 라벨/값 2열 그리드 — React 원본 InfoGrid 이관 + 값 입력 가능 개선. */
import FieldInput from '@/components/ui/FieldInput.vue';

export interface InfoRow {
  leftLabel: string;
  leftKey: string;
  rightLabel: string;
  rightKey: string;
}

defineProps<{
  rows: InfoRow[];
  /** 모든 키의 값을 담는 reactive 레코드 */
  model: Record<string, string>;
}>();
</script>

<template>
  <table class="w-full border-collapse mb-3.5">
    <tbody>
      <tr v-for="(r, i) in rows" :key="i" :class="i % 2 === 0 ? 'bg-white' : 'bg-rowalt'">
        <td class="bg-graybg text-navy font-bold text-[9px] px-2 py-1 whitespace-nowrap
                   border border-[#ddd] align-top text-left w-[15%]">
          {{ r.leftLabel }} :
        </td>
        <td class="border border-[#ddd] px-2 py-1 text-[10px] align-top text-left w-[33%]">
          <FieldInput v-model="model[r.leftKey]" />
        </td>
        <td class="w-[4%]" />
        <td class="bg-graybg text-navy font-bold text-[9px] px-2 py-1 whitespace-nowrap
                   border border-[#ddd] align-top text-left w-[15%]">
          {{ r.rightLabel }} :
        </td>
        <td class="border border-[#ddd] px-2 py-1 text-[10px] align-top text-left w-[33%]">
          <FieldInput v-model="model[r.rightKey]" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
