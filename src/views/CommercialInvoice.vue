<script setup lang="ts">
/* DOC 3 — COMMERCIAL INVOICE */
import { reactive, watch, nextTick } from 'vue';
import { CO } from '@/data/company';
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
import PartyBlock from '@/components/PartyBlock.vue';
import InfoGrid from '@/components/InfoGrid.vue';
import MoneyItemsTable from '@/components/MoneyItemsTable.vue';
import MoneyDocSummary from '@/components/MoneyDocSummary.vue';
import SigBlock from '@/components/SigBlock.vue';
import FooterNote from '@/components/FooterNote.vue';

const meta = reactive<Record<string, string>>({ invoiceNo: companyDocNo('CI', ''), invoiceDate: todayISO(), lcNumber: '' });
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

const {
  products, productsLoading, productsError, showLogin,
  asuraRole, isAsuraConfigured, policy,
  onLoginSuccess, logout, applyProduct, repriceUnit,
} = useProductPicker(items);

// 문서번호의 회사 약어 = Consignee(구매자)명 기준 자동 갱신. 불러올 땐 저장된 번호 보존.
let suppressDocNo = false;
watch(() => consignee.company, (name) => {
  if (suppressDocNo) return;
  meta.invoiceNo = companyDocNo('CI', companyAbbr(name));
});

// 등록 고객 → 선택 시 자동입력 / 저장 시 자동 누적.
const { customers } = useCustomers();
function applyCustomer(c: Customer): void {
  consignee.company = c.name;
  consignee.address = c.address ?? '';
  consignee.cityCountry = c.city_state ?? '';
  consignee.phoneEmail = c.phone ?? '';
  consignee.npwp = c.npwp ?? '';
}

useDocManager(
  'CI',
  () => meta.invoiceNo,
  () => ({ meta, exporter, consignee, info, items }),
  (p) => {
    suppressDocNo = true;
    Object.assign(meta, p.meta as Record<string, string>);
    Object.assign(exporter, p.exporter as Record<string, string>);
    Object.assign(consignee, p.consignee as Record<string, string>);
    Object.assign(info, p.info as Record<string, string>);
    if (Array.isArray(p.items)) items.splice(0, items.length, ...(p.items as typeof items));
    nextTick(() => { suppressDocNo = false; });
  },
  undefined,
  () => ({ name: consignee.company, address: consignee.address, city_state: consignee.cityCountry, phone: consignee.phoneEmail, npwp: consignee.npwp }),
);
</script>

<template>
  <DocPage class="flex flex-col" :title="meta.invoiceNo">
    <table class="w-full border-collapse">
      <tbody>
        <tr>
          <CompanyHeader />
          <DocTitleBlock title="COMMERCIAL INVOICE" :fields="titleFields" :model="meta" />
        </tr>
      </tbody>
    </table>
    <GoldBar />

    <CustomerPicker :customers="customers" @pick="applyCustomer" />

    <PartyBlock
      left-title="EXPORTER / SELLER" right-title="CONSIGNEE / BUYER"
      :rows="partyRows" :left-model="exporter" :right-model="consignee"
    />

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

  <EmailLogin v-if="showLogin" @success="onLoginSuccess" @skip="showLogin = false" />
</template>
