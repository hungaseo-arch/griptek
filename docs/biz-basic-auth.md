# Biz Form 직원 전용 — HTTP Basic 인증 설정

`/biz`(Biz Form)를 직원만 접근하도록 `.htaccess` HTTP Basic Auth 로 보호한다.

## 동작 방식
- **서버 보호**: `public/.htaccess` 의 `<If "%{REQUEST_URI} =~ m#^/biz(/|$)#">` 블록이
  `/biz` 및 하위 경로 요청에 **Basic 인증**(아이디/비밀번호)을 요구한다.
- **SPA 진입 갭 차단**: 앱 내부에서 "Biz Form" 메뉴를 클릭하면, `/biz` 밖에 있을 때는
  일반 링크(`<a href>`)로 **풀 페이지 로드**를 일으켜 서버 인증이 실제로 발동한다.
  (`/biz` 안에서는 RouterLink 로 클라이언트 전환 → 캐리포워드 유지)
- 직접 URL·새로고침·검색봇 접근도 모두 401 로 차단된다(robots 에도 `Disallow: /biz`).

> 참고: 제품 가격(AsuraDB)은 이메일 로그인+RLS 로 별도 보호된다. 이 Basic Auth 는
> **Biz Form 페이지 자체의 접근**을 직원으로 제한하는 추가 게이트다.

## 설정 절차 (1회)

### 1) `.htpasswd-biz` 파일 생성 (아이디/비밀번호)
셸이 있으면:
```bash
htpasswd -c .htpasswd-biz staff      # staff 계정 생성, 비번 입력
htpasswd    .htpasswd-biz manager     # 직원 추가(–c 없이)
```
셸이 없으면: **온라인 htpasswd 생성기**(bcrypt 또는 APR1-MD5)로
`staff:$apr1$....` 형태 한 줄을 만들어 `.htpasswd-biz` 파일에 저장.

### 2) 서버에 업로드 — `/home/gria4449/.htpasswd-biz`
- cPanel **File Manager** 또는 FTP 로 `.htpasswd-biz` 를 **홈 디렉터리 `/home/gria4449/`** 에 업로드.
  (public_html 이 아니라 그 상위 홈 디렉터리)
- `.ht*` 파일은 Apache 가 웹 접근을 기본 차단하므로 안전하다.

### 3) `.htaccess` 경로 — 이미 설정됨
`public/.htaccess` 의 `AuthUserFile "/home/gria4449/.htpasswd-biz"` 로 **설정 완료**.
별도 수정 불필요. (경로를 바꿀 일이 생기면 반드시 저장소의 `public/.htaccess` 에서 수정 →
배포 시 `dist/.htaccess` 가 덮어쓰므로 소스 기준으로 관리)

### 4) 빌드 & 배포
```bash
npm run deploy
```

## 검증
- 시크릿 창에서 `https://gripteksolusi.com/biz` 접속 → **아이디/비밀번호 창**이 떠야 정상.
- 홈에서 "Biz Form" 클릭 → 풀 로드되며 인증창.
- 정확한 자격증명 입력 → Biz Form 표시. 내부 문서 전환(QT/PO…)은 인증창 없이 부드럽게.

## 문제 해결
- **500 에러**: 호스트가 `.htaccess` 의 `<If>`(Apache 2.4) 를 막은 경우. cPanel 은 보통 허용.
  막혀 있으면 cPanel **Directory Privacy** 는 실제 디렉터리만 보호 가능해 SPA 라우트(/biz)엔
  부적합 → 호스트에 `AllowOverride All`(AuthConfig+FileInfo) 활성화 요청.
- **계속 통과(인증 안 뜸)**: `AuthUserFile` 절대경로 오타 또는 파일 권한 확인.
- 비밀번호 변경: `.htpasswd-biz` 갱신 후 재업로드(재배포 불필요).
