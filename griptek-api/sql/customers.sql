-- 구매고객 — phpMyAdmin 에서 1회 실행. (문서 저장 시 이름 기준 자동 upsert)
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS customers (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  name        VARCHAR(255) NOT NULL,
  address     VARCHAR(255) NULL,
  city_state  VARCHAR(255) NULL,
  phone       VARCHAR(50)  NULL,
  email       VARCHAR(255) NULL,
  contact     VARCHAR(255) NULL,            -- 담당자
  npwp        VARCHAR(50)  NULL,            -- 세금번호
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_customers_name (name)        -- 이름 기준 upsert
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
