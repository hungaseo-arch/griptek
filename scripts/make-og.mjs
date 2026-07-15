// OG 이미지 생성 (1200×630) — puppeteer 로 HTML 카드를 PNG 로 렌더.
// 실행: node scripts/make-og.mjs  → public/og-image.png
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// 로고를 base64 data URI 로 임베드(파일 경로 이슈 방지)
const logo = readFileSync(resolve(root, 'public/logo-griptec.png')).toString('base64');
const logoUri = `data:image/png;base64,${logo}`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1200px; height:630px; }
  body {
    font-family: "Apple SD Gothic Neo","Noto Sans KR","Helvetica Neue",Arial,sans-serif;
    background: linear-gradient(135deg,#1F3864 0%,#142844 100%);
    color:#fff; display:flex; align-items:center; gap:56px; padding:64px 72px;
  }
  .logo { width:300px; height:300px; flex:0 0 300px; background:#fff; border-radius:28px;
          display:flex; align-items:center; justify-content:center; box-shadow:0 8px 40px rgba(0,0,0,.35); }
  .logo img { width:248px; height:248px; object-fit:contain; }
  .right { flex:1; }
  .brandname { font-size:62px; font-weight:800; letter-spacing:.5px; line-height:1.05; }
  .bar { width:120px; height:7px; background:#C9A227; border-radius:4px; margin:22px 0 24px; }
  .tagline { font-size:30px; font-weight:600; color:#BDD7EE; line-height:1.3; }
  .cats { font-size:25px; font-weight:700; color:#fff; margin-top:18px; }
  .ko { font-size:24px; color:#BDD7EE; margin-top:14px; }
  .brands { font-size:20px; font-weight:600; color:#C9A227; margin-top:22px; letter-spacing:.3px; }
  .domain { position:absolute; bottom:42px; right:72px; font-size:26px; font-weight:800; color:#C9A227; }
</style></head><body>
  <div class="logo"><img src="${logoUri}" alt=""></div>
  <div class="right">
    <div class="brandname">CV GRIPTEK<br>SOLUSI</div>
    <div class="bar"></div>
    <div class="tagline">Distributor Ban Komersial &amp; Industri di Indonesia</div>
    <div class="cats">Truck · Bus · OTR · Pertanian · Industri · Forklift</div>
    <div class="ko">인도네시아 한국기업 타이어 전문 · 한국어 상담</div>
    <div class="brands">ASCENDO · TECHKING · TIRON · MAXAM · DIAMOND · JK TYRE</div>
  </div>
  <div class="domain">gripteksolusi.com</div>
</body></html>`;

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'networkidle0' });
const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
writeFileSync(resolve(root, 'public/og-image.png'), buf);
await browser.close();
console.log('✓ public/og-image.png 생성 (1200×630 @2x)');
