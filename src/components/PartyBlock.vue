<script setup lang="ts">
/**
 * 거래처 2열 블록 — React 원본의 Vendor/ShipTo, Exporter/Consignee,
 * Shipper/Consignee 섹션 이관 + 값 입력 가능 개선.
 */
import FieldInput from '@/components/ui/FieldInput.vue';

export interface PartyRow {
  leftLabel: string;
  leftKey: string;
  rightLabel: string;
  rightKey: string;
}

defineProps<{
  leftTitle: string;
  rightTitle: string;
  rows: PartyRow[];
  leftModel: Record<string, string>;
  rightModel: Record<string, string>;
}>();
</script>

<template>
  <table class="w-full border-collapse mb-3.5">
    <tbody>
      <tr>
        <td colspan="2"
            class="party-title bg-midblue text-white font-bold text-[10px] px-2.5 py-1.25 text-left">
          {{ leftTitle }}
        </td>
        <td class="w-[4%]" />
        <td colspan="2"
            class="party-title bg-midblue text-white font-bold text-[10px] px-2.5 py-1.25 text-left">
          {{ rightTitle }}
        </td>
      </tr>
      <tr v-for="(r, i) in rows" :key="i" :class="i % 2 === 0 ? 'bg-white' : 'bg-rowalt'">
        <td class="bg-graybg text-navy font-bold text-[9px] px-2 py-1 whitespace-nowrap
                   border border-[#ddd] align-top text-left w-[15%]">
          {{ r.leftLabel }} :
        </td>
        <td class="border border-[#ddd] px-2 py-1 text-[10px] align-top text-left w-[33%]">
          <FieldInput v-model="leftModel[r.leftKey]" />
        </td>
        <td class="w-[4%]" />
        <td class="bg-graybg text-navy font-bold text-[9px] px-2 py-1 whitespace-nowrap
                   border border-[#ddd] align-top text-left w-[15%]">
          {{ r.rightLabel }} :
        </td>
        <td class="border border-[#ddd] px-2 py-1 text-[10px] align-top text-left w-[33%]">
          <FieldInput v-model="rightModel[r.rightKey]" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
