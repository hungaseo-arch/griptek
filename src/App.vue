<script setup lang="ts">
import { ref, shallowRef, computed, provide, type Component } from 'vue';
import { CO } from '@/data/company';
import { ACTIVE_DOC, CARRY_BUFFER, type DocController, type CarryBuffer } from '@/composables/useDocManager';
import { NEXT_TYPE, mapCarry } from '@/lib/carryForward';
import DocManagerBar from '@/components/DocManagerBar.vue';
import PurchasingOrder from '@/views/PurchasingOrder.vue';
import ProformaInvoice from '@/views/ProformaInvoice.vue';
import CommercialInvoice from '@/views/CommercialInvoice.vue';
import PackingList from '@/views/PackingList.vue';
import Quotation from '@/views/Quotation.vue';

interface Tab {
  id: string;
  label: string;
  short: string;
  comp: Component;
}

const TABS: Tab[] = [
  { id: 'qt', label: 'Quotation',          short: 'QT', comp: Quotation },
  { id: 'po', label: 'Purchasing Order',   short: 'PO', comp: PurchasingOrder },
  { id: 'pi', label: 'Proforma Invoice',   short: 'PI', comp: ProformaInvoice },
  { id: 'ci', label: 'Commercial Invoice', short: 'CI', comp: CommercialInvoice },
  { id: 'pl', label: 'Packing List',       short: 'PL', comp: PackingList },
];

const active = ref('qt');
const activeComp = computed<Component>(
  () => TABS.find((t) => t.id === active.value)?.comp ?? PurchasingOrder,
);

// 현재 활성 문서가 자신의 CRUD 컨트롤러를 등록하는 슬롯. DocManagerBar 가 이를 제어한다.
const activeDoc = shallowRef<DocController | null>(null);
provide(ACTIVE_DOC, activeDoc);

// 다음 단계 문서로 내용을 넘기는 핸드오프 버퍼. 탭 전환 시 뷰가 언마운트되므로 App 레벨에 둔다.
const carryBuffer = shallowRef<CarryBuffer | null>(null);
provide(CARRY_BUFFER, carryBuffer);

function onCarry(): void {
  const ctrl = activeDoc.value;
  if (!ctrl) return;
  const to = NEXT_TYPE[ctrl.docType];
  if (!to) return;
  carryBuffer.value = { toType: to, data: mapCarry(ctrl.docType, ctrl.snapshot()) };
  active.value = to.toLowerCase();
}

function printDoc() {
  window.print();
}
</script>

<template>
  <div class="min-h-screen">
    <!-- ── Top bar (no-print) ── -->
    <div class="sticky top-0 left-0 w-full z-10">
      <div
      class="no-print bg-navy px-5 py-3 flex items-center justify-between
             shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
    >
      <div class="flex items-center gap-3">
        <img src="/logo-griptec.png" alt="GRIPTEK logo" class="h-9 w-auto object-contain" />
        <div>
          <div class="text-gold font-bold text-[15px] tracking-[1px]">{{ CO.name }}</div>
          <div class="text-[#aac4df] text-[10px] mt-0.5">Business Document Forms</div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <DocManagerBar :controller="activeDoc" @carry="onCarry" />
      </div>
      </div>

    <!-- ── Tab bar (no-print) ── -->
    <div class="no-print bg-[#162d52] flex items-end px-5 gap-1 overflow-x-auto">
      <button
        v-for="t in TABS"
        :key="t.id"
        type="button"
        class="rounded-t-lg px-5 py-2.25 text-[12px] font-bold cursor-pointer
               whitespace-nowrap border-b-[3px] transition-all duration-150"
        :class="active === t.id
          ? 'bg-white text-navy border-gold'
          : 'bg-transparent text-[#aac4df] border-transparent'"
        @click="active = t.id"
      >
        <span
          class="inline-block rounded text-white px-1.5 py-px text-[10px] mr-1.5 font-bold"
          :class="active === t.id ? 'bg-midblue' : 'bg-white/10'"
        >{{ t.short }}</span>
        {{ t.label }}
      </button>
    </div>

    </div>
    
    <!-- ── Document area ── -->
    <div class="doc-area pt-7 pb-12">
      <component :is="activeComp" />
    </div>
  </div>
</template>
