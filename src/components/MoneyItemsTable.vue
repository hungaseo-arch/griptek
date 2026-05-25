<script setup lang="ts">
import FieldInput from '@/components/ui/FieldInput.vue';
import { lineNetUnit, lineNet, fmtOrDash, type MoneyItem } from '@/utils/calc';

defineProps<{
  items: MoneyItem[];
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
}>();

const TH = 'bg-navy text-white px-[4px] py-[6px] text-center font-bold '
  + 'border border-[#3a5a8a] text-[9px] whitespace-nowrap';
const TD = 'border border-[#ddd] px-[5px] py-[5px] text-[10px] align-top';
</script>

<template>
  <table class="w-full border-collapse table-fixed mb-0.5 text-[10px]">
    <colgroup>
      <!-- Left 50%: No. + Item + Brand + Item Description -->
      <col style="width:3.5%" />
      <col style="width:4.5%" />
      <col style="width:5%" />
      <col style="width:37%" />
      <!-- Right 50%: Qty + Unit + Unit Price + Disc + Net Price + Amount + Margin + Delete -->
      <col style="width:4.5%" />
      <col style="width:4.5%" />
      <col style="width:9%" />
      <col style="width:6%" />
      <col style="width:8%" />
      <col style="width:8%" />
      <col class="no-print" style="width:5.5%" />
      <col class="no-print" style="width:4.5%" />
    </colgroup>
    <thead>
      <tr>
        <th :class="TH">No.</th>
        <th :class="TH">Item</th>
        <th :class="TH">Brand</th>
        <th :class="TH">Item Description</th>
        <th :class="TH">Qty</th>
        <th :class="TH">Unit</th>
        <th :class="TH">Unit Price</th>
        <th :class="TH">Disc</th>
        <th :class="TH">Net Price</th>
        <th :class="TH">Amount</th>
        <th :class="TH" class="no-print">Margin</th>
        <th class="no-print bg-navy border border-[#3a5a8a]" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(it, i) in items" :key="i" :class="i % 2 === 1 ? 'bg-paleblue' : 'bg-white'">
        <td :class="TD" class="text-center text-[#aaa]">{{ i + 1 }}</td>
        <td :class="TD"><FieldInput v-model="it.itemType" /></td>
        <td :class="TD"><FieldInput v-model="it.brand" /></td>
        <td :class="TD"><FieldInput v-model="it.desc" placeholder="Input keyword, select product…" /></td>
        <td :class="TD"><FieldInput v-model="it.qty" align="center" /></td>
        <td :class="TD"><FieldInput v-model="it.unit" align="center" /></td>
        <td :class="TD"><FieldInput v-model="it.unitPrice" align="right" format-number /></td>
        <td :class="TD">
          <div class="flex items-center gap-0.5">
            <FieldInput v-model="it.discPct" align="center" max="100" auto-size />
            <span class="text-[#888] shrink-0">%</span>
          </div>
        </td>
        <td :class="TD" class="text-right text-navy">{{ fmtOrDash(lineNetUnit(it)) }}</td>
        <td :class="TD" class="text-right font-medium text-navy">{{ fmtOrDash(lineNet(it)) }}</td>
        <td :class="TD" class="no-print">
          <textarea
            v-model="it.margin"
            rows="1"
            class="field-input w-full resize-none outline-none text-[10px] leading-snug"
          />
        </td>
        <td class="no-print border border-[#ddd] text-center align-middle"
            :class="i % 2 === 1 ? 'bg-paleblue' : 'bg-white'">
          <button
            type="button"
            class="text-[#bbb] hover:text-red-500 transition-colors leading-none px-1 cursor-pointer"
            title="행 삭제"
            @click="onRemoveRow(i)"
          >×</button>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="no-print mb-0.5">
    <button
      type="button"
      class="text-[11px] text-midblue font-semibold border border-midblue rounded px-3 py-1
             hover:bg-midblue hover:text-white transition-colors cursor-pointer"
      @click="onAddRow"
    >+ Add Line</button>
  </div>
</template>
