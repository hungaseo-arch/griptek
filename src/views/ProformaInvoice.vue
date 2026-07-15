<script setup lang="ts">
/* DOC 2 — PROFORMA INVOICE */
import { reactive, watch, nextTick } from 'vue';
import { CO, PI_TERMS } from '@/data/company';
import { useMoneyDoc } from '@/composables/useMoneyDoc';
import { useDocManager } from '@/composables/useDocManager';
import { useProductPicker } from '@/composables/useProductPicker';
import { useCustomers } from '@/composables/useCustomers';
import { type Customer } from '@/lib/customersApi';
import { companyDocNo, companyAbbr, todayISO } from '@/utils/calc';
import EmailLogin from '@/components/EmailLogin.vue';
import ProductPickerBar from '@/components/ProductPickerBar.vue';
import CustomerPicker from '@/components/CustomerPicker.vue';
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

const meta = reactive<Record<string, string>>({ invoiceNo: companyDocNo('PI', ''), date: todayISO(), validUntil: '' });
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

const {
  products, productsLoading, productsError, showLogin,
  asuraRole, isAsuraConfigured, policy,
  onLoginSuccess, logout, applyProduct, repriceUnit,
} = useProductPicker(items);

// 문서번호의 회사 약어 = Bill To(고객사)명 기준 자동 갱신. 불러올 땐 저장된 번호 보존.
let suppressDocNo = false;
watch(() => info.billCompany, (name) => {
  if (suppressDocNo) return;
  meta.invoiceNo = companyDocNo('PI', companyAbbr(name));
});

// 등록 고객 → 선택 시 자동입력 / 저장 시 자동 누적.
const { customers } = useCustomers();
function applyCustomer(c: Customer): void {
  info.billCompany = c.name;
  info.billAddress = c.address ?? '';
  info.billContact = c.contact ?? '';
  info.billPhone = c.phone ?? '';
}

useDocManager(
  'PI',
  () => meta.invoiceNo,
  () => ({ meta, info, items }),
  (p) => {
    suppressDocNo = true;
    Object.assign(meta, p.meta as Record<string, string>);
    Object.assign(info, p.info as Record<string, string>);
    if (Array.isArray(p.items)) items.splice(0, items.length, ...(p.items as typeof items));
    nextTick(() => { suppressDocNo = false; });
  },
  undefined,
  () => ({ name: info.billCompany, address: info.billAddress, phone: info.billPhone, contact: info.billContact }),
);
</script>

<template>
  <DocPage class="flex flex-col" :title="meta.invoiceNo">
    <table class="w-full border-collapse">
      <tbody>
        <tr>
          <CompanyHeader />
          <DocTitleBlock title="PROFORMA INVOICE" :fields="titleFields" :model="meta" />
        </tr>
      </tbody>
    </table>
    <GoldBar />

    <CustomerPicker :customers="customers" @pick="applyCustomer" />

    <InfoGrid :rows="infoRows" :model="info" />

    <ProductPickerBar
      :configured="isAsuraConfigured" :role="asuraRole" :products="products"
      :loading="productsLoading" :error="productsError" :policy="policy"
      @open-login="showLogin = true" @logout="logout"
    />

    <MoneyItemsTable
      :items="items" :sum-qty="sumQty" :sum-amount="sumNet"
      :on-add-row="addRow" :on-remove-row="removeRow"
      :products="asuraRole ? products : undefined"
      :price-policy="policy ?? undefined"
      hide-adjust-on-print
      :on-pick-product="applyProduct"
      :on-unit-change="repriceUnit"
    />

    <MoneyDocSummary :sum-amount="sumNet" />

    <SectionHeader align="left" class="mb-0.5">TERMS &amp; CONDITIONS</SectionHeader>
    <TermsList :items="PI_TERMS" />

    <SigBlock :labels="['Prepared By', 'Authorized By', 'Accepted By']" :sub1="CO.pic" :sub2="CO.name" />
    <FooterNote class="mt-auto"
      :note="`This Proforma Invoice is issued by ${CO.name}. It is not a VAT invoice. For inquiries: ${CO.phone} | ${CO.email}`"
    />
  </DocPage>

  <EmailLogin v-if="showLogin" @success="onLoginSuccess" @skip="showLogin = false" />
</template>
