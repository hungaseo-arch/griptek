-- 벤더(공급사) — phpMyAdmin 에서 1회 실행
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS vendors (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  name        VARCHAR(255) NOT NULL,
  address     VARCHAR(255) NULL,
  city_state  VARCHAR(255) NULL,            -- 도시/주/우편
  phone       VARCHAR(50)  NULL,
  email       VARCHAR(255) NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_vendors_name (name),
  KEY idx_vendors_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 첫 벤더 등록 (이름 중복 시 무시 — 재실행 안전)
INSERT IGNORE INTO vendors (id, name, address, city_state, phone, email)
VALUES (
  UUID(),
  'PT Ascendo Internasional',
  'Jl. Palmerah Barat No.8/42, RT.2/RW.3, Grogol Utara, Kec. Kebayoran Lama',
  'Jakarta Selatan, DKI Jakarta 12210',
  '(021) 530686',
  NULL
);
