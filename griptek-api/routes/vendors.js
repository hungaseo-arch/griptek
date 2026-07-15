// 벤더(공급사) — 목록 조회(공개) + 등록/수정/삭제(super_admin)
const express = require('express');
const pool = require('../db');
const { requireAuth, requireRole } = require('../auth');
const ah = require('../asyncH');
const router = express.Router();

// 법인형태 접두어(PT/CV/UD/PD)의 마침표 유무 통일 → 'PT. X' = 'PT X' (같은 회사로 인식)
const normName = (s) => String(s ?? '').trim().replace(/^(PT|CV|UD|PD)\.?\s+/i, (_m, g) => `${g.toUpperCase()} `);

// READ (공개) — 활성 벤더 목록/검색. (PO 자동입력용, 민감정보 아님)
router.get('/', ah(async (req, res) => {
  const { q } = req.query;
  let sql = 'SELECT id,name,address,city_state,phone,email FROM vendors WHERE is_active = 1';
  const p = [];
  if (q) { sql += ' AND name LIKE ?'; p.push(`%${q}%`); }
  sql += ' ORDER BY name ASC';
  const [rows] = await pool.query(sql, p);
  res.json(rows);
}));

// UPSERT (로그인) — 문서(PO) 저장 시 이름 기준 자동 저장/갱신
router.post('/', requireAuth, ah(async (req, res) => {
  const { name, address, city_state, phone, email } = req.body || {};
  if (!name || !normName(name)) return res.status(400).json({ error: 'name required' });
  await pool.query(
    `INSERT INTO vendors (id,name,address,city_state,phone,email,is_active,created_at,updated_at)
     VALUES (UUID(),?,?,?,?,?,1,NOW(6),NOW(6))
     ON DUPLICATE KEY UPDATE
       address=VALUES(address), city_state=VALUES(city_state), phone=VALUES(phone),
       email=VALUES(email), is_active=1, updated_at=NOW(6)`,
    [normName(name), address ?? null, city_state ?? null, phone ?? null, email ?? null],
  );
  res.json({ ok: true });
}));

router.put('/:id', requireAuth, requireRole('super_admin'), ah(async (req, res) => {
  const { name, address, city_state, phone, email, is_active } = req.body || {};
  await pool.query(
    `UPDATE vendors SET name=?, address=?, city_state=?, phone=?, email=?, is_active=?, updated_at=NOW(6) WHERE id=?`,
    [normName(name), address ?? null, city_state ?? null, phone ?? null, email ?? null, is_active ? 1 : 0, req.params.id],
  );
  res.json({ ok: true });
}));

// soft delete
router.delete('/:id', requireAuth, requireRole('super_admin'), ah(async (req, res) => {
  await pool.query('UPDATE vendors SET is_active = 0, updated_at = NOW(6) WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

module.exports = router;
