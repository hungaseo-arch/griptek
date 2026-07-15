# GRIPTEK Business Forms · React → Vue 3 마이그레이션 노트

> 마이그레이션 일자: 2026-05-22
> 원본: `GRIPTEK_current/` (React 19 + 단일 `App.tsx` 747줄 + 인라인 스타일)
> 산출물: `GRIPTEK_vue/` (Vue 3 SFC + 컴포넌트 분리 + TailwindCSS 클래스)

마이그레이션 결정 사항 — ① 인라인 스타일 → **전체 Tailwind 클래스 변환**,
② 단일 파일 → **컴포넌트 분리**, ③ 빈 양식 → **입력 가능 폼 + 자동 계산**.

---

## 1. 의존성 매핑 (Library mapping)

| 영역 | React (AS-IS) | Vue (TO-BE) | 비고 |
|------|---------------|-------------|------|
| 프레임워크 | `react@19` + `react-dom` | `vue@3.5` | Composition API + `<script setup>` |
| 빌드 플러그인 | `@vitejs/plugin-react-swc` | `@vitejs/plugin-vue` | Vite 5 공통 |
| 상태 | `useState` (탭 1개) | `ref` / `reactive` / composables | 외부 라이브러리 불필요 |
| 스타일 | 인라인 `style={{}}` 객체 | TailwindCSS v4 유틸리티 클래스 | §3 참조 |
| 비주얼 태깅 | `lovable-tagger` | (제거) | React 전용 에디터 플러그인 |

---

## 2. 파일별 매핑 (File mapping)

원본 `App.tsx` 747줄(단일 파일)을 역할별로 분해했습니다.

| React 원본 (App.tsx 내부) | Vue 산출물 | 비고 |
|---------------------------|-----------|------|
| `CO` / `BANK` / `TC` 상수 | `src/data/company.ts` | `PI_TERMS` 추가 분리 |
| `D/M/L/G/GR/PA/BD` 디자인 토큰 | `src/style.css` `@theme` | CSS 변수 + Tailwind 컬러 |
| `s` 스타일 헬퍼 객체 | 각 컴포넌트의 Tailwind 클래스 | §3 변환표 |
| `CoLeft()` | `components/CompanyHeader.vue` | |
| `DocTitle()` | `components/DocTitleBlock.vue` | 메타 행 입력 가능화 |
| `GoldBar()` | `components/GoldBar.vue` | |
| `SigBlock()` | `components/SigBlock.vue` | |
| `FooterNote()` | `components/FooterNote.vue` | |
| `InfoGrid()` | `components/InfoGrid.vue` | 값 입력 가능화 |
| `Summary()` | `components/SummaryRow.vue` | 행 단위로 재설계 + 자동계산 |
| 인라인 Vendor/ShipTo 등 2열 블록 | `components/PartyBlock.vue` | 신규 추출 |
| 인라인 품목 `<table>` (PO/PI/CI/QT) | `components/MoneyItemsTable.vue` | 신규 추출 + 라인 계산 |
| 인라인 품목 `<table>` (PL) | `components/PackingItemsTable.vue` | 신규 추출 + TOTAL 집계 |
| `s.secHdr` div 사용처 | `components/SectionHeader.vue` | |
| PI 약관 `<table>` | `components/TermsList.vue` | |
| `s.page` 래퍼 | `components/DocPage.vue` | A4 페이지 |
| `PurchasingOrder()` | `views/PurchasingOrder.vue` | |
| `ProformaInvoice()` | `views/ProformaInvoice.vue` | |
| `CommercialInvoice()` | `views/CommercialInvoice.vue` | |
| `PackingList()` | `views/PackingList.vue` | |
| `Quotation()` | `views/Quotation.vue` | |
| `App()` 탭바 + 인쇄 | `App.vue` | |
| `useState` 폼 없음 | `composables/useMoneyDoc.ts`, `usePackingDoc.ts` | 신규 — 자동계산 |

---

## 3. 인라인 스타일 → Tailwind 변환표

원본 `s` 헬퍼 객체의 주요 스타일을 Tailwind v4 클래스로 1:1 변환했습니다.

| 원본 (App.tsx) | Tailwind 클래스 |
|----------------|-----------------|
| `s.page` (width 794, minHeight 1123, padding 30/34, shadow) | `w-[794px] min-h-[1123px] px-[34px] py-[30px] shadow-[0_4px_24px_rgba(0,0,0,0.14)]` |
| `s.th()` (bg D, 9px, border #3a5a8a) | `bg-navy text-white text-[9px] border border-[#3a5a8a] px-[4px] py-[6px]` |
| `s.td()` (border #ddd, 10px, align top) | `border border-[#ddd] text-[10px] px-[5px] py-[5px] align-top` |
| `s.lbl` (bg GR, navy, 9px bold) | `bg-graybg text-navy font-bold text-[9px] border border-[#ddd]` |
| `s.val` (borderBottom #ddd) | `border-b border-[#ddd] px-2 py-1 text-[10px]` |
| `s.secHdr()` (bg M, white, 10px) | `bg-midblue text-white font-bold text-[10px] px-2.5 py-[5px]` |
| `s.sumLbl(grand)` | `bg-graybg/bg-navy text-navy/text-white font-semibold/font-bold` |
| `s.sumVal(grand)` | `bg-white/bg-gold border border-[#ddd] text-right` |
| `GoldBar` (height 4, bg G) | `h-[4px] bg-gold mb-[14px]` |

**디자인 토큰 (`@theme` in `src/style.css`)**

| 원본 상수 | HEX | Tailwind 컬러 |
|-----------|-----|--------------|
| `D` dark navy | `#1F3864` | `navy` |
| `M` mid blue | `#2E75B6` | `midblue` |
| `L` light blue | `#BDD7EE` | `lightblue` |
| `G` gold | `#C9A227` | `gold` |
| `GR` gray bg | `#f2f2f2` | `graybg` |
| `PA` pale blue | `#DDEEFF` | `paleblue` |

> 정밀 픽셀값(9px, 794px 등)과 비표준 HEX(`#ddd`, `#3a5a8a`, `#aaa`)는
> Tailwind v4 의 arbitrary value(`text-[9px]`, `border-[#ddd]`)로 정확히 보존했습니다.

---

## 4. 패턴 변환 치트시트

| React | Vue (`<script setup>`) |
|-------|------------------------|
| `const [v,setV] = useState('')` | `const v = ref('')` |
| `style={{ color:D }}` | `class="text-navy"` (또는 동적값은 `:style`) |
| `onClick={fn}` | `@click="fn"` |
| `{cond && <X/>}` | `<X v-if="cond" />` |
| `arr.map(x => <Row .../>)` | `<Row v-for="x in arr" :key="..." />` |
| `<input value=.. onChange=..>` | `<FieldInput v-model="..">` |
| props `{ a, b }: Props` | `defineProps<Props>()` |
| `window.print()` | 동일 (`@click="printDoc"`) |

---

## 5. 의도적 제외 / 변경 (Not migrated)

| 항목 | 이유 |
|------|------|
| `lovable-tagger` (vite.config) | React 전용 비주얼 에디터 플러그인 — Vue 무관 |
| `index.html` 의 Skywork 추적 스크립트 3종 | 외부 빌더 주입 스크립트 — 마이그레이션 대상 아님 |
| `AGENTS.md` (lovable 안내 문서) | 원본 빌더 환경 전용. 본 `MIGRATION.md` / `README.md` 로 대체 |
| React 인라인 `<style>{@media print}` | `src/style.css` 의 `@media print` 로 이관 |

---

## 6. 마이그레이션으로 개선된 점

원본은 빈 칸을 인쇄 후 손으로 채우는 정적 템플릿이었으나, 사용자 요청에 따라 다음을 개선했습니다.

모든 칸이 입력 가능 필드(`FieldInput`)가 되었고, 품목 입력 시 라인 최종액·SUBTOTAL·세액·GRAND TOTAL 이 실시간 자동 계산됩니다. Packing List 의 무게·부피 컬럼도 하단 TOTAL 행에 자동 집계됩니다. 또한 747줄 단일 파일이 13개 공유 컴포넌트 + 5개 뷰로 분리되어 유지보수성이 크게 향상되었습니다.

---

## 7. 후속 작업 제안 (Next steps)

다음 항목은 마이그레이션 범위를 벗어나 별도 작업으로 권장합니다.

입력값 영속화(localStorage / 백엔드 저장), 품목 행 추가·삭제 버튼, 숫자 입력 시 천 단위 구분 표시, 양식 데이터 JSON 내보내기/불러오기, Packing List 의 InfoGrid "Total" 필드와 테이블 TOTAL 자동 연동, 다국어 UI(한국어/Bahasa Indonesia) 전환 등을 고려할 수 있습니다.

---

*문의: `README.md` 참조.*
