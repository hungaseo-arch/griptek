// 문서(QT/PO/PI/CI/PL) 저장 — 전부 인증 필요(사업 데이터 보호).
const express = require('express');
const { randomUUID } = require('crypto');
const pool = require('../db');
const { requireAuth } = require('../auth');
const ah = require('../asyncH');
const router = express.Router();

router.use(requireAuth); // 모든 문서 라우트는 로그인 필요

// MariaDB(JSON=LONGTEXT)는 payload 를 문자열로 반환 → 객체로 파싱해 응답.
const parsePayload = (row) => {
  if (row && typeof row.payload === 'string') {
    try { row.payload = JSON.parse(row.payload); } catch { row.payload = {}; }
  }
  return row;
};

// 목록 (유형별 메타만) — GET /api/documents?type=QT
router.get('/', ah(async (req, res) => {
  const { type } = req.query;
  if (!type) return res.status(400).json({ error: 'type required' });
  const [rows] = await pool.query(
    'SELECT id, doc_no, created_at FROM documents WHERE doc_type = ? ORDER BY created_at DESC LIMIT 500',
    [type],
  );
  res.json(rows);
}));

// 단건 (전체 payload)
router.get('/:id', ah(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, doc_type, doc_no, payload, created_at FROM documents WHERE id = ?',
    [req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'not found' });
  res.json(parsePayload(rows[0]));
}));

// 저장 — 같은 종류+번호(파일명)가 있으면 업데이트, 없으면 생성 (upsert → 중복 방지)
router.post('/', ah(async (req, res) => {
  const { doc_type, doc_no, payload } = req.body || {};
  if (!doc_type || !doc_no) return res.status(400).json({ error: 'doc_type/doc_no required' });
  const body = JSON.stringify(payload ?? {});
  const [ex] = await pool.query(
    'SELECT id FROM documents WHERE doc_type = ? AND doc_no = ? LIMIT 1', [doc_type, doc_no],
  );
  let id;
  if (ex[0]) {
    id = ex[0].id;
    await pool.query('UPDATE documents SET payload = ?, updated_at = NOW(6) WHERE id = ?', [body, id]);
  } else {
    id = randomUUID();
    await pool.query(
      'INSERT INTO documents (id, doc_type, doc_no, payload, created_at, updated_at) VALUES (?,?,?,?,NOW(6),NOW(6))',
      [id, doc_type, doc_no, body],
    );
  }
  const [rows] = await pool.query(
    'SELECT id, doc_type, doc_no, payload, created_at FROM documents WHERE id = ?', [id],
  );
  res.json(parsePayload(rows[0]));
}));

// 수정
router.put('/:id', ah(async (req, res) => {
  const { doc_no, payload } = req.body || {};
  await pool.query(
    'UPDATE documents SET doc_no = ?, payload = ?, updated_at = NOW(6) WHERE id = ?',
    [doc_no, JSON.stringify(payload ?? {}), req.params.id],
  );
  const [rows] = await pool.query(
    'SELECT id, doc_type, doc_no, payload, created_at FROM documents WHERE id = ?',
    [req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'not found' });
  res.json(parsePayload(rows[0]));
}));

// 삭제
router.delete('/:id', ah(async (req, res) => {
  await pool.query('DELETE FROM documents WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

module.exports = router;
