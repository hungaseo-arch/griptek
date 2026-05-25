<script setup lang="ts">
/* DOC 1 — PURCHASING ORDER */
import { reactive } from 'vue';
import { CO } from '@/data/company';
import { useMoneyDoc } from '@/composables/useMoneyDoc';
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

const meta = reactive<Record<string, string>>({ poNumber: todayDocNo('PO'), date: '', requiredDate: '' });
const titleFields: { label: string; key: string }[] = [
  { label: 'PO Number', key: 'poNumber' },
  { label: 'Date', key: 'date' },
  { label: 'Required Date', key: 'requiredDate' },
];

const vendor = reactive<Record<string, string>>({ company: '', address: '', cityState: '', phone: '', email: '' });
const shipTo = reactive<Record<string, string>>({ company: '', address: '', cityState: '', contact: '', paymentTerms: '' });
const partyRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Company Name', leftKey: 'company', rightLabel: 'Company Name', rightKey: 'company' },
  { leftLabel: 'Address', leftKey: 'address', rightLabel: 'Address', rightKey: 'address' },
  { leftLabel: 'City / State', leftKey: 'cityState', rightLabel: 'City / State', rightKey: 'cityState' },
  { leftLabel: 'Phone', leftKey: 'phone', rightLabel: 'Contact Person', rightKey: 'contact' },
  { leftLabel: 'Email', leftKey: 'email', rightLabel: 'Payment Terms', rightKey: 'paymentTerms' },
];

const info = reactive<Record<string, string>>({ deliveryTerms: '', deliveryMethod: '', currency: 'IDR', remarks: '' });
const infoRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Delivery Terms', leftKey: 'deliveryTerms', rightLabel: 'Delivery Method', rightKey: 'deliveryMethod' },
  { leftLabel: 'Currency', leftKey: 'currency', rightLabel: 'Remarks', rightKey: 'remarks' },
];

const { items, sumQty, sumNet, addRow, removeRow } = useMoneyDoc(3, false);
</script>

<template>
  <DocPage class="flex flex-col" :title="`Purchasing Order - ${meta.poNumber}`">
    <table class="w-full border-collapse">
      <tbody>
        <tr>
          <CompanyHeader />
          <DocTitleBlock title="PURCHASING ORDER" :fields="titleFields" :model="meta" />
        </tr>
      </tbody>
    </table>
    <GoldBar />

    <PartyBlock
      left-title="VENDOR / SUPPLIER" right-title="SHIP TO"
      :rows="partyRows" :left-model="vendor" :right-model="shipTo"
    />

    <InfoGrid :rows="infoRows" :model="info" />

    <MoneyItemsTable :items="items" :on-add-row="addRow" :on-remove-row="removeRow" />

    <MoneyDocSummary :sum-qty="sumQty" :sum-amount="sumNet" />
    <SigBlock :labels="['Prepared By', 'Approved By', 'Received By']" :sub1="CO.pic" :sub2="CO.name" />
    <FooterNote class="mt-auto"
      :note="`This Purchase Order constitutes an agreement between ${CO.name} and the vendor. All goods must match specifications. Unauthorized substitutions are not accepted.`"
    />

  </DocPage>
</template>
