<script setup lang="ts">
/* DOC 4 — PACKING LIST. React 원본 PackingList() 이관 + 입력/자동집계. */
import { reactive, ref } from 'vue';
import { CO } from '@/data/company';
import { usePackingDoc } from '@/composables/usePackingDoc';
import { todayDocNo } from '@/utils/calc';
import DocPage from '@/components/DocPage.vue';
import CompanyHeader from '@/components/CompanyHeader.vue';
import DocTitleBlock from '@/components/DocTitleBlock.vue';
import GoldBar from '@/components/GoldBar.vue';
import PartyBlock from '@/components/PartyBlock.vue';
import InfoGrid from '@/components/InfoGrid.vue';
import PackingItemsTable from '@/components/PackingItemsTable.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import SigBlock from '@/components/SigBlock.vue';
import FooterNote from '@/components/FooterNote.vue';

const meta = reactive<Record<string, string>>({ plNumber: todayDocNo('PL'), date: '', refInvoiceNo: '' });
const titleFields: { label: string; key: string }[] = [
  { label: 'PL Number', key: 'plNumber' },
  { label: 'Date', key: 'date' },
  { label: 'Ref. Invoice No.', key: 'refInvoiceNo' },
];

// 좌측(수출자/Shipper)은 회사 정보로 미리 채움.
const shipper = reactive<Record<string, string>>({
  company: CO.name, address: CO.a1, cityCountry: CO.a3, phone: CO.phone, email: CO.email,
});
const consignee = reactive<Record<string, string>>({
  company: '', address: '', cityCountry: '', phone: '', attention: '',
});
const partyRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Company', leftKey: 'company', rightLabel: 'Company', rightKey: 'company' },
  { leftLabel: 'Address', leftKey: 'address', rightLabel: 'Address', rightKey: 'address' },
  { leftLabel: 'City / Country', leftKey: 'cityCountry', rightLabel: 'City / Country', rightKey: 'cityCountry' },
  { leftLabel: 'Phone', leftKey: 'phone', rightLabel: 'Phone', rightKey: 'phone' },
  { leftLabel: 'Email', leftKey: 'email', rightLabel: 'Attention', rightKey: 'attention' },
];

const info = reactive<Record<string, string>>({
  vessel: '', portLoading: '', portDischarge: '', bl: '',
  totalPackages: '', totalGross: '', totalNet: '', totalCbm: '',
});
const infoRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Vessel / Flight', leftKey: 'vessel', rightLabel: 'Port of Loading', rightKey: 'portLoading' },
  { leftLabel: 'Port of Discharge', leftKey: 'portDischarge', rightLabel: 'B/L No. / AWB No.', rightKey: 'bl' },
  { leftLabel: 'Total Packages', leftKey: 'totalPackages', rightLabel: 'Total Gross Weight', rightKey: 'totalGross' },
  { leftLabel: 'Total Net Weight', leftKey: 'totalNet', rightLabel: 'Total CBM', rightKey: 'totalCbm' },
];

const { items, totalPkgs, totalNetWt, totalGrossWt, totalCbm, addRow, removeRow } = usePackingDoc(3);
const remarks = ref('');
</script>

<template>
  <DocPage class="flex flex-col" :title="`Packing List - ${meta.plNumber}`">
    <table class="w-full border-collapse">
      <tbody>
        <tr>
          <CompanyHeader />
          <DocTitleBlock title="PACKING LIST" :fields="titleFields" :model="meta" />
        </tr>
      </tbody>
    </table>
    <GoldBar />

    <PartyBlock
      left-title="SHIPPER / EXPORTER" right-title="CONSIGNEE / IMPORTER"
      :rows="partyRows" :left-model="shipper" :right-model="consignee"
    />

    <InfoGrid :rows="infoRows" :model="info" />

    <PackingItemsTable
      :items="items"
      :total-pkgs="totalPkgs" :total-net-wt="totalNetWt"
      :total-gross-wt="totalGrossWt" :total-cbm="totalCbm"
      :on-add-row="addRow" :on-remove-row="removeRow"
    />

    <div class="h-2.5" />

    <SectionHeader align="left" class="mb-1">REMARKS</SectionHeader>
    <textarea
      v-model="remarks"
      rows="3"
      class="field-input w-full border border-[#ddd] px-3 py-2.5 text-[9px]
             min-h-12 mb-3.5 outline-none resize-y leading-relaxed"
      placeholder="(Special handling instructions, labeling requirements, etc.)"
    />

    <SigBlock :labels="['Prepared By', 'Authorized By', 'Received By']" :sub1="CO.pic" :sub2="CO.name" />
    <FooterNote class="mt-auto"
      :note="`Packing List issued by ${CO.name}. Weights and dimensions are approximate. Please verify upon receipt. Tel: ${CO.phone}`"
    />
  </DocPage>
</template>
