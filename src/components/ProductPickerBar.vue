<script setup lang="ts">
// 제품 추천 로그인/상태 바 (QT/PO/PI/CI 공용). useProductPicker 와 짝.
import type { Product } from '@/lib/productsApi';
import type { Role, RolePolicy } from '@/lib/roles';

defineProps<{
  configured: boolean;
  role: Role | null;
  products: Product[];
  loading: boolean;
  error: string | null;
  policy: RolePolicy | null;
}>();
defineEmits<{ openLogin: []; logout: [] }>();
</script>

<template>
  <div v-if="configured" class="no-print mb-1.5 mt-1 text-[11px]">
    <div v-if="!role" class="flex items-center gap-2">
      <button type="button"
              class="text-midblue font-semibold border border-midblue rounded px-3 py-1
                     hover:bg-midblue hover:text-white transition-colors cursor-pointer"
              @click="$emit('openLogin')">
        🔑 제품 가격 불러오기 (로그인)
      </button>
      <span class="text-[#999]">로그인하면 'Item Description'에서 제품 추천·가격 입력이 됩니다.</span>
    </div>
    <div v-else class="flex items-center gap-2 text-[#999]">
      <span class="flex-1">
        <template v-if="loading">제품 불러오는 중…</template>
        <span v-else-if="error" class="text-red-500">⚠ {{ error }}</span>
        <template v-else>
          ✓ 제품 {{ products.length }}개 로드됨
          <b class="text-midblue">[{{ policy?.label }}]</b>
          — <b>Item Description</b>에 키워드를 입력하면 추천됩니다.
        </template>
      </span>
      <button type="button"
              class="shrink-0 text-[#888] font-semibold border border-gray-300 rounded px-2.5 py-0.5
                     hover:bg-gray-100 transition-colors cursor-pointer"
              @click="$emit('logout')">로그아웃</button>
    </div>
  </div>
</template>
