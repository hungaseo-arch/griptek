# griptek-api — Express API (products + auth)

`products` 읽기/쓰기 + 이메일 로그인(JWT) + 역할별 가격을 제공한다.
MySQL(Rumahweb cPanel) 기반. 역할별로 원가/판매가를 분기해 응답한다.

## 엔드포인트
| Method | Path | 권한 | 설명 |
|---|---|---|---|
| POST | `/api/auth/login` | 공개 | email+password → `{ token, role }` |
| GET  | `/api/products` | 로그인 | 역할별 가격. super_admin·staff=원가 포함, distributor·end_user=판매가만(`unit_price`, 원가 미전송) |
| POST/PUT/DELETE | `/api/products[/:id]` | **super_admin** | 생성/수정/소프트삭제 |
| GET | `/api/health` | 공개 | 상태확인 |

역할 정책(divisor·원가노출)은 `roles.js` — **프론트 `src/lib/roles.ts` 의 `ROLE_POLICY` 와 수치 일치 유지**.

## 로컬 실행
```bash
cd griptek-api
cp .env.example .env   # 값 채우기
npm install
npm start              # http://localhost:8080/api/health
```

## DB 준비 (phpMyAdmin)
1. `products` — 마이그레이션 SQL(원가 포함, **커밋 금지**) import.
2. `sql/admin_users.sql` 실행 → 관리자 계정 생성:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('비밀번호',10))"
   ```
   해시를 `admin_users` INSERT 에 넣어 `super_admin` 계정 1개 생성.

## cPanel 배포 (Setup Node.js App)
1. **Setup Node.js App** → Create: Node 18+, Application root = `griptek-api`, startup file = `app.js`.
2. File Manager 로 코드 업로드(`node_modules` 제외).
3. `.env` 작성(DB 자격증명·JWT_SECRET·CORS_ORIGIN).
4. Terminal에서 가상환경 진입 후 `npm install`.
5. **Restart**(코드/.env 변경 시마다).
6. `https://api.gripteksolusi.com/api/health` 확인.

## 프론트 연동 (완료)
프론트는 이 API에 연결돼 있다:
- `src/lib/productsApi.ts` → `fetch(`${VITE_API_BASE}/api/products`, { headers:{ Authorization:`Bearer ${token}` }})`. 반환 형태는 `Product`(wh_price? / unit_price?).
- `src/lib/asuraDb.ts` / `EmailLogin.vue` → `/api/auth/login` 로그인, 토큰 localStorage 보관.
- `.env`: `VITE_API_BASE`.

## 보안 메모
- `.env`·마이그레이션 SQL(원가 포함)은 **git 커밋 금지**(.gitignore 처리됨).
- 원가(`wh_price`)는 `needsCost` 역할(super_admin·staff)에게만 응답에 포함된다.
