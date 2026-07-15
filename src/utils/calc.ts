// ─── 날짜 (date picker · YYYY-MM-DD) ──────────────────────────────────────────

/** 오늘 날짜 (로컬, YYYY-MM-DD) — `<input type="date">` 기본값용 */
export function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** 오늘 + months 개월 (로컬, YYYY-MM-DD) */
export function addMonthsISO(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// ─── 문서 번호 생성 ────────────────────────────────────────────────────────────

/** 문서 번호 — 형식: PREFIX-YYYYMMDD-ABBR-seq. 약어(회사명)가 빈 값이면 ABBR 구획을 생략. */
export function companyDocNo(prefix: string, abbr: string, seq = '1'): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const mid = abbr ? `${abbr}-` : '';
  return `${prefix}-${d.getFullYear()}${mm}${dd}-${mid}${seq}`;
}

/** 회사명 약어 — 법인형태(PT/CV/UD/PD) 접두어를 떼고 첫 단어의 앞 3글자(대문자). 'PT Ascendo Internasional' → 'ASC' */
export function companyAbbr(name: string): string {
  const cleaned = name.replace(/^(PT|CV|UD|PD)\.?\s+/i, '').trim();
  const first = cleaned.split(/\s+/)[0] ?? '';
  return first.slice(0, 3).toUpperCase();
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
  whPrice: string;    // 입고가(원가) — 제품 불러올 때 채워짐. Margin 자동계산용.
  unitPrice: string;
  discPct: string;
  taxPct: string;
  margin: string;     // Margin % (자동계산 표시값, 하위 호환 위해 유지)
  productSku: string; // 연결된 제품 SKU — Unit(pcs/set) 변경 시 재가격 산정용.
}

/** 빈 MoneyItem 생성. */
export function emptyMoneyItem(defaultTax = ''): MoneyItem {
  return { itemType: '', brand: '', desc: '', desc2: '', qty: '', unit: '', whPrice: '', unitPrice: '', discPct: '', taxPct: defaultTax, margin: '', productSku: '' };
}

/** 라인 마진율(%) = (할인후 단가 − 입고가) / 입고가 × 100. 입고가/단가 없으면 null. */
export function lineMargin(it: MoneyItem): number | null {
  const wh = num(it.whPrice);
  if (!wh || !num(it.unitPrice)) return null;
  return ((lineNetUnit(it) - wh) / wh) * 100;
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
