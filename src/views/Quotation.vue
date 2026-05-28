<script setup lang="ts">
/* DOC 5 — QUOTATION */
import { reactive, watch, nextTick } from 'vue';
import { CO, BANK, TC } from '@/data/company';
import { useMoneyDoc } from '@/composables/useMoneyDoc';
import { useDocManager } from '@/composables/useDocManager';
import { companyDocNo, companyAbbr } from '@/utils/calc';
import DocPage from '@/components/DocPage.vue';
import CompanyHeader from '@/components/CompanyHeader.vue';
import DocTitleBlock from '@/components/DocTitleBlock.vue';
import GoldBar from '@/components/GoldBar.vue';
import InfoGrid from '@/components/InfoGrid.vue';
import MoneyItemsTable from '@/components/MoneyItemsTable.vue';
import MoneyDocSummary from '@/components/MoneyDocSummary.vue';
import SigBlock from '@/components/SigBlock.vue';
import FooterNote from '@/components/FooterNote.vue';

// Valid Until 기본값 — 견적일(오늘)로부터 1개월 후. 입력칸이므로 자유롭게 수정 가능.
function oneMonthFromToday(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString('en-GB');
}
const meta = reactive<Record<string, string>>({ quotationNo: companyDocNo('QT', ''), date: '', validUntil: oneMonthFromToday() });
const titleFields: { label: string; key: string }[] = [
  { label: 'Quotation No.', key: 'quotationNo' },
  { label: 'Date', key: 'date' },
  { label: 'Valid Until', key: 'validUntil' },
];

const info = reactive<Record<string, string>>({
  company: '', project: '', contact: '', delAddress: '',
  address: '', delDate: '', phone: '', email: '', payment: '', npwp: '', currency: 'IDR', remark: '',
});
const infoRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Company Name', leftKey: 'company', rightLabel: 'Project Name / Desc.', rightKey: 'project' },
  { leftLabel: 'Contact Person', leftKey: 'contact', rightLabel: 'Delivery Address', rightKey: 'delAddress' },
  { leftLabel: 'Address', leftKey: 'address', rightLabel: 'Delivery Date', rightKey: 'delDate' },
  { leftLabel: 'Phone', leftKey: 'phone', rightLabel: 'Email', rightKey: 'email' },
  { leftLabel: 'Payment Terms', leftKey: 'payment', rightLabel: 'NPWP (Tax ID)', rightKey: 'npwp' },
  { leftLabel: 'Currency', leftKey: 'currency', rightLabel: 'Remark', rightKey: 'remark' },
];

const { items, sumQty, sumNet, addRow, removeRow } = useMoneyDoc(3, false);

// 고객사명(Company Name) 입력에 따라 문서번호의 회사 약어를 자동 갱신.
// 문서를 불러올 때는 저장된 번호를 보존해야 하므로 suppress 플래그로 차단한다.
let suppressDocNo = false;
watch(
  () => info.company,
  (name) => {
    if (suppressDocNo) return;
    meta.quotationNo = companyDocNo('QT', companyAbbr(name));
  },
);

useDocManager(
  'QT',
  () => meta.quotationNo,
  () => ({ meta, info, items }),
  (p) => {
    suppressDocNo = true;
    Object.assign(meta, p.meta as Record<string, string>);
    Object.assign(info, p.info as Record<string, string>);
    if (Array.isArray(p.items)) items.splice(0, items.length, ...(p.items as typeof items));
    nextTick(() => { suppressDocNo = false; });
  },
);
</script>

<template>
  <DocPage class="flex flex-col" :title="`Quotation - ${meta.quotationNo}`">
    <table class="w-full border-collapse">
      <tbody>
        <tr>
          <CompanyHeader />
          <DocTitleBlock title="QUOTATION" :fields="titleFields" :model="meta" />
        </tr>
      </tbody>
    </table>
    <GoldBar />

    <InfoGrid :rows="infoRows" :model="info" />

    <MoneyItemsTable
      :items="items" :sum-qty="sumQty" :sum-amount="sumNet"
      :on-add-row="addRow" :on-remove-row="removeRow"
    />

    <MoneyDocSummary :sum-amount="sumNet" />

    <!-- Terms & Bank -->
    <table class="w-full border-collapse mb-3.5">
      <tbody>
        <tr>
          <td class="bg-midblue text-white font-bold text-[10px] px-2.5 py-1.25 text-left w-[48%]">
            TERMS &amp; CONDITIONS
          </td>
          <td class="w-[4%]" />
          <td colspan="2"
              class="bg-midblue text-white font-bold text-[10px] px-2.5 py-1.25 text-center w-[48%]">
            BANK / PAYMENT INFORMATION
          </td>
        </tr>
        <tr v-for="(line, i) in TC" :key="i" :class="i % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-white'">
          <td class="px-2 py-1 text-[9px] italic text-[#444] border border-[#eee]">{{ line }}</td>
          <td />
          <td class="bg-graybg text-navy font-bold text-[9px] px-2 py-1 border border-[#eee] w-[24%]">
            {{ BANK[i].label }} :
          </td>
          <td class="px-2 py-1 text-[9px] border border-[#eee] w-[24%]">{{ BANK[i].value }}</td>
        </tr>
      </tbody>
    </table>
    <SigBlock
      :labels="['Prepared By', 'Authorized By', 'Client Acknowledgement']"
      :sub1="CO.pic" :sub2="CO.name"
    />
    <FooterNote class="mt-auto"
      :note="`Dokumen ini merupakan penawaran resmi dari ${CO.name}. Tidak mengikat sebelum konfirmasi tertulis. ${CO.phone} | ${CO.email}`"
    />
  </DocPage>
</template> 
