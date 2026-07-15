# 인프라 마이그레이션 실행 기록 — 2026-06-11

기존 외부 DB(AsuraDB) → **Rumahweb cPanel(MySQL) + Express API** 로 제품/인증 이전 기록.
(권한/가격 정책: `src/lib/roles.ts` ↔ `griptek-api/roles.js`, API: `griptek-api/README.md`)

---

## 1. 최종 구성 (실제 값)

| 항목 | 값 |
|---|---|
| cPanel 계정 / 홈 | `gria4449` / `/home/gria4449` |
| MySQL DB | `gria4449_griptek_shop` |
| MySQL 사용자 | `gria4449_griptek_user` (비밀번호 별도 보관) |
| API 프로젝트 | `griptek-api` (Express, Node 18+) |
| API Application root | `/home/gria4449/griptek-api`, startup `app.js` |
| API URL | `https://api.gripteksolusi.com` (서브도메인) |
| 관리자 계정 | `admin@gripteksolusi.com` (role `super_admin`) — 비번 별도 보관, **운영 전 변경 권장** |
| 프론트 `.env` | `VITE_API_BASE=https://api.gripteksolusi.com` |
| API `.env` `CORS_ORIGIN` | `https://gripteksolusi.com,http://localhost:5173` |

> products 430건 이전 완료. `admin_users` 테이블로 로그인 관리.

## 2. 실행 단계 요약
1. **점검**: cPanel에 Setup Node.js App / phpMyAdmin / Terminal 확인(Node 18+).
2. **DB 생성**: MySQL Database Wizard로 `gria4449_griptek_shop` + 사용자 + ALL PRIVILEGES.
3. **테이블 import**: phpMyAdmin SQL 탭 → products(430건) + `griptek-api/sql/admin_users.sql`.
4. **API 배포**: 코드 zip 업로드 → Setup Node.js App 생성(root `griptek-api`, URL `api.gripteksolusi.com`, `app.js`) → `.env` 작성 → Run NPM Install → Restart → `/api/health` = `{"ok":true}`.
5. **관리자/인증**: Mac에서 bcrypt 해시 생성 → `admin_users` INSERT/UPDATE → `/api/auth/login` 로 JWT 발급 확인.
6. **프론트 cutover**: `src/lib/asuraDb.ts`(API 로그인·JWT), `src/lib/productsApi.ts`(`fetch /api/products`) 교체 + `VITE_API_BASE`.

## 3. 트러블슈팅 기록 (겪은 것 → 해결)
- **MySQL Databases 메뉴 없음** → `Databases` 섹션의 **MySQL Database Wizard** 사용.
- **서브도메인 생성 "must specify a subdomain"** → Domains → Create A New Domain 에 **전체 주소** `api.gripteksolusi.com` 입력.
- **npm install "An error occurred during installation of modules…"** → 실제로는 설치 성공. 뒤 메시지는 content-type/charset **양성 경고**. `/api/health` 로 구동 확인.
- **venv activate 경로 오류** (`/18/` 예시) → `ls /home/gria4449/nodevenv/griptek-api/` 로 실제 버전 폴더 확인. (해시 생성은 Mac에서 `npm i bcryptjs` 후 로컬 실행으로 대체)
- **해시 vs 평문 혼동** → 로그인 `password`엔 **평문**, DB엔 **bcrypt 해시**. 해시 새로 만들면 **UPDATE** 필수.
- **`{"error":"No token"}`** → 헤더는 `Authorization: Bearer <token>` (Bearer 접두사 필수).
- **SSL self-signed** → cPanel SSL/TLS Status → `api...` **Run AutoSSL** (운영/브라우저는 `-k` 불가).
- **CORS 차단(localhost:5173)** → API `.env` `CORS_ORIGIN`에 출처 추가 → **Restart**.
- **자동추천 안 뜸** → 일부 `description`이 NULL → 추천 필터 null 가드(`Product.description: string|null`).

## 4. 운영/유지보수 메모
- **코드·`.env` 변경 시** Setup Node.js App에서 **Restart** 필수.
- **역할 부여/변경**: `admin_users.role`(super_admin/staff/distributor/end_user) 수정 → 해당 사용자 **재로그인**(JWT 갱신).
- **가격 정책**: `griptek-api/roles.js` ↔ `src/lib/roles.ts` 의 divisor/노출을 **항상 동일하게** 유지. (super_admin·staff=원가 포함, distributor·end_user=판매가만·천단위 절사)
- **롤백**: 문제 시 git 이력에서 이전 배포로 되돌린다(외부 DB 의존성은 제거됨).

## 5. 남은 일 (TODO)
- [ ] **운영 배포** `npm run deploy` → `gripteksolusi.com`에서 로그인/제품 확인.
- [ ] `api.gripteksolusi.com` **AutoSSL 유효(🔒)** 확인.
- [ ] 관리자 비밀번호 **강한 값으로 변경**(해시→UPDATE).
- [ ] `wh_price` NULL 품목 원가 입력(선택) — 미입력 시 Unit Price 0.
- [ ] 자가 회원가입 필요 시 `POST /api/auth/signup`(end_user 생성) 추가.
- [x] 외부 DB 의존성·키 정리 완료(코드/설정/구식 문서 제거).
- [ ] (향후) `orders`/`order_items` 신규 기능.

## 6. 변경 기록 규칙
- 주요 변경은 **매번 `docs/CHANGELOG.md`** 에 날짜·카테고리별로 1줄 요약. (사소한 오타/포맷 제외)
