<script setup lang="ts">
import { ref, computed } from 'vue';
import FieldInput from '@/components/ui/FieldInput.vue';
import { lineNetUnit, lineNet, fmtOrDash, formatMoney, lineMargin, num, type MoneyItem } from '@/utils/calc';
import type { Product } from '@/lib/productsApi';
import type { RolePolicy } from '@/lib/roles';

const props = defineProps<{
  items: MoneyItem[];
  sumQty: number;
  sumAmount: number;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  // 선택: 제품 자동완성(Item Description 추천). 전달 시에만 활성.
  products?: Product[];
  // 선택: 역할별 가격 정책(원가/마진 노출). products 모드에서만 유효.
  pricePolicy?: RolePolicy;
  // 인쇄(최종 출력) 시 Disc · Net Price 컬럼 숨김 (고객용 견적 — Unit Price·Amount 만)
  hideAdjustOnPrint?: boolean;
  onPickProduct?: (index: number, product: Product) => void;
  onUnitChange?: (index: number) => void;
}>();

// ── Item Description 자동완성 ────────────────────────────────────────────────
const acRow = ref<number | null>(null);   // 자동완성 열려 있는 행 index
const acHi = ref(-1);                      // 키보드 하이라이트 index

const suggestions = computed<Product[]>(() => {
  const list = props.products;
  if (!list || acRow.value === null) return [];
  const q = (props.items[acRow.value]?.desc ?? '').trim().toLowerCase();
  if (!q) return [];
  return list
    .filter((p) =>
      (p.description ?? '').toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q) ||
      (p.sku ?? '').toLowerCase().includes(q) ||
      (p.item ?? '').toLowerCase().includes(q),
    )
    .slice(0, 8);
});

function openAc(i: number): void { acRow.value = i; acHi.value = -1; }
function closeAc(): void { acRow.value = null; acHi.value = -1; }
function pick(i: number, p: Product): void { props.onPickProduct?.(i, p); closeAc(); }

function onDescKeydown(i: number, e: KeyboardEvent): void {
  if (acRow.value !== i || !suggestions.value.length) return;
  if (e.key === 'ArrowDown')      { e.preventDefault(); acHi.value = Math.min(acHi.value + 1, suggestions.value.length - 1); }
  else if (e.key === 'ArrowUp')   { e.preventDefault(); acHi.value = Math.max(acHi.value - 1, -1); }
  else if (e.key === 'Enter' && acHi.value >= 0) { e.preventDefault(); pick(i, suggestions.value[acHi.value]); }
  else if (e.key === 'Escape')    { closeAc(); }
}

// Net Price 직접 입력 → Unit Price 를 같은 값으로 동기화(할인 0).
//   ⇒ Net Price = Unit Price, Amount = Qty × Unit Price (오차 없음).
function onNetPriceChange(it: MoneyItem, val: string): void {
  const net = num(val);
  it.unitPrice = net ? String(net) : '';
  it.discPct = '';
}

// 제품 추천 목록의 가격 라벨.
//  - End-user(서버 판매가만 수신): unit_price 그대로 표시
//  - showCost 역할(Super Admin/Staff): 원가(wh_price)
//  - 그 외(Distributor): 판매가(wh_price / divisor)로 원가 노출 차단
function priceLabel(p: Product): string {
  const parts: string[] = [];
  if (p.unit_price != null) {
    if (p.unit_price) parts.push(`${formatMoney(p.unit_price)}/pcs`);
    if (p.unit_price_set) parts.push(`${formatMoney(p.unit_price_set)}/set`);
    return parts.join(' · ');
  }
  const showCost = props.pricePolicy?.showCost ?? true;
  const div = props.pricePolicy?.divisor ?? 1;
  const show = (v: number): string => formatMoney(showCost ? v : Math.round(v / div));
  if (p.wh_price) parts.push(`${show(p.wh_price)}/pcs`);
  if (p.wh_price_set) parts.push(`${show(p.wh_price_set)}/set`);
  return parts.join(' · ');
}

const TH = 'bg-navy text-white px-[4px] py-[6px] text-center font-bold '
  + 'border border-[#3a5a8a] text-[9px] whitespace-nowrap';
const TD = 'border border-[#ddd] px-[5px] py-[5px] text-[10px] align-top';
</script>

<template>
  <table class="w-full border-collapse table-fixed mb-0.5 text-[10px] money-items"
         :class="{ 'hide-adjust': hideAdjustOnPrint }">
    <colgroup>
      <!-- Left 50%: No. + Item + Brand + Item Description -->
      <col style="width:3%" />
      <col style="width:5%" />
      <col style="width:8%" />
      <col />
      <!-- Right 50%: Qty + Unit + Unit Price + Disc + Net Price + Amount + Margin + Delete -->
      <col style="width:7%" />
      <col style="width:7%" />
      <col style="width:10%" />
      <col :class="hideAdjustOnPrint ? 'no-print' : ''" style="width:6%" />
      <col :class="hideAdjustOnPrint ? 'no-print' : ''" style="width:11%" />
      <col style="width:12%" />
      <col class="no-print" style="width:5%" />
      <col class="no-print" style="width:3%" />
    </colgroup>
    <thead>
      <tr>
        <th :class="TH">No.</th>
        <th :class="TH">Item</th>
        <th :class="TH">Brand</th>
        <th :class="TH">Item Description</th>
        <th :class="TH">Qty</th>
        <th :class="TH">Unit</th>
        <th :class="TH">Unit Price</th>
        <th :class="[TH, hideAdjustOnPrint && 'no-print']">Disc</th>
        <th :class="[TH, hideAdjustOnPrint && 'no-print']">Net Price</th>
        <th :class="TH">Amount</th>
        <th :class="TH" class="no-print">Margin</th>
        <th class="no-print bg-navy border border-[#3a5a8a]" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(it, i) in items" :key="i" :class="i % 2 === 1 ? 'bg-paleblue' : 'bg-white'">
        <td :class="TD" class="text-center text-[#aaa]">{{ i + 1 }}</td>
        <td :class="TD">
          <span v-if="products" class="block text-left text-navy">{{ it.itemType }}</span>
          <FieldInput v-else v-model="it.itemType" />
        </td>
        <td :class="TD">
          <span v-if="products" class="block text-left text-navy">{{ it.brand }}</span>
          <FieldInput v-else v-model="it.brand" />
        </td>
        <td :class="TD">
          <!-- products 전달 시: 인라인 자동완성. 아니면 일반 입력 -->
          <div v-if="products" class="relative">
            <input
              class="field-input w-full bg-transparent border-0 outline-none p-0 m-0 text-inherit leading-snug text-left"
              :value="it.desc"
              autocomplete="off"
              placeholder="Input keyword, select product…"
              @input="it.desc = ($event.target as HTMLInputElement).value; openAc(i)"
              @focus="openAc(i)"
              @blur="closeAc"
              @keydown="onDescKeydown(i, $event)"
            />
            <ul v-if="acRow === i && suggestions.length"
                class="no-print absolute z-30 left-0 mt-1 min-w-65 max-w-110 bg-white
                       border border-[#ddd] rounded-lg shadow-xl max-h-64 overflow-y-auto text-left">
              <li v-for="(p, si) in suggestions" :key="p.id"
                  class="flex items-center justify-between gap-2 px-2.5 py-1.5 cursor-pointer
                         border-b border-[#f0f0f0] last:border-0"
                  :class="si === acHi ? 'bg-paleblue/70' : 'hover:bg-paleblue/40'"
                  @mousedown.prevent="pick(i, p)">
                <span class="min-w-0">
                  <span class="block text-[11px] text-navy font-medium truncate">{{ p.description }}</span>
                  <span class="block text-[9px] text-[#888]">
                    {{ p.brand }}<span v-if="p.sku" class="text-[#ccc]"> · </span><span class="font-mono">{{ p.sku }}</span>
                  </span>
                </span>
                <span class="text-[9px] font-mono text-midblue whitespace-nowrap shrink-0">{{ priceLabel(p) }}</span>
              </li>
            </ul>
          </div>
          <FieldInput v-else v-model="it.desc" placeholder="Input keyword, select product…" />
        </td>
        <td :class="TD"><FieldInput v-model="it.qty" align="center" format-number /></td>
        <td :class="TD">
          <select v-if="products"
            v-model="it.unit"
            class="unit-select field-input w-full bg-transparent border-0 outline-none my-0 ml-0 pl-2 pr-4 text-inherit text-center leading-snug cursor-pointer"
            @change="onUnitChange?.(i)">
            <option value="pcs">pcs</option>
            <option value="set">set</option>
          </select>
          <FieldInput v-else v-model="it.unit" align="center" />
        </td>
        <td :class="TD">
          <!-- 화면: Unit Price (출력 시 Disc/Net 숨김 모드면 숨기고 아래 Net 단가 표시) -->
          <span v-if="products" class="block text-right text-navy" :class="{ 'no-print': hideAdjustOnPrint }">
            {{ it.unitPrice ? formatMoney(Math.round(num(it.unitPrice))) : '' }}
          </span>
          <FieldInput v-else v-model="it.unitPrice" align="right" format-number
            :class="hideAdjustOnPrint ? 'no-print' : ''" />
          <!-- 출력 전용: Net Price(할인 반영 단가) 값 -->
          <span v-if="hideAdjustOnPrint" class="print-only text-right text-navy">
            {{ lineNetUnit(it) ? formatMoney(Math.round(lineNetUnit(it))) : '' }}
          </span>
        </td>
        <td :class="[TD, hideAdjustOnPrint && 'no-print']">
          <div class="flex items-center justify-center gap-0.5">
            <FieldInput v-model="it.discPct" align="center" max="100" auto-size />
            <span class="text-[#888] shrink-0">%</span>
          </div>
        </td>
        <td :class="[TD, 'text-navy', hideAdjustOnPrint && 'no-print']">
          <!-- Net Price: 천단위 콤마 표시(FieldInput). 입력 시 Unit Price 동기화(할인 0). -->
          <FieldInput v-if="products"
            :model-value="lineNetUnit(it) ? formatMoney(Math.round(lineNetUnit(it))) : ''"
            align="right" format-number placeholder="0"
            @update:model-value="onNetPriceChange(it, $event)"
          />
          <span v-else class="block text-right">{{ fmtOrDash(Math.round(lineNetUnit(it))) }}</span>
        </td>
        <td :class="TD" class="text-right font-medium text-navy">{{ fmtOrDash(Math.round(lineNet(it))) }}</td>
        <td :class="TD" class="no-print text-center">
          <!-- products(견적) 모드: 마진 자동계산. 그 외: 자유 메모 -->
          <template v-if="products">
            <!-- showMargin=false(Distributor/End-user): 마진율 미표시 -->
            <span v-if="pricePolicy && !pricePolicy.showMargin" class="text-[#ddd]">—</span>
            <span v-else class="font-medium tabular-nums"
                  :class="lineMargin(it) === null ? 'text-[#bbb]'
                    : lineMargin(it)! >= 5 ? 'text-green-600'
                    : lineMargin(it)! >= 0 ? 'text-yellow-600' : 'text-red-500'">
              {{ lineMargin(it) === null ? '–' : lineMargin(it)!.toFixed(1) + '%' }}
            </span>
          </template>
          <textarea
            v-else
            v-model="it.margin"
            rows="1"
            class="field-input w-full resize-none outline-none text-[10px] leading-snug"
          />
        </td>
        <td class="no-print border border-[#ddd] text-center align-middle"
            :class="i % 2 === 1 ? 'bg-paleblue' : 'bg-white'">
          <button
            type="button"
            class="text-[#bbb] hover:text-red-500 transition-colors leading-none px-1 cursor-pointer"
            title="행 삭제"
            @click="onRemoveRow(i)"
          >×</button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="bg-graybg">
        <td colspan="4" class="border border-[#ddd] text-navy font-semibold px-2.5 py-1 text-right">
          Sub-Total
        </td>
        <td class="border border-[#ddd] text-navy font-semibold px-1.5 py-1 text-center">
          {{ fmtOrDash(sumQty) }}
        </td>
        <!-- Unit + Unit Price -->
        <td colspan="2" class="border border-[#ddd]" />
        <!-- Disc · Net Price (인쇄 시 숨김 — 컬럼별 셀로 분리해 colspan 어긋남 방지) -->
        <td :class="['border border-[#ddd]', hideAdjustOnPrint && 'no-print']" />
        <td :class="['border border-[#ddd]', hideAdjustOnPrint && 'no-print']" />
        <td class="border border-[#ddd] text-navy font-semibold px-2 py-1 text-right">
          {{ fmtOrDash(Math.round(sumAmount)) }}
        </td>
        <td colspan="2" class="no-print border border-[#ddd]" />
      </tr>
    </tfoot>
  </table>

  <div class="no-print mb-0.5">
    <button
      type="button"
      class="text-[11px] text-midblue font-semibold border border-midblue rounded px-3 py-1
             hover:bg-midblue hover:text-white transition-colors cursor-pointer"
      @click="onAddRow"
    >+ Add Line</button>
  </div>
</template>

<style scoped>
/* Unit select: 네이티브 화살표 제거 + 50% 축소된 커스텀 화살표 */
.unit-select {
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%23888888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.5 4.5L6 8l3.5-3.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 2px center;
  background-size: 7px 7px;
}
</style>
