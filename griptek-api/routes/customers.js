// 구매고객 — 목록(공개) + upsert(로그인) + 수정/삭제(super_admin)
const express = require('express');
const pool = require('../db');
const { requireAuth, requireRole } = require('../auth');
const ah = require('../asyncH');
const router = express.Router();

// 법인형태 접두어(PT/CV/UD/PD)의 마침표 유무 통일 → 'PT. X' = 'PT X' (같은 회사로 인식)
const normName = (s) => String(s ?? '').trim().replace(/^(PT|CV|UD|PD)\.?\s+/i, (_m, g) => `${g.toUpperCase()} `);

// READ (공개) — 활성 고객 목록/검색 (문서 자동입력용)
router.get('/', ah(async (req, res) => {
  const { q } = req.query;
  let sql = 'SELECT id,name,address,city_state,phone,email,contact,npwp FROM customers WHERE is_active = 1';
  const p = [];
  if (q) { sql += ' AND name LIKE ?'; p.push(`%${q}%`); }
  sql += ' ORDER BY name ASC';
  const [rows] = await pool.query(sql, p);
  res.json(rows);
}));

// UPSERT (로그인) — 문서 저장 시 이름 기준 자동 저장/갱신
router.post('/', requireAuth, ah(async (req, res) => {
  const { name, address, city_state, phone, email, contact, npwp } = req.body || {};
  if (!name || !normName(name)) return res.status(400).json({ error: 'name required' });
  await pool.query(
    `INSERT INTO customers (id,name,address,city_state,phone,email,contact,npwp,is_active,created_at,updated_at)
     VALUES (UUID(),?,?,?,?,?,?,?,1,NOW(6),NOW(6))
     ON DUPLICATE KEY UPDATE
       address=VALUES(address), city_state=VALUES(city_state), phone=VALUES(phone),
       email=VALUES(email), contact=VALUES(contact), npwp=VALUES(npwp),
       is_active=1, updated_at=NOW(6)`,
    [normName(name), address ?? null, city_state ?? null, phone ?? null, email ?? null, contact ?? null, npwp ?? null],
  );
  res.json({ ok: true });
}));

// 수정/삭제 (super_admin)
router.put('/:id', requireAuth, requireRole('super_admin'), ah(async (req, res) => {
  const { name, address, city_state, phone, email, contact, npwp, is_active } = req.body || {};
  await pool.query(
    `UPDATE customers SET name=?, address=?, city_state=?, phone=?, email=?, contact=?, npwp=?, is_active=?, updated_at=NOW(6) WHERE id=?`,
    [normName(name), address ?? null, city_state ?? null, phone ?? null, email ?? null, contact ?? null, npwp ?? null, is_active ? 1 : 0, req.params.id],
  );
  res.json({ ok: true });
}));

router.delete('/:id', requireAuth, requireRole('super_admin'), ah(async (req, res) => {
  await pool.query('UPDATE customers SET is_active = 0, updated_at = NOW(6) WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

module.exports = router;
