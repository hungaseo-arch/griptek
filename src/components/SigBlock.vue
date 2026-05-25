<script setup lang="ts">
/** 서명 / 승인 블록 (3열) — React 원본 SigBlock 이관. */
withDefaults(defineProps<{
  labels: [string, string, string];
  sub1?: string;
  sub2?: string;
}>(), { sub1: '', sub2: '' });

const rows = [0, 1, 2, 3];
</script>

<template>
  <div class="sig-block">
  <div class="bg-navy text-white font-bold text-[10px] px-2.5 py-1.25 text-left">
    AUTHORIZATION &amp; ACKNOWLEDGEMENT
  </div>
  <table class="w-full border-collapse mb-3">
    <tbody>
      <tr v-for="di in rows" :key="di" :style="{ height: di === 1 ? '60px' : '18px' }">
        <td
          v-for="(lbl, ci) in labels"
          :key="ci"
          class="border border-[#ddd] px-2.5 py-0.75 text-center"
          :class="[
            di === 0 ? 'bg-lightblue font-bold text-[10px] text-navy'
              : di === 3 ? 'bg-graybg text-[9px] italic text-[#888]'
              : 'bg-white text-[9px]',
            di === 2 && ci === 1 ? 'text-navy' : '',
          ]"
        >
          {{
            di === 0 ? lbl
            : di === 2 && ci === 1 ? sub1
            : di === 3 ? 'Name, Date & Signature'
            : ''
          }}
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>
