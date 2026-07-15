<script setup lang="ts">
/* DOC 1 — PURCHASING ORDER */
import { reactive, ref, onMounted, watch, nextTick } from 'vue';
import { CO } from '@/data/company';
import { useMoneyDoc } from '@/composables/useMoneyDoc';
import { useDocManager } from '@/composables/useDocManager';
import { useProductPicker } from '@/composables/useProductPicker';
import { fetchVendors, type Vendor } from '@/lib/vendorsApi';
import { companyDocNo, companyAbbr, todayISO } from '@/utils/calc';
import EmailLogin from '@/components/EmailLogin.vue';
import ProductPickerBar from '@/components/ProductPickerBar.vue';
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

const meta = reactive<Record<string, string>>({ poNumber: companyDocNo('PO', ''), date: todayISO(), requiredDate: '' });
const titleFields: { label: string; key: string }[] = [
  { label: 'PO Number', key: 'poNumber' },
  { label: 'Date', key: 'date' },
  { label: 'Required Date', key: 'requiredDate' },
];

const vendor = reactive<Record<string, string>>({ company: '', address: '', cityState: '', phone: '', email: '' });
// Ship To = 자사(Griptek)가 물품을 받는 곳 → 회사 기본정보로 초기화.
const shipTo = reactive<Record<string, string>>({
  company: CO.name,
  address: `${CO.a1}, ${CO.a2}`,
  cityState: CO.a3,
  contact: CO.pic,
  paymentTerms: 'CBD',
});
const partyRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Company Name', leftKey: 'company', rightLabel: 'Company Name', rightKey: 'company' },
  { leftLabel: 'Address', leftKey: 'address', rightLabel: 'Address', rightKey: 'address' },
  { leftLabel: 'City / State', leftKey: 'cityState', rightLabel: 'City / State', rightKey: 'cityState' },
  { leftLabel: 'Phone', leftKey: 'phone', rightLabel: 'Contact Person', rightKey: 'contact' },
  { leftLabel: 'Email', leftKey: 'email', rightLabel: 'Payment Terms', rightKey: 'paymentTerms' },
];

// 등록된 벤더 목록 → 선택 시 Vendor/Supplier 칸 자동입력.
const vendors = ref<Vendor[]>([]);
const selectedVendorId = ref('');
onMounted(async () => { vendors.value = await fetchVendors(); });
function applyVendor(): void {
  const v = vendors.value.find((x) => x.id === selectedVendorId.value);
  if (!v) return;
  vendor.company = v.name;
  vendor.address = v.address ?? '';
  vendor.cityState = v.city_state ?? '';
  vendor.phone = v.phone ?? '';
  vendor.email = v.email ?? '';
}

const info = reactive<Record<string, string>>({ deliveryTerms: '', deliveryMethod: '', currency: 'IDR', remarks: '' });
const infoRows: { leftLabel: string; leftKey: string; rightLabel: string; rightKey: string }[] = [
  { leftLabel: 'Delivery Terms', leftKey: 'deliveryTerms', rightLabel: 'Delivery Method', rightKey: 'deliveryMethod' },
  { leftLabel: 'Currency', leftKey: 'currency', rightLabel: 'Remarks', rightKey: 'remarks' },
];

const { items, sumQty, sumNet, addRow, removeRow } = useMoneyDoc(3, false);

const {
  products, productsLoading, productsError, showLogin,
  asuraRole, isAsuraConfigured, policy,
  onLoginSuccess, logout, applyProduct, repriceUnit,
} = useProductPicker(items);

// 문서번호의 회사 약어 = 벤더(공급사)명 기준 자동 갱신. 불러올 땐 저장된 번호 보존.
let suppressDocNo = false;
watch(() => vendor.company, (name) => {
  if (suppressDocNo) return;
  meta.poNumber = companyDocNo('PO', companyAbbr(name));
});

useDocManager(
  'PO',
  () => meta.poNumber,
  () => ({ meta, vendor, shipTo, info, items }),
  (p) => {
    suppressDocNo = true;
    Object.assign(meta, p.meta as Record<string, string>);
    Object.assign(vendor, p.vendor as Record<string, string>);
    Object.assign(shipTo, p.shipTo as Record<string, string>);
    Object.assign(info, p.info as Record<string, string>);
    if (Array.isArray(p.items)) items.splice(0, items.length, ...(p.items as typeof items));
    nextTick(() => { suppressDocNo = false; });
  },
  undefined,
  undefined,
  // PO 저장 시 벤더를 vendors 테이블에 자동 누적(upsert).
  () => ({ name: vendor.company, address: vendor.address, city_state: vendor.cityState, phone: vendor.phone, email: vendor.email }),
);
</script>

<template>
  <DocPage class="flex flex-col" :title="meta.poNumber">
    <table class="w-full border-collapse">
      <tbody>
        <tr>
          <CompanyHeader />
          <DocTitleBlock title="PURCHASING ORDER" :fields="titleFields" :model="meta" />
        </tr>
      </tbody>
    </table>
    <GoldBar />

    <!-- 등록 벤더 선택 → Vendor/Supplier 자동입력 (화면 전용) -->
    <div v-if="vendors.length" class="no-print mb-1.5 mt-1 text-[11px] flex items-center gap-2">
      <span class="text-[#888]">등록 벤더 선택:</span>
      <select v-model="selectedVendorId" @change="applyVendor"
              class="border border-gray-300 rounded px-2 py-1 text-[11px] cursor-pointer outline-none focus:border-midblue">
        <option value="">— 직접 입력 —</option>
        <option v-for="v in vendors" :key="v.id" :value="v.id">{{ v.name }}</option>
      </select>
    </div>

    <PartyBlock
      left-title="VENDOR / SUPPLIER" right-title="SHIP TO"
      :rows="partyRows" :left-model="vendor" :right-model="shipTo"
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
    <SigBlock :labels="['Prepared By', 'Approved By', 'Received By']" :sub1="CO.pic" :sub2="CO.name" />
    <FooterNote class="mt-auto"
      :note="`This Purchase Order constitutes an agreement between ${CO.name} and the vendor. All goods must match specifications. Unauthorized substitutions are not accepted.`"
    />

  </DocPage>

  <EmailLogin v-if="showLogin" @success="onLoginSuccess" @skip="showLogin = false" />
</template>
