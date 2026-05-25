<script setup lang="ts">
/* DOC 5 — QUOTATION */
import { reactive } from 'vue';
import { CO, BANK, TC } from '@/data/company';
import { useMoneyDoc } from '@/composables/useMoneyDoc';
import { todayDocNo } from '@/utils/calc';
import DocPage from '@/components/DocPage.vue';
import CompanyHeader from '@/components/CompanyHeader.vue';
import DocTitleBlock from '@/components/DocTitleBlock.vue';
import GoldBar from '@/components/GoldBar.vue';
import InfoGrid from '@/components/InfoGrid.vue';
import MoneyItemsTable from '@/components/MoneyItemsTable.vue';
import MoneyDocSummary from '@/components/MoneyDocSummary.vue';
import SigBlock from '@/components/SigBlock.vue';
import FooterNote from '@/components/FooterNote.vue';

const meta = reactive<Record<string, string>>({ quotationNo: todayDocNo('QT'), date: '', validUntil: '' });
const titleFields: { label: string; key: string }[] = [
  { label: 'Quotation No.', key: 'quotationNo' },
  { label: 'Date', key: 'date' },
  { label: 'Valid Until', key: 'validUntil' },
];

const info = reactive<Record<string, string>>({
  company: '', project: '', contact: '', delAddress: '',
  address: '', delDate: '', phone: '', payment: '', npwp: '', currency: 'IDR',
});
const infoRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Company Name', leftKey: 'company', rightLabel: 'Project Name / Desc.', rightKey: 'project' },
  { leftLabel: 'Contact Person', leftKey: 'contact', rightLabel: 'Delivery Address', rightKey: 'delAddress' },
  { leftLabel: 'Address', leftKey: 'address', rightLabel: 'Delivery Date', rightKey: 'delDate' },
  { leftLabel: 'Phone / Email', leftKey: 'phone', rightLabel: 'Payment Terms', rightKey: 'payment' },
  { leftLabel: 'NPWP (Tax ID)', leftKey: 'npwp', rightLabel: 'Currency', rightKey: 'currency' },
];

const { items, sumQty, sumNet, addRow, removeRow } = useMoneyDoc(3, false);
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

    <MoneyItemsTable :items="items" :on-add-row="addRow" :on-remove-row="removeRow" />

    <MoneyDocSummary :sum-qty="sumQty" :sum-amount="sumNet" />

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
