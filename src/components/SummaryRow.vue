<script setup lang="ts">
/**
 * 합계 표의 한 행 — React 원본 Summary 의 한 줄.
 * value(계산 결과 표시) 또는 editable(직접 입력) 모드.
 */
import FieldInput from '@/components/ui/FieldInput.vue';
import { formatMoney } from '@/utils/calc';

withDefaults(defineProps<{
  label: string;
  /** 계산 결과(표시 전용) */
  value?: number;
  /** editable=true 일 때 입력값 */
  modelValue?: string;
  /** 강조(GRAND TOTAL) 행 여부 */
  grand?: boolean;
  /** 직접 입력 가능 행 여부(SHIPPING 등) */
  editable?: boolean;
}>(), {
  value: 0,
  modelValue: '',
  grand: false,
  editable: false,
});

defineEmits<{ (e: 'update:modelValue', value: string): void }>();
</script>

<template>
  <tr>
    <td class="bg-white" />
    <td
      class="border border-[#ddd] px-2.5 py-1 text-right whitespace-nowrap w-[17%]"
      :class="grand
        ? 'bg-navy text-white font-bold text-[11px]'
        : 'bg-graybg text-navy font-semibold text-[10px]'"
    >
      {{ label }}
    </td>
    <td
      class="border border-[#ddd] px-2 py-1 text-right w-[13%] min-h-5.5"
      :class="grand ? 'bg-gold text-navy font-bold text-[11px]' : 'bg-white text-black text-[10px]'"
    >
      <FieldInput
        v-if="editable"
        :model-value="modelValue"
        align="right"
        numeric
        @update:model-value="$emit('update:modelValue', $event)"
      />
      <span v-else>{{ formatMoney(value) }}</span>
    </td>
  </tr>
</template>
