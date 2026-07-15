<script setup lang="ts">
// 연락처 CTA 박스 — 홈/카테고리/제품 상세에서 공용 사용(중복 제거).
import { CO, PHONE_TEL } from '@/data/company';

withDefaults(defineProps<{
  eyebrow: string;        // 상단 라벨 (예: 'PENAWARAN HARGA')
  title: string;          // 제목 (강조어 앞부분)
  highlight: string;      // 강조어(midblue)
  suffix?: string;        // 강조어 뒤 텍스트 (예: '?')
  subtitle: string;       // 안내 문구
  showAddress?: boolean;  // 주소 표시 여부
}>(), { suffix: '', showAddress: false });
</script>

<template>
  <section class="mt-12 mb-4">
    <div class="bg-navy rounded-2xl p-8 md:p-10 grid md:grid-cols-2 gap-8">
      <div>
        <div class="text-midblue font-bold tracking-[3px] text-[12px]">{{ eyebrow }}</div>
        <h2 class="text-white font-extrabold text-[26px] mt-3 leading-tight">
          {{ title }} <span class="text-midblue">{{ highlight }}</span>{{ suffix }}
        </h2>
        <div class="h-1 w-14 bg-gold rounded mt-4"></div>
        <p class="text-[#aac4df] text-[13px] italic mt-5">{{ subtitle }}</p>
      </div>
      <div class="text-white space-y-4 self-center">
        <div>
          <div class="text-[#aac4df] text-[11px]">Telepon</div>
          <a :href="`tel:${PHONE_TEL}`" class="font-bold text-[15px] hover:text-gold">{{ CO.phone }}</a>
        </div>
        <div>
          <div class="text-[#aac4df] text-[11px]">Email</div>
          <a :href="`mailto:${CO.email}`" class="font-bold text-[15px] hover:text-gold">{{ CO.email }}</a>
        </div>
        <div v-if="showAddress">
          <div class="text-[#aac4df] text-[11px]">Alamat</div>
          <div class="text-[13px] leading-relaxed">{{ CO.a1 }}<br />{{ CO.a2 }}<br />{{ CO.a3 }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
