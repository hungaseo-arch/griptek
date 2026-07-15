<script setup lang="ts">
/** 문서 헤더 우측 — 제목 + 편집 가능한 메타 행. React 원본 DocTitle 이관 + 입력 개선. */
import FieldInput from '@/components/ui/FieldInput.vue';

defineProps<{
  title: string;
  /** 메타 행 정의 (라벨 + model 키) */
  fields: { label: string; key: string }[];
  /** 메타 값 reactive 레코드 */
  model: Record<string, string>;
}>();

// 날짜 키('date'/…Date/validUntil)는 달력 입력으로.
function fieldType(key: string): 'text' | 'date' {
  const k = key.toLowerCase();
  return k === 'date' || k.endsWith('date') || k === 'validuntil' ? 'date' : 'text';
}
</script>

<template>
  <td class="w-[46%] bg-midblue align-top rounded-tr-md">
    <div class="doc-title text-center text-white text-[20px] font-bold tracking-[3px] px-2.5 pt-3 pb-2">
      {{ title }}
    </div>
    <table class="w-full border-collapse">
      <tbody>
        <tr v-for="f in fields" :key="f.key">
          <td class="bg-graybg text-navy font-bold text-[9px] px-2.5 py-1 border border-[#ddd] w-[50%]">
            {{ f.label }}
          </td>
          <td class="bg-white text-[9px] px-2 py-1 border border-[#ddd]">
            <FieldInput v-model="model[f.key]" :type="fieldType(f.key)" />
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</template>
