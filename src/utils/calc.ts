// ─── 문서 번호 생성 ────────────────────────────────────────────────────────────

/** 오늘 날짜 기준 문서 번호 생성 — 형식: PREFIX-DDMMYYYY-seq */
export function todayDocNo(prefix: string, seq = '01'): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${prefix}-${dd}${mm}${yyyy}-${seq}`;
}

// ─── 금액 계산 유틸리티 (Calculation / Perhitungan) ──────────────────────────
// 입력 가능한 폼의 자동 계산 로직. 모든 입력값은 문자열로 저장하고
// 계산 시점에 num() 으로 안전하게 파싱한다.

/** 문자열/숫자 입력을 안전하게 number 로 변환. 빈값·NaN 은 0. */
export function num(v: string | number | null | undefined): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const n = parseFloat(String(v ?? '').replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : 0;
}

/** 금액 표시 포맷 — 영문 체계, 천단위 콤마, 소수점 최대 2자리. */
export function formatMoney(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

/** 0이면 '–', 아니면 formatMoney. */
export function fmtOrDash(n: number): string {
  return n === 0 ? '–' : formatMoney(n);
}

/** 금액 품목 한 줄의 데이터 모델. 모든 필드는 문자열(입력값). */
export interface MoneyItem {
  itemType: string;   // Item 컬럼 (Type)
  brand: string;      // Brand 컬럼
  desc: string;       // Item Description
  desc2: string;      // 예비 필드 (하위 호환)
  qty: string;
  unit: string;
  unitPrice: string;
  discPct: string;
  taxPct: string;
  margin: string;     // Margin %
}

/** 빈 MoneyItem 생성. */
export function emptyMoneyItem(defaultTax = ''): MoneyItem {
  return { itemType: '', brand: '', desc: '', desc2: '', qty: '', unit: '', unitPrice: '', discPct: '', taxPct: defaultTax, margin: '' };
}

/** 할인 적용 후 단가 = unitPrice × (1 − discPct%) */
export function lineNetUnit(it: MoneyItem): number {
  return num(it.unitPrice) * (1 - num(it.discPct) / 100);
}

/** 라인 총액(할인 전) = 수량 × 단가 */
export function lineGross(it: MoneyItem): number {
  return num(it.qty) * num(it.unitPrice);
}

/** 라인 할인액 = 총액 × 할인율% */
export function lineDiscount(it: MoneyItem): number {
  return lineGross(it) * num(it.discPct) / 100;
}

/** 라인 순액(할인 후) = 총액 − 할인액 */
export function lineNet(it: MoneyItem): number {
  return lineGross(it) - lineDiscount(it);
}

/** 라인 세액 = 순액 × 세율% (withTax=false 시 0) */
export function lineTax(it: MoneyItem, withTax: boolean): number {
  return withTax ? lineNet(it) * num(it.taxPct) / 100 : 0;
}

/** 라인 최종액 = 순액 + 세액 (테이블 'Total' 컬럼에 표시) */
export function lineTotal(it: MoneyItem, withTax: boolean): number {
  return lineNet(it) + lineTax(it, withTax);
}

/** 패킹리스트 한 줄의 데이터 모델. */
export interface PackingItem {
  desc: string;
  marks: string;
  pkgs: string;
  pkgType: string;
  netWt: string;
  grossWt: string;
  dims: string;
  cbm: string;
}

/** 빈 PackingItem 생성. */
export function emptyPackingItem(): PackingItem {
  return { desc: '', marks: '', pkgs: '', pkgType: '', netWt: '', grossWt: '', dims: '', cbm: '' };
}
