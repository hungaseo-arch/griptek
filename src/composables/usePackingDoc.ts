import { reactive, computed, type ComputedRef } from 'vue';
import { emptyPackingItem, num, type PackingItem } from '@/utils/calc';

export interface PackingDoc {
  items: PackingItem[];
  totalPkgs: ComputedRef<number>;
  totalNetWt: ComputedRef<number>;
  totalGrossWt: ComputedRef<number>;
  totalCbm: ComputedRef<number>;
  addRow: () => void;
  removeRow: (index: number) => void;
}

/**
 * 패킹 리스트(PL)의 품목 상태 + 자동 합계.
 * 무게·부피 컬럼을 입력 가능 + 하단 TOTAL 행 실시간 집계로 개선.
 *
 * @param count 초기 행 수 (PL=10)
 */
export function usePackingDoc(count: number): PackingDoc {
  const items = reactive<PackingItem[]>(
    Array.from({ length: count }, () => emptyPackingItem()),
  );

  const totalPkgs    = computed(() => items.reduce((s, it) => s + num(it.pkgs), 0));
  const totalNetWt   = computed(() => items.reduce((s, it) => s + num(it.netWt), 0));
  const totalGrossWt = computed(() => items.reduce((s, it) => s + num(it.grossWt), 0));
  const totalCbm     = computed(() => items.reduce((s, it) => s + num(it.cbm), 0));

  function addRow(): void {
    items.push(emptyPackingItem());
  }

  function removeRow(index: number): void {
    if (items.length > 1) items.splice(index, 1);
  }

  return { items, totalPkgs, totalNetWt, totalGrossWt, totalCbm, addRow, removeRow };
}
