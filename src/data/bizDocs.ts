// ─── Biz Form 문서 유형 메타데이터 ───────────────────────────────────────────
// 네비바 드롭다운(App.vue)과 BizForms 가 공유. 컴포넌트 매핑은 BizForms 가 별도 보유
// (App 청크에 무거운 문서 뷰가 끌려오지 않도록 분리).
export interface BizDoc {
  id: string;     // /biz?doc=<id>
  label: string;
  short: string;
}

export const BIZ_DOCS: BizDoc[] = [
  { id: 'qt', label: 'Quotation',          short: 'QT' },
  { id: 'po', label: 'Purchasing Order',   short: 'PO' },
  { id: 'pi', label: 'Proforma Invoice',   short: 'PI' },
  { id: 'ci', label: 'Commercial Invoice', short: 'CI' },
  { id: 'pl', label: 'Packing List',       short: 'PL' },
];

/** 유효한 문서 id 인지 검사 (쿼리 파라미터 검증용) */
export function isBizDoc(id: string): boolean {
  return BIZ_DOCS.some((d) => d.id === id);
}
