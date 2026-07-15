<script setup lang="ts">
// 등록 고객 선택 드롭다운 → pick 이벤트로 고객 전달(부모가 필드 매핑). 화면 전용.
import { ref } from 'vue';
import type { Customer } from '@/lib/customersApi';

const props = defineProps<{ customers: Customer[] }>();
const emit = defineEmits<{ pick: [Customer] }>();

const sel = ref('');
function onChange(): void {
  const c = props.customers.find((x) => x.id === sel.value);
  if (c) emit('pick', c);
}
</script>

<template>
  <div v-if="customers.length" class="no-print mb-1.5 mt-1 text-[11px] flex items-center gap-2">
    <span class="text-[#888]">등록 고객 선택:</span>
    <select v-model="sel" @change="onChange"
            class="border border-gray-300 rounded px-2 py-1 text-[11px] cursor-pointer outline-none focus:border-midblue">
      <option value="">— 직접 입력 —</option>
      <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
    </select>
  </div>
</template>
