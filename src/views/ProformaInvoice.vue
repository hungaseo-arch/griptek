<script setup lang="ts">
/* DOC 2 — PROFORMA INVOICE */
import { reactive } from 'vue';
import { CO, PI_TERMS } from '@/data/company';
import { useMoneyDoc } from '@/composables/useMoneyDoc';
import { todayDocNo } from '@/utils/calc';
import DocPage from '@/components/DocPage.vue';
import CompanyHeader from '@/components/CompanyHeader.vue';
import DocTitleBlock from '@/components/DocTitleBlock.vue';
import GoldBar from '@/components/GoldBar.vue';
import InfoGrid from '@/components/InfoGrid.vue';
import MoneyItemsTable from '@/components/MoneyItemsTable.vue';
import MoneyDocSummary from '@/components/MoneyDocSummary.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import TermsList from '@/components/TermsList.vue';
import SigBlock from '@/components/SigBlock.vue';
import FooterNote from '@/components/FooterNote.vue';

const meta = reactive<Record<string, string>>({ invoiceNo: todayDocNo('PI'), date: '', validUntil: '' });
const titleFields: { label: string; key: string }[] = [
  { label: 'Invoice No.', key: 'invoiceNo' },
  { label: 'Date', key: 'date' },
  { label: 'Valid Until', key: 'validUntil' },
];

const info = reactive<Record<string, string>>({
  billCompany: '', shipCompany: '', billContact: '', shipContact: '',
  billAddress: '', shipAddress: '', billPhone: '', shipPhone: '',
  payment: '', currency: 'IDR',
});
const infoRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Bill To (Company)', leftKey: 'billCompany', rightLabel: 'Ship To (Company)', rightKey: 'shipCompany' },
  { leftLabel: 'Contact Person', leftKey: 'billContact', rightLabel: 'Contact Person', rightKey: 'shipContact' },
  { leftLabel: 'Address', leftKey: 'billAddress', rightLabel: 'Address', rightKey: 'shipAddress' },
  { leftLabel: 'Phone / Email', leftKey: 'billPhone', rightLabel: 'Phone / Email', rightKey: 'shipPhone' },
  { leftLabel: 'Payment Terms', leftKey: 'payment', rightLabel: 'Currency', rightKey: 'currency' },
];

const { items, sumQty, sumNet, addRow, removeRow } = useMoneyDoc(3, false);
</script>

<template>
  <DocPage class="flex flex-col" :title="`Proforma Invoice - ${meta.invoiceNo}`">
    <table class="w-full border-collapse">
      <tbody>
        <tr>
          <CompanyHeader />
          <DocTitleBlock title="PROFORMA INVOICE" :fields="titleFields" :model="meta" />
        </tr>
      </tbody>
    </table>
    <GoldBar />

    <InfoGrid :rows="infoRows" :model="info" />

    <MoneyItemsTable :items="items" :on-add-row="addRow" :on-remove-row="removeRow" />

    <MoneyDocSummary :sum-qty="sumQty" :sum-amount="sumNet" />

    <SectionHeader align="left" class="mb-0.5">TERMS &amp; CONDITIONS</SectionHeader>
    <TermsList :items="PI_TERMS" />

    <SigBlock :labels="['Prepared By', 'Authorized By', 'Accepted By']" :sub1="CO.pic" :sub2="CO.name" />
    <FooterNote class="mt-auto"
      :note="`This Proforma Invoice is issued by ${CO.name}. It is not a VAT invoice. For inquiries: ${CO.phone} | ${CO.email}`"
    />
  </DocPage>
</template>
