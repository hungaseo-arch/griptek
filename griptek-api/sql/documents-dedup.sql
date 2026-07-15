-- 문서 중복(같은 종류+번호) 정리 + 중복 방지 — phpMyAdmin 에서 1회 실행
SET NAMES utf8mb4;

-- 1) 기존 중복 정리: 같은 (doc_type, doc_no) 중 최신 1건만 남기고 삭제
DELETE d FROM documents d
JOIN documents d2
  ON d.doc_type = d2.doc_type
 AND d.doc_no   = d2.doc_no
 AND (d.created_at < d2.created_at
      OR (d.created_at = d2.created_at AND d.id < d2.id));

-- 2) (선택) 앞으로 같은 번호 중복 자체를 막는 제약 추가.
--    위 1) 로 중복을 먼저 없앤 뒤에 실행해야 함(중복 있으면 실패).
ALTER TABLE documents
  ADD UNIQUE KEY uq_documents_type_no (doc_type, doc_no);
