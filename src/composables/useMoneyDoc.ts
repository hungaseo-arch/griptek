import { reactive, computed, type ComputedRef } from 'vue';
import {
  emptyMoneyItem, lineGross, lineDiscount, lineNet, lineTax, lineTotal,
  num, type MoneyItem,
} from '@/utils/calc';

export interface MoneyDoc {
  items: MoneyItem[];
  sumQty: ComputedRef<number>;
  sumGross: ComputedRef<number>;
  sumDiscount: ComputedRef<number>;
  sumNet: ComputedRef<number>;
  sumTax: ComputedRef<number>;
  sumTotal: ComputedRef<number>;
  grandTotal: (...extras: (string | number)[]) => number;
  addRow: () => void;
  removeRow: (index: number) => void;
}

/**
 * 금액형 문서(PO / PI / CI / QT)의 품목 상태 + 자동 합계.
 * React 원본의 "빈 칸" 테이블을 입력 가능 + 실시간 계산으로 개선.
 *
 * @param count    초기 행 수 (PO/PI/CI=10, QT=12)
 * @param withTax  세금 컬럼 사용 여부 (CI=false)
 * @param defaultTax 세율 기본값 (PI/QT='11')
 */
export function useMoneyDoc(count: number, withTax: boolean, defaultTax = ''): MoneyDoc {
  const items = reactive<MoneyItem[]>(
    Array.from({ length: count }, () => emptyMoneyItem(defaultTax)),
  );

  const sumQty      = computed(() => items.reduce((s, it) => s + num(it.qty), 0));
  const sumGross    = computed(() => items.reduce((s, it) => s + lineGross(it), 0));
  const sumDiscount = computed(() => items.reduce((s, it) => s + lineDiscount(it), 0));
  const sumNet      = computed(() => items.reduce((s, it) => s + lineNet(it), 0));
  const sumTax      = computed(() => items.reduce((s, it) => s + lineTax(it, withTax), 0));
  const sumTotal    = computed(() => items.reduce((s, it) => s + lineTotal(it, withTax), 0));

  function grandTotal(...extras: (string | number)[]): number {
    const base = sumGross.value - sumDiscount.value + sumTax.value;
    return base + extras.reduce<number>((s, e) => s + num(e), 0);
  }

  function addRow(): void {
    items.push(emptyMoneyItem(defaultTax));
  }

  function removeRow(index: number): void {
    if (items.length > 1) items.splice(index, 1);
  }

  return { items, sumQty, sumGross, sumDiscount, sumNet, sumTax, sumTotal, grandTotal, addRow, removeRow };
}
