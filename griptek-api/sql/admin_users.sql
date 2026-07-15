-- 로그인 사용자(역할 보유) — phpMyAdmin 에서 1회 실행
-- (products 는 별도 마이그레이션 SQL 로 import)
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS admin_users (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  email      VARCHAR(255) NOT NULL,
  pass_hash  VARCHAR(255) NOT NULL,                 -- bcrypt 해시
  role       ENUM('super_admin','staff','distributor','end_user') NOT NULL DEFAULT 'end_user',
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,        -- 0=가입 승인 대기, 1=활성
  created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 이미 admin_users 가 있는 경우(기존 테이블)엔 컬럼만 추가:
--   ALTER TABLE admin_users ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;
-- (기존 계정은 자동으로 활성(1). 신규 가입은 0=승인 대기 로 들어감)

-- 첫 관리자 생성 예시 (pass_hash 는 bcrypt 로 생성해 교체):
--   node -e "console.log(require('bcryptjs').hashSync('비밀번호',10))"
-- INSERT INTO admin_users (id,email,pass_hash,role)
-- VALUES (UUID(), 'admin@gripteksolusi.com', '$2a$10$....', 'super_admin');
