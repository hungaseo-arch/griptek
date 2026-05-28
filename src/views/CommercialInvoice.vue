<script setup lang="ts">
/* DOC 3 — COMMERCIAL INVOICE */
import { reactive } from 'vue';
import { CO } from '@/data/company';
import { useMoneyDoc } from '@/composables/useMoneyDoc';
import { useDocManager } from '@/composables/useDocManager';
import { todayDocNo } from '@/utils/calc';
import DocPage from '@/components/DocPage.vue';
import CompanyHeader from '@/components/CompanyHeader.vue';
import DocTitleBlock from '@/components/DocTitleBlock.vue';
import GoldBar from '@/components/GoldBar.vue';
import PartyBlock from '@/components/PartyBlock.vue';
import InfoGrid from '@/components/InfoGrid.vue';
import MoneyItemsTable from '@/components/MoneyItemsTable.vue';
import MoneyDocSummary from '@/components/MoneyDocSummary.vue';
import SigBlock from '@/components/SigBlock.vue';
import FooterNote from '@/components/FooterNote.vue';

const meta = reactive<Record<string, string>>({ invoiceNo: todayDocNo('CI'), invoiceDate: '', lcNumber: '' });
const titleFields: { label: string; key: string }[] = [
  { label: 'Invoice No.', key: 'invoiceNo' },
  { label: 'Invoice Date', key: 'invoiceDate' },
  { label: 'L/C Number', key: 'lcNumber' },
];

const exporter = reactive<Record<string, string>>({
  company: CO.name, address: CO.a1, cityProvince: CO.a2, phone: CO.phone, email: CO.email,
});
const consignee = reactive<Record<string, string>>({
  company: '', address: '', cityCountry: '', phoneEmail: '', npwp: '',
});
const partyRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Company Name', leftKey: 'company', rightLabel: 'Company Name', rightKey: 'company' },
  { leftLabel: 'Address', leftKey: 'address', rightLabel: 'Address', rightKey: 'address' },
  { leftLabel: 'City / Province', leftKey: 'cityProvince', rightLabel: 'City / Country', rightKey: 'cityCountry' },
  { leftLabel: 'Phone', leftKey: 'phone', rightLabel: 'Phone / Email', rightKey: 'phoneEmail' },
  { leftLabel: 'Email', leftKey: 'email', rightLabel: 'NPWP / Tax ID', rightKey: 'npwp' },
];

const info = reactive<Record<string, string>>({
  portLoading: '', portDischarge: '', vessel: '', bl: '',
  origin: 'Indonesia', incoterms: '', payment: '', currency: 'USD / IDR',
});
const infoRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Port of Loading', leftKey: 'portLoading', rightLabel: 'Port of Discharge', rightKey: 'portDischarge' },
  { leftLabel: 'Vessel / Flight', leftKey: 'vessel', rightLabel: 'B/L No. / AWB No.', rightKey: 'bl' },
  { leftLabel: 'Country of Origin', leftKey: 'origin', rightLabel: 'Incoterms', rightKey: 'incoterms' },
  { leftLabel: 'Payment Terms', leftKey: 'payment', rightLabel: 'Currency', rightKey: 'currency' },
];

const { items, sumQty, sumNet, addRow, removeRow } = useMoneyDoc(3, false);

useDocManager(
  'CI',
  () => meta.invoiceNo,
  () => ({ meta, exporter, consignee, info, items }),
  (p) => {
    Object.assign(meta, p.meta as Record<string, string>);
    Object.assign(exporter, p.exporter as Record<string, string>);
    Object.assign(consignee, p.consignee as Record<string, string>);
    Object.assign(info, p.info as Record<string, string>);
    if (Array.isArray(p.items)) items.splice(0, items.length, ...(p.items as typeof items));
  },
);
</script>

<template>
  <DocPage class="flex flex-col" :title="`Commercial Invoice - ${meta.invoiceNo}`">
    <table class="w-full border-collapse">
      <tbody>
        <tr>
          <CompanyHeader />
          <DocTitleBlock title="COMMERCIAL INVOICE" :fields="titleFields" :model="meta" />
        </tr>
      </tbody>
    </table>
    <GoldBar />

    <PartyBlock
      left-title="EXPORTER / SELLER" right-title="CONSIGNEE / BUYER"
      :rows="partyRows" :left-model="exporter" :right-model="consignee"
    />

    <InfoGrid :rows="infoRows" :model="info" />

    <MoneyItemsTable
      :items="items" :sum-qty="sumQty" :sum-amount="sumNet"
      :on-add-row="addRow" :on-remove-row="removeRow"
    />

    <MoneyDocSummary :sum-amount="sumNet" />

    <div
      class="bg-graybg border border-[#ddd] px-3 py-2 text-[8.5px] text-[#444]
             italic mb-3.5 leading-[1.6]"
    >
      <strong>DECLARATION:</strong> The undersigned hereby declares that the above-mentioned
      information is true and correct, that all goods are of
      <strong>Indonesian origin</strong>, and that this commercial invoice is true and correct.
    </div>

    <SigBlock
      :labels="['Prepared By', 'Authorized Signatory', 'Customs Officer']"
      :sub1="CO.pic" :sub2="CO.name"
    />
    <FooterNote class="mt-auto"
      :note="`Commercial Invoice issued by ${CO.name}. ${CO.a1}, ${CO.a3}. Tel: ${CO.phone}`"
    />
  </DocPage>
</template>
