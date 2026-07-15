// 제품 — 역할별 가격(원가/판매가 분기) 조회 + super_admin 쓰기
const express = require('express');
const pool = require('../db');
const { requireAuth, requireRole } = require('../auth');
const { policyOf, needsCost } = require('../roles');
const ah = require('../asyncH');
const router = express.Router();

const floor1000 = (v) => Math.floor(v / 1000) * 1000;

// READ — 역할에 따라 원가 포함 / 판매가만(원가 미전송) 분기
//  · super_admin·staff(needsCost) → wh_price·wh_price_set 포함 (프론트가 divisor 로 계산)
//  · distributor·end_user        → unit_price = floor1000(wh / 0.70), 원가 컬럼 제거
router.get('/', requireAuth, ah(async (req, res) => {
  const pol = policyOf(req.user.role);
  const { brand, item, q } = req.query;

  let sql = 'SELECT id,item,brand,description,sku,unit,wh_price,wh_price_set FROM products WHERE is_active = 1';
  const p = [];
  if (brand) { sql += ' AND brand = ?'; p.push(brand); }
  if (item)  { sql += ' AND item = ?';  p.push(item); }
  if (q)     { sql += ' AND (description LIKE ? OR sku LIKE ? OR brand LIKE ?)'; p.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  sql += ' ORDER BY brand ASC, description ASC';

  const [rows] = await pool.query(sql, p);

  if (needsCost(pol)) return res.json(rows); // 원가 포함

  // 원가 미전송 역할: 판매가만 계산해 반환 (wh_price NULL → 0)
  const sell = (v) => (v == null ? 0 : floor1000(v / pol.divisor));
  res.json(rows.map((r) => ({
    id: r.id, item: r.item, brand: r.brand, description: r.description, sku: r.sku, unit: r.unit,
    unit_price: sell(r.wh_price),
    unit_price_set: sell(r.wh_price_set),
  })));
}));

// ── 쓰기: super_admin 만 ────────────────────────────────────────────────
router.post('/', requireAuth, requireRole('super_admin'), ah(async (req, res) => {
  const { item, brand, description, sku, wh_price, wh_price_set = 0, unit = 'pcs' } = req.body || {};
  const [r] = await pool.query(
    `INSERT INTO products (id,item,brand,description,sku,wh_price,wh_price_set,unit,is_active,created_at,updated_at)
     VALUES (UUID(),?,?,?,?,?,?,?,1,NOW(6),NOW(6))`,
    [item, brand, description, sku, wh_price ?? null, wh_price_set, unit],
  );
  res.status(201).json({ ok: true, affected: r.affectedRows });
}));

router.put('/:id', requireAuth, requireRole('super_admin'), ah(async (req, res) => {
  const { description, wh_price, wh_price_set, unit, is_active } = req.body || {};
  await pool.query(
    `UPDATE products SET description=?, wh_price=?, wh_price_set=?, unit=?, is_active=?, updated_at=NOW(6) WHERE id=?`,
    [description, wh_price ?? null, wh_price_set ?? 0, unit ?? 'pcs', is_active ? 1 : 0, req.params.id],
  );
  res.json({ ok: true });
}));

// soft delete
router.delete('/:id', requireAuth, requireRole('super_admin'), ah(async (req, res) => {
  await pool.query('UPDATE products SET is_active = 0, updated_at = NOW(6) WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

module.exports = router;
