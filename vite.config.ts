import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import prerender from '@prerenderer/rollup-plugin';
import path from 'node:path';

// CV GRIPTEK Business Forms — Vue 3 migration.
// Note: the React project used `lovable-tagger` (visual-editor tagging plugin).
// It is React-specific and intentionally omitted — see MIGRATION.md §5.
export default defineConfig({
  // 도메인 루트(gripteksolusi.com/) 배포 → 절대 경로. Prerender/canonical 에 유리.
  base: '/',
  plugins: [
    vue(),
    tailwindcss(),
    // 공개 라우트(홈 + 제품 카테고리)를 완성된 정적 HTML 로 prerender → 검색엔진 색인.
    // /biz(서류 폼)는 로그인 게이트·noindex 라 prerender 제외.
    prerender({
      routes: [
        '/',
        '/ban-forklift',
        '/ban-truk-bus',
        '/ban-otr',
        '/ban-industri',
        '/ban-pertanian',
        // 개별 제품(규격) 상세
        '/ban-otr/29-5r25',
        '/ban-otr/23-5-25',
        '/ban-otr/26-5-25',
        '/ban-industri/600-9',
        '/ban-industri/700-12',
        '/ban-industri/825-15',
        '/ban-pertanian/124-24',
        '/ban-pertanian/149-28',
        '/ban-pertanian/184-30',
      ],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'render-event',
        // 동시 prerender 수 제한 → puppeteer "Connection closed" 크래시 방지(빌드 안정화).
        maxConcurrentRoutes: 3,
        headless: true,
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
