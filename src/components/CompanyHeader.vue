<script setup lang="ts">
/** 문서 헤더 좌측 — 회사 정보 블록 (네이비). React 원본 CoLeft 이관. */
import { CO } from '@/data/company';
</script>

<template>
  <td class="w-[50%] bg-navy align-top rounded-tl-md px-4.5 py-3.5">
    <div class="flex items-center justify-between gap-3">
      <img src="/logo-griptec.png" alt="Graiptek logo" class="company-logo h-25 w-auto object-contain shrink-0" />
      <div>
        <div class="text-white text-[18px] font-bold tracking-[1px]">{{ CO.name }}</div>
        <div class="text-lightblue text-[9px] mt-1.25 leading-[1.8]">
          {{ CO.a1 }}<br />{{ CO.a2 }}<br />{{ CO.a3 }}<br />
          Tel: {{ CO.phone }}&nbsp;|&nbsp;{{ CO.email }}
        </div>
      </div>
    </div>
  </td>
</template>
