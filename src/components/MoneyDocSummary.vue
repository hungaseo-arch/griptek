<script setup lang="ts">
import { ref, computed } from 'vue';
import FieldInput from '@/components/ui/FieldInput.vue';
import { fmtOrDash, num } from '@/utils/calc';

const props = defineProps<{ sumAmount: number }>();

const addDiscPct = ref('');
const PPN = 0.11;

const addDiscAmt  = computed(() => props.sumAmount * num(addDiscPct.value) / 100);
const afterDisc   = computed(() => props.sumAmount - addDiscAmt.value);
const ppnAmt      = computed(() => afterDisc.value * PPN);
const beforeTrunc = computed(() => afterDisc.value + ppnAmt.value);
const truncAmt    = computed(() => beforeTrunc.value % 1000);
const total       = computed(() => beforeTrunc.value - truncAmt.value);

const LBL = 'bg-graybg text-navy font-semibold text-[10px] px-2.5 py-1 text-right whitespace-nowrap';
const VAL = 'bg-white text-[10px] px-2 py-1 text-right';
const RATE = 'bg-white text-[10px] px-1.5 py-1 text-center';
</script>

<template>
  <table class="money-summary w-[48%] ml-auto border-collapse mb-3.5 text-[10px]">
    <colgroup>
      <col style="width:47%" />
      <col style="width:20%" />
      <col style="width:33%" />
    </colgroup>
    <tbody>
      <!-- Additional Discount -->
      <tr>
        <td :class="LBL">Discount</td>
        <td :class="RATE">
          <div class="flex items-center justify-center">
            <FieldInput v-model="addDiscPct" align="center" auto-size />
            <span class="text-[#888] shrink-0">%</span>

          </div>
        </td>
        <td :class="VAL">{{ addDiscAmt > 0 ? `- ${fmtOrDash(addDiscAmt)}` : '–' }}</td>
      </tr>
      <!-- PPN -->
      <tr>
        <td :class="LBL">PPN (Tax)</td>
        <td :class="RATE">11%</td>
        <td :class="VAL">{{ fmtOrDash(ppnAmt) }}</td>
      </tr>
      <!-- Truncation -->
      <tr>
        <td :class="LBL">Truncation (1,000 ↓)</td>
        <td :class="RATE" />
        <td :class="VAL">{{ truncAmt > 0 ? `- ${fmtOrDash(truncAmt)}` : '–' }}</td>
      </tr>
      <!-- Total -->
      <tr>
        <td class=" bg-navy text-white font-bold text-[11px] px-2.5 py-1 text-right whitespace-nowrap">
          Total (incl. PPN)
        </td>
        <td class=" bg-gold" />
        <td class=" bg-gold text-navy font-bold text-[11px] px-2 py-1 text-right">
          {{ fmtOrDash(total) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
