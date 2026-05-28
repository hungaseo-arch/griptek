# CV GRIPTEK Solusi — Business Document Forms (Vue 3)

> React 19 단일 파일 앱 → **Vue 3 + TailwindCSS** 마이그레이션 완료본
> 5종 비즈니스 양식(Purchasing Order, Proforma Invoice, Commercial Invoice, Packing List, Quotation)을
> 탭으로 전환하며, 입력 가능 + 합계 자동 계산 + 인쇄/PDF 저장을 지원합니다.

---

## 1. 빠른 시작 (Quick start / Mulai cepat)

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드 (vue-tsc 타입검사 + vite build)
npm run preview    # 빌드 결과 미리보기
npm run type-check # 타입 검사만 실행
```

---

## 2. 기술 스택 (Stack / Tumpukan)

| 레이어 | 라이브러리 | 메모 |
|--------|----------|------|
| Framework | Vue 3.5 (`<script setup lang="ts">`) | Composition API 전용 |
| 빌드 도구 | Vite 5 + `@vitejs/plugin-vue` | React SWC 대체 |
| 언어 | TypeScript 5.5 + `vue-tsc` | strict 모드 |
| 스타일 | TailwindCSS v4 + `@tailwindcss/vite` | **인라인 스타일 100% → 유틸리티 클래스 변환** |
| 상태 | Vue `reactive` / `ref` + composables | 외부 상태 라이브러리 불필요 |

추가 런타임 의존성은 `vue` 단 하나입니다 (경량 유지).

---

## 3. 폴더 구조 (Struktur folder)

```
GRIPTEK_vue/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig*.json
├── README.md            ← 본 문서
├── MIGRATION.md         ← React → Vue 상세 매핑
└── src/
    ├── main.ts                          엔트리
    ├── App.vue                          탭바 + 인쇄 버튼 + 문서 영역
    ├── style.css                        Tailwind v4 + @theme 브랜드 컬러 + 인쇄 CSS
    ├── env.d.ts
    ├── data/
    │   └── company.ts                   회사 정보(CO) · 은행(BANK) · 약관(TC, PI_TERMS)
    ├── utils/
    │   └── calc.ts                      금액 계산·포맷 유틸 + 데이터 모델
    ├── composables/
    │   ├── useMoneyDoc.ts               금액형 문서 품목 상태 + 자동 합계
    │   └── usePackingDoc.ts             패킹리스트 품목 상태 + 무게/부피 집계
    ├── components/
    │   ├── ui/FieldInput.vue            셀 입력 필드 (테두리 없는 input)
    │   ├── DocPage.vue                  A4 페이지 래퍼 (794×1123)
    │   ├── CompanyHeader.vue            헤더 좌측 회사 블록
    │   ├── DocTitleBlock.vue            헤더 우측 제목 + 메타
    │   ├── GoldBar.vue / SectionHeader.vue / FooterNote.vue
    │   ├── InfoGrid.vue                 라벨/값 2열 그리드
    │   ├── PartyBlock.vue               거래처 2열 블록
    │   ├── MoneyItemsTable.vue          금액 품목 테이블 (라인 총액 자동계산)
    │   ├── PackingItemsTable.vue        패킹 품목 테이블 (TOTAL 자동집계)
    │   ├── SummaryRow.vue               합계 표 한 행
    │   ├── SigBlock.vue                 서명/승인 블록
    │   └── TermsList.vue                약관 목록
    └── views/
        ├── PurchasingOrder.vue          PO — Purchasing Order
        ├── ProformaInvoice.vue          PI — Proforma Invoice
        ├── CommercialInvoice.vue        CI — Commercial Invoice
        ├── PackingList.vue              PL — Packing List
        └── Quotation.vue                QT — Quotation
```

---

## 4. 추가된 기능 — 입력 가능 폼 + 자동 계산

React 원본은 "빈 칸"을 인쇄 후 수기 작성하는 정적 템플릿이었습니다. 이번 마이그레이션에서
모든 칸을 **입력 가능 필드**로 전환하고 다음 자동 계산을 추가했습니다.

**1단계 — 라인 계산 (per-row)**

각 품목 행은 입력 즉시 라인 최종액을 계산합니다.

`라인 총액 = 수량 × 단가` → `할인액 = 총액 × 할인%` → `순액 = 총액 − 할인액` → `세액 = 순액 × 세율%` → `라인 최종액 = 순액 + 세액`

**2단계 — 문서 합계 (summary)**

`SUBTOTAL`, `DISCOUNT`, `TAX/VAT` 는 전 품목을 합산해 자동 표시됩니다. `SHIPPING`, `FREIGHT`, `OTHER CHARGES` 만 직접 입력하며, `GRAND TOTAL` 은 이를 모두 반영해 실시간 갱신됩니다.

**3단계 — 패킹리스트 집계**

Packing List 의 No. of Pkgs / Net Wt / Gross Wt / CBM 컬럼은 하단 `TOTAL` 행에 자동 합산됩니다.

계산 로직은 전부 `src/utils/calc.ts` 와 `src/composables/` 에 모여 있어 수정·검증이 쉽습니다.

---

## 5. 인쇄 / PDF 저장

상단 **🖨️ Print / Save PDF** 버튼 또는 `Ctrl/Cmd + P`. `@media print` 규칙(`src/style.css`)이 상단 바·탭 바를 숨기고 A4 세로 여백 8mm로 출력합니다. 입력한 값은 그대로 인쇄되며, placeholder 안내문구는 인쇄 시 자동으로 숨겨집니다.

---

## 6. 회사 정보 수정

회사명·주소·담당자(PIC)·은행 정보·약관은 `src/data/company.ts` 한 곳에서 관리합니다. 값을 바꾸면 5개 양식 전체에 즉시 반영됩니다.

---

*마이그레이션 일자: 2026-05-22 · 작업자: ASURA*
# griptek
