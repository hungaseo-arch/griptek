// 로그인/회원가입 — admin_users(email, pass_hash bcrypt, role, is_active) + JWT
const express = require('express');
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { requireAuth, requireRole } = require('../auth');
const ah = require('../asyncH');
const router = express.Router();

function issueToken(u) {
  return jwt.sign({ sub: u.id, email: u.email, role: u.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

// 로그인 — 활성(is_active=1) 계정만 가능
router.post('/login', ah(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });

  const [rows] = await pool.query(
    'SELECT id, email, pass_hash, role, is_active FROM admin_users WHERE email = ? LIMIT 1',
    [String(email).trim().toLowerCase()],
  );
  const u = rows[0];
  if (!u || !(await bcrypt.compare(password, u.pass_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (!u.is_active) {
    return res.status(403).json({ error: '승인 대기 중입니다. 관리자 승인 후 로그인하세요.' });
  }
  res.json({ token: issueToken(u), role: u.role });
}));

// 회원가입 — 비활성(승인 대기)으로 생성. 자동 로그인 안 함.
router.post('/signup', ah(async (req, res) => {
  const email = String((req.body || {}).email ?? '').trim().toLowerCase();
  const password = String((req.body || {}).password ?? '');
  if (!email || !email.includes('@')) return res.status(400).json({ error: '올바른 이메일을 입력하세요.' });
  if (password.length < 6) return res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다.' });

  const [ex] = await pool.query('SELECT id FROM admin_users WHERE email = ? LIMIT 1', [email]);
  if (ex[0]) return res.status(409).json({ error: '이미 가입된 이메일입니다.' });

  const pass_hash = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO admin_users (id, email, pass_hash, role, is_active) VALUES (?,?,?,?,0)',
    [randomUUID(), email, pass_hash, 'end_user'],
  );
  res.status(201).json({ pending: true, message: '가입 신청이 접수되었습니다. 관리자 승인 후 로그인할 수 있습니다.' });
}));

// ── 관리자(super_admin) — 가입 승인 관리 ─────────────────────────────────────
// 승인 대기 목록
router.get('/pending', requireAuth, requireRole('super_admin'), ah(async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, email, role, created_at FROM admin_users WHERE is_active = 0 ORDER BY created_at DESC',
  );
  res.json(rows);
}));

// 승인(활성화) — { id, role? } (role 지정 시 함께 변경)
router.post('/approve', requireAuth, requireRole('super_admin'), ah(async (req, res) => {
  const { id, role } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id required' });
  if (role) await pool.query('UPDATE admin_users SET is_active = 1, role = ? WHERE id = ?', [role, id]);
  else await pool.query('UPDATE admin_users SET is_active = 1 WHERE id = ?', [id]);
  res.json({ ok: true });
}));

module.exports = router;
