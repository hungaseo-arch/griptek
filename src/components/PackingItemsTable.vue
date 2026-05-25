<script setup lang="ts">
import FieldInput from '@/components/ui/FieldInput.vue';
import { fmtOrDash, type PackingItem } from '@/utils/calc';

defineProps<{
  items: PackingItem[];
  totalPkgs: number;
  totalNetWt: number;
  totalGrossWt: number;
  totalCbm: number;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
}>();

const TH = 'bg-navy text-white px-[4px] py-[6px] text-center font-bold '
  + 'border border-[#3a5a8a] text-[9px] leading-tight';
const TD = 'border border-[#ddd] px-[5px] py-[5px] text-[9px] align-top';
const TF = 'border border-[#ddd] px-[5px] py-[5px] text-[10px] font-bold text-navy';
</script>

<template>
  <table class="w-full border-collapse mb-0.5 text-[9px]">
    <thead>
      <tr>
        <th :class="TH" class="w-6.5">No.</th>
        <th :class="TH">Description</th>
        <th :class="TH" class="w-13.5">Marks &amp;<br />Numbers</th>
        <th :class="TH" class="w-9.5">No. of<br />Pkgs</th>
        <th :class="TH" class="w-9.5">Pkg<br />Type</th>
        <th :class="TH" class="w-12.5">Net Wt<br />(kg)</th>
        <th :class="TH" class="w-12.5">Gross Wt<br />(kg)</th>
        <th :class="TH" class="w-16.5">L×W×H<br />(cm)</th>
        <th :class="TH" class="w-11">CBM</th>
        <th class="no-print w-6 bg-navy border border-[#3a5a8a]" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(it, i) in items" :key="i" :class="i % 2 === 1 ? 'bg-paleblue' : 'bg-white'">
        <td :class="TD" class="text-center text-[#aaa]">{{ i + 1 }}</td>
        <td :class="TD"><FieldInput v-model="it.desc" /></td>
        <td :class="TD"><FieldInput v-model="it.marks" align="center" /></td>
        <td :class="TD"><FieldInput v-model="it.pkgs" align="center" numeric /></td>
        <td :class="TD"><FieldInput v-model="it.pkgType" align="center" /></td>
        <td :class="TD"><FieldInput v-model="it.netWt" align="right" numeric /></td>
        <td :class="TD"><FieldInput v-model="it.grossWt" align="right" numeric /></td>
        <td :class="TD"><FieldInput v-model="it.dims" align="center" /></td>
        <td :class="TD"><FieldInput v-model="it.cbm" align="right" numeric /></td>
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
    <tfoot>
      <tr class="bg-lightblue">
        <td :class="TF" colspan="3">TOTAL</td>
        <td :class="TF" class="text-center">{{ fmtOrDash(totalPkgs) }}</td>
        <td :class="TF" />
        <td :class="TF" class="text-right">{{ fmtOrDash(totalNetWt) }}</td>
        <td :class="TF" class="text-right">{{ fmtOrDash(totalGrossWt) }}</td>
        <td :class="TF" />
        <td :class="TF" class="text-right">{{ fmtOrDash(totalCbm) }}</td>
        <td class="no-print bg-lightblue border border-[#ddd]" />
      </tr>
    </tfoot>
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
