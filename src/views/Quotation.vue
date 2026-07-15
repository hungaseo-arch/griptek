<script setup lang="ts">
/* DOC 5 — QUOTATION */
import { reactive, watch, nextTick } from 'vue';
import { CO, BANK, TC } from '@/data/company';
import { useMoneyDoc } from '@/composables/useMoneyDoc';
import { useDocManager } from '@/composables/useDocManager';
import { useProductPicker } from '@/composables/useProductPicker';
import { useCustomers } from '@/composables/useCustomers';
import { type Customer } from '@/lib/customersApi';
import { companyDocNo, companyAbbr, todayISO, addMonthsISO } from '@/utils/calc';
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
import SigBlock from '@/components/SigBlock.vue';
import FooterNote from '@/components/FooterNote.vue';

// Date=오늘, Valid Until=오늘+1개월(달력 입력, 자유 수정 가능).
const meta = reactive<Record<string, string>>({ quotationNo: companyDocNo('QT', ''), date: todayISO(), validUntil: addMonthsISO(1) });
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

// 등록 고객 → 선택 시 자동입력 / 저장 시 자동 누적.
const { customers } = useCustomers();
function applyCustomer(c: Customer): void {
  info.company = c.name;
  info.address = c.address ?? '';
  info.contact = c.contact ?? '';
  info.phone = c.phone ?? '';
  info.email = c.email ?? '';
  info.npwp = c.npwp ?? '';
}

// 저장/불러오기는 DB(API). 저장 시 구매고객을 customers 테이블에 자동 누적.
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
  undefined,
  () => ({ name: info.company, address: info.address, phone: info.phone, email: info.email, contact: info.contact, npwp: info.npwp }),
);

// (PDF 저장 파일명 = 문서 명칭 → DocPage 가 document.title 처리)

// ── 제품 추천/가격 (QT/PO/PI/CI 공용 컴포저블) ──
const {
  products, productsLoading, productsError, showLogin,
  asuraRole, isAsuraConfigured, policy,
  onLoginSuccess, logout, applyProduct, repriceUnit,
} = useProductPicker(items);
</script>

<template>
  <DocPage class="flex flex-col" :title="meta.quotationNo">
    <table class="w-full border-collapse">
      <tbody>
        <tr>
          <CompanyHeader />
          <DocTitleBlock title="QUOTATION" :fields="titleFields" :model="meta" />
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

  <EmailLogin v-if="showLogin" @success="onLoginSuccess" @skip="showLogin = false" />
</template>
