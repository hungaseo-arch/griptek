# 변경 이력 (CHANGELOG)

주요 변경 내용을 기록한다. (형식: 날짜별 · 카테고리별 요약)

---

## 2026-06-11

### 문서 번호 형식 변경 (전 문서)
- 번호 형식을 **`PREFIX-YYYYMMDD-ABBR-N`** 로 통일(`companyDocNo`). `ABBR`=회사명 첫 단어 앞 3글자(PT/CV 등 법인형태 제외, `companyAbbr`), `N`=1자리 일련번호.
- QT/PO/PI/CI/PL 모두 적용 + 회사명 입력 시 약어 자동 반영(불러올 땐 저장 번호 보존). 약어 기준 회사: QT=고객, PO=벤더, PI=Bill To, CI=Consignee, PL=Consignee. (미사용 `todayDocNo` 제거)

### 문서 저장 — localStorage → MySQL DB
- 문서(QT/PO/PI/CI/PL)를 **DB 저장**으로 전환: `documents` 테이블 + `/api/documents`(CRUD, 전부 JWT 인증). 프론트 `apiDocs.ts` 백엔드, `useDocManager` 기본 백엔드 = DB.
- 사업 데이터 보호를 위해 **로그인 필요** — `/biz` 액션레일에 공용 로그인(EmailLogin) 추가(모든 문서 유형 공유). `localDocs.ts`는 마이그레이션/폴백용으로 보존.

### Staff 단가 정책 — 마진 25%
- Staff의 Unit Price 추천을 **divisor 0.85(≈17.6%) → 1/1.25(마진 25%)** 로 변경. `roles.ts`·`roles.js` 동기화. (Staff는 클라이언트 계산이라 프론트 배포만으로 적용)

### 이메일 회원가입 (승인 대기제)
- API `POST /api/auth/signup` — 신규 계정을 **비활성(승인 대기)** 으로 생성(자동 로그인 안 함). 로그인은 `is_active=1`만 허용(대기 시 403).
- 관리자 승인: `GET /api/auth/pending`·`POST /api/auth/approve`(super_admin) 또는 phpMyAdmin `UPDATE`. `admin_users.is_active` 컬럼 추가.
- 프론트: `signUpWithEmail` 안내 메시지 반환, `EmailLogin` 로그인↔회원가입 토글 + "승인 후 로그인" 안내.

### 인쇄 — Unit Price 칸에 Net 단가 표시
- 출력 시 Disc·Net Price 컬럼은 숨겨지므로, **Unit Price 칸에 할인 반영된 Net 단가(`lineNetUnit`)** 를 표시 → Unit Price × Qty = Amount 일치. (화면은 정가 그대로) `print-only` 유틸 추가.

### 문서 저장 — 같은 번호면 업데이트(중복 방지)
- `POST /api/documents` 를 **종류+번호(파일명) 기준 upsert** 로 변경 → 같은 문서번호로 다시 저장하면 새 행이 아니라 기존 문서를 갱신. 중복 행 방지.
- 기존 중복 정리 + (선택) UNIQUE 제약 SQL: `griptek-api/sql/documents-dedup.sql`.

### 버그픽스 — 문서 불러오기 빈 폼 (MariaDB JSON)
- Rumahweb MariaDB는 `JSON` 컬럼(=LONGTEXT)을 **문자열**로 반환 → 불러올 때 `payload`가 문자열이라 폼이 안 채워지던 문제. 프론트(`apiDocs.get`)·서버(`documents.js`) 양쪽에서 문자열이면 `JSON.parse` 하도록 수정.

### PDF 저장 파일명 = 문서 명칭 (전 문서)
- `DocPage`가 `title` prop을 `document.title`로 설정 → PDF 저장 기본 파일명이 **문서 명칭**("Quotation - QT-20260626-ASC-1" 등)과 동일. 기존 PO/PI/CI/PL은 "Biz Form — CV GRIPTEK Solusi"로 나오던 문제 해결. QT의 개별 `pdfName` 로직 제거(중앙화).

### 회사명 정규화 — 'PT.'='PT', 'CV.'='CV'
- customers·vendors upsert 시 법인형태 접두어(PT/CV/UD/PD)의 **마침표 유무를 통일**(`normName`) → "PT. Ascendo"와 "PT Ascendo"를 **같은 회사로 인식**(중복 행 방지). (문서번호 약어 `companyAbbr`는 기존부터 점 무시)

### 벤더 — PO 저장 시 자동 누적 (고객과 동일 패턴)
- 벤더 API `POST /api/vendors` 를 **upsert(이름 기준)·로그인 허용**으로 변경(기존 super_admin INSERT). PO 저장 시 벤더 자동 누적.
- `useDocManager`에 `getVendor` 옵션 추가, `vendorsApi.upsertVendor`. → 고객·벤더 모두 문서 저장 시 자동 upsert.

### 구매고객(customers) DB 저장 + 자동입력
- `customers` 테이블(이름 UNIQUE) + `/api/customers`(목록 공개·upsert 로그인·관리 super_admin).
- **문서 저장 시 구매고객 자동 누적**(이름 기준 upsert) — `useDocManager`에 `getCustomer` 옵션 추가. QT/PI/CI/PL에서 고객 매핑.
- **고객 선택 자동입력**: `CustomerPicker` 드롭다운(QT/PI/CI/PL) → 회사·주소·연락처·전화·이메일·NPWP 자동입력. `customersApi.ts`·`useCustomers`.

### 벤더(공급사) 관리 + PO 자동입력
- `vendors` 테이블(MySQL) + `/api/vendors`(목록 공개·CRUD super_admin) 추가. 첫 벤더 `PT Ascendo Internasional` 시드(`griptek-api/sql/vendors.sql`).
- 프론트 `vendorsApi.ts` + **PO에 벤더 선택 드롭다운** → 선택 시 Vendor/Supplier(회사명·주소·City/State·전화·이메일) 자동입력.

### 인쇄 — Disc·Net Price 숨김 전 문서 적용
- PO·PI·CI 에도 `hide-adjust-on-print` 적용 → QT 포함 **네 문서 모두 인쇄 시 Disc·Net Price 컬럼 숨김**(화면엔 표시).

### 날짜 입력 — 달력 선택 + 오늘 기본값
- 모든 문서(QT/PO/PI/CI/PL)의 날짜 칸(Date/Valid Until/Required Date/Invoice Date 등)을 **달력 선택(`<input type="date">`)** 으로. `FieldInput`에 `type` 추가, DocTitleBlock·InfoGrid가 날짜 키 자동 감지.
- **Date 기본값 = 오늘**, QT Valid Until = 오늘+1개월(ISO). `calc.ts`에 `todayISO`/`addMonthsISO` 추가.
- 인쇄 시 달력 아이콘 숨김(날짜 텍스트만), 좁은 셀 폭 보호 CSS.

### 제품 추천 — PO/PI/CI 확대 + 중복 제거
- 제품 추천(Item Description autocomplete)이 Quotation에만 있던 것을 **PO·PI·CI에도 적용**.
- 로직을 컴포저블 `useProductPicker(items)` + 공용 컴포넌트 `ProductPickerBar.vue` 로 추출 → Quotation 리팩터(중복 ~80줄 제거), 네 문서가 동일 로직 공유.

### SEO 검토 & 수정
- 메타 설명 전부 ≤155자로 단축(홈·카테고리 5·제품 9) — SERP 스니펫 잘림 방지.
- **브랜드 정합성 수정**: OTR 제목/설명/FAQ `TECHKING`→`ASCENDO/MAXAM`, Industri 설명 `TIRON`→`ASCENDO`(본문과 일치).
- 구조화 데이터 `Organization`→**`AutoPartsStore`**(지역 비즈니스): `image`·`priceRange`·`currenciesAccepted`·`openingHoursSpecification`·`@id` 추가 → 로컬 검색/리치결과 강화.
- sitemap·robots 점검(15개 라우트·슬러그 정상, 변경 없음).
- **OG 이미지 생성**: `public/og-image.png`(1200×630) — 로고·태그라인·브랜드·한국어. `scripts/make-og.mjs`(puppeteer, `npm run og`). index.html `og:image`/`twitter:image`/width·height·alt + 구조화 데이터 `image` 연결.

### 인프라 — Rumahweb MySQL + Express API 전환
- 통장 정보 입력(Account No./Name/Branch).
- **Express API 스캐폴딩** `griptek-api/`: `products`(역할별 가격·원가 분기·NULL 처리·천단위 절사) + 이메일 로그인 JWT + super_admin 쓰기 보호. `roles.js`는 프론트 `ROLE_POLICY`와 수치 동기화.
- `admin_users` 스키마(`sql/admin_users.sql`), 배포·전환 README.
- `.gitignore`: 마이그레이션 SQL(원가 포함)·API `.env`·node_modules 제외.
- **프론트 cutover 완료**: `asuraDb.ts`(이메일 로그인 → JWT localStorage)·`productsApi.ts`(`fetch /api/products`)를 Express API로 교체. 외부 DB 클라이언트 제거(인터페이스 유지로 Quotation/EmailLogin 무수정). `.env`에 `VITE_API_BASE` 추가. 회원가입은 API 미지원(관리자 생성).
- 버그픽스: 제품 추천(autocomplete)이 `description` NULL 제품에서 필터 예외로 전체 중단되던 문제 → null 가드(`Product.description: string|null`).
- 문서: 마이그레이션 실행 기록 `docs/migration-2026-06-11.md`(최종 구성·단계·트러블슈팅·TODO).

### 정리 — 외부 DB 의존성 제거 & 미사용 코드 최적화
- 외부 DB 클라이언트 의존성 제거 → **BizForms 청크 262kB→54kB** 로 급감(번들 경량화).
- 미사용 devDependency 제거: `ftp-deploy`, `gh-pages`(배포는 `basic-ftp` 사용).
- `.env`/`.env.example`/`env.d.ts` 에서 구 DB 환경변수 제거(→ `VITE_API_BASE`만).
- 미사용 코드 제거: `roles.ts`의 `canEdit`·`needsCost`, `asuraDb.ts`의 `signUpWithEmail`, `EmailLogin.vue` 회원가입 모드(로그인 전용으로 단순화).
- 코드/주석의 구 DB 잔재 전부 정리.
- 구식 외부 DB 전용 산출물(셋업 SQL·RLS 문서·구 마이그레이션 디렉터리) 삭제. `griptek-api`(README·package·라우트 주석) 문구 정리.

## 2026-06-10

### SEO · 다중 페이지
- `vue-router` 도입 — SPA 토글 → 실제 URL 분리, 라우트별 `<title>`/description/canonical/OG·H1.
- 제품 카테고리 랜딩 페이지 추가: `/ban-forklift`, `/ban-truk-bus`, `/ban-otr`, `/ban-industri`, `/ban-pertanian`.
- 개별 제품(규격) 상세페이지 추가: `/ban-otr/29-5r25` 등 9개 — 실제 카탈로그(브랜드·패턴·타입) 반영.
- 페이지별 구조화 데이터(Breadcrumb·FAQPage·Product), prerender 라우트·`sitemap.xml` 갱신.
- 홈: H1 추가, 지게차 섹션 요약화(중복 제거), 취급 브랜드 6종(ASCENDO/TECHKING/TIRON/MAXAM/DIAMOND/JK TYRE) 정확화.
- favicon(32/16/180) 추가.

### 네비게이션
- 상단 네비 드롭다운: Produk(카테고리+규격 중첩), Biz Form(문서 유형) — 호버/클릭 동작, z-index 충돌 수정.
- Biz Form 문서 선택을 네비 드롭다운 + URL 쿼리(`/biz?doc=`)로 관리. 탭 스트립 제거.

### 인증 · 권한 (AsuraDB)
- PIN 로그인 → **이메일 로그인 + 회원가입** 전환(`EmailLogin.vue`), 모달 닫기(X/배경) 추가.
- **역할 4단계**(`super_admin`/`staff`/`distributor`/`end_user`) — `src/lib/roles.ts` `ROLE_POLICY`.
  역할별 Unit Price 배수, 원가/마진 노출, 역할별 뷰 분기(`products`/`products_sell`).
- 역할은 보안상 `app_metadata.role`(관리자만 수정)에서 읽음.
- 견적 단가: super_admin Unit Price = **마진 30%**(= 원가×1.30), 천단위 **절사(floor)**. Net Price **콤마 표시**(FieldInput).
- 견적 단가 동기화: **Net Price 입력 시 Unit Price = Net Price**(할인 0) → Net=Unit, **Amount = Qty × Unit Price**(오차 없음).
- 견적 출력 간소화: **인쇄 시 Disc·Net Price 컬럼 숨김**(`hideAdjustOnPrint`) → 고객용 견적은 Unit Price·Amount 만.
- **인쇄 페이지네이션 수정**: `@page` 여백 0, `.doc-page` 자연 높이. 표 행 잘림 방지·머리글 반복·합계 1회.
- **인쇄 1페이지 보장**: 푸터를 `position: fixed`로 페이지 하단 고정(본문 높이에 더해지지 않음) → 짧은 내용은 여백 설정과 무관하게 1페이지. 출력 시 Disc·Net 숨긴 표 컬럼 폭 재배분(균형) + tfoot 셀을 컬럼별로 분리해 **Sub-Total 금액 표 밖 이탈 수정**.
- **PDF 파일명 = 문서명**: Quotation 저장 시 `document.title` = `Qt-<회사약어>-<DDMMYYYY>` (예: Qt-CT-10062026).
- 접근권한 셋업 SQL/문서 추가(이후 제거됨).

### 보안
- **Biz Form 직원 전용** — `.htaccess` HTTP Basic Auth(`/biz`), SPA 진입 풀 로드 유도, `robots` Disallow. → `docs/biz-basic-auth.md`.

### 코드 정리
- 중복 추출: `ContactCta.vue`, `ChevronMotif.vue`, `PHONE_TEL` 상수.

### 검증 메모
- 문서(견적서 등)는 **localStorage 저장**(서버 미저장). AsuraDB는 제품 가격 읽기 전용.
- AsuraDB = 외부 제품/역할 DB. RLS·마이그레이션은 그 프로젝트에서 실행.
