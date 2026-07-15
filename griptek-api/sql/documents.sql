-- 문서(견적/PO/PI/CI/PL) 저장 — phpMyAdmin 에서 1회 실행
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS documents (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  doc_type    VARCHAR(8)   NOT NULL,            -- QT/PO/PI/CI/PL
  doc_no      VARCHAR(64)  NOT NULL,
  payload     JSON         NOT NULL,            -- 폼 전체 내용
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_documents_type_created (doc_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
