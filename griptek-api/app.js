// CV GRIPTEK Solusi — Express API 엔트리포인트 (cPanel Node.js App startup file)
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// ── CORS (프론트가 다른 도메인일 때) ─────────────────────────────────────────
const ORIGINS = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (ORIGINS.length === 0 || ORIGINS.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/documents', require('./routes/documents'));
// app.use('/api/orders', require('./routes/orders'));  // (향후) 주문 기능 추가 시

// 비동기 라우트 에러를 500 JSON 으로
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`griptek-api on ${PORT}`));
