// ─── CV GRIPTEK Solusi — 라우터 + 페이지별 <head> 관리 ─────────────────────────
// 각 공개 라우트(/, /ban-*)는 prerender 되어 고유한 title·description·canonical·H1 을
// 갖는 정적 HTML 로 색인된다. /biz(서류 폼)는 noindex, prerender 제외.
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { CATEGORIES, CATEGORY_BY_SLUG } from '@/data/categories';
import { PRODUCTS, PRODUCT_BY_PATH } from '@/data/products';

const SITE = 'https://gripteksolusi.com';

/** 라우트별 <head> 메타 */
interface HeadMeta {
  title: string;
  description: string;
  noindex?: boolean;
}

const HOME_META: HeadMeta = {
  title: 'CV GRIPTEK Solusi — Distributor Resmi Ban Komersial & Industri',
  description:
    'CV Griptek Solusi — distributor ban truk, OTR, pertanian, industri & forklift di Indonesia. 인도네시아 진출 한국기업 지게차·상용차 타이어 전문. Jakarta·Cikarang·Karawang.',
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/CompanyProfile.vue'),
    meta: { head: HOME_META },
  },
  ...CATEGORIES.map<RouteRecordRaw>((c) => ({
    path: `/${c.slug}`,
    name: c.slug,
    component: () => import('@/views/ProductCategory.vue'),
    props: { slug: c.slug },
    meta: { head: { title: c.title, description: c.metaDescription } satisfies HeadMeta },
  })),
  ...PRODUCTS.map<RouteRecordRaw>((p) => ({
    path: `/${p.category}/${p.slug}`,
    name: `${p.category}/${p.slug}`,
    component: () => import('@/views/ProductDetail.vue'),
    props: { category: p.category, slug: p.slug },
    meta: { head: { title: p.title, description: p.metaDescription } satisfies HeadMeta },
  })),
  {
    path: '/biz',
    name: 'biz',
    component: () => import('@/views/BizForms.vue'),
    meta: { head: { title: 'Biz Form — CV GRIPTEK Solusi', description: '', noindex: true } satisfies HeadMeta },
  },
  // 알 수 없는 경로 → 홈
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// ── <head> DOM 헬퍼 ──────────────────────────────────────────────────────────
function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setRobots(noindex: boolean): void {
  const existing = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (noindex) {
    if (existing) existing.setAttribute('content', 'noindex, nofollow');
    else setMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
  } else if (existing) {
    existing.remove();
  }
}

const JSONLD_ID = 'route-jsonld';

/** 이전 라우트에서 주입한 페이지별 JSON-LD 제거 후 새로 주입 */
function setJsonLd(blocks: object[]): void {
  document.querySelectorAll(`script[data-managed="${JSONLD_ID}"]`).forEach((n) => n.remove());
  for (const block of blocks) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-managed', JSONLD_ID);
    s.textContent = JSON.stringify(block);
    document.head.appendChild(s);
  }
}

function breadcrumb(crumbs: { name: string; path: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE}${c.path}`,
    })),
  };
}

function faqPage(faqs: { q: string; a: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// ── 네비게이션마다 <head> 갱신 (초기 진입 포함 → prerender 캡처) ──────────────
router.afterEach((to) => {
  const head = (to.meta.head as HeadMeta) ?? HOME_META;
  const url = `${SITE}${to.path === '/' ? '/' : to.path}`;

  document.title = head.title;
  setMeta('meta[name="description"]', 'name', 'description', head.description);
  setLink('canonical', url);
  setMeta('meta[property="og:title"]', 'property', 'og:title', head.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', head.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', url);
  setRobots(!!head.noindex);

  // 페이지별 구조화 데이터
  const key = to.path.replace(/^\//, '');
  const product = PRODUCT_BY_PATH[key];
  const cat = CATEGORY_BY_SLUG[key];

  if (product) {
    const parent = CATEGORY_BY_SLUG[product.category];
    setJsonLd([
      breadcrumb([
        { name: 'Beranda', path: '/' },
        ...(parent ? [{ name: parent.h1Highlight, path: `/${parent.slug}` }] : []),
        { name: product.size, path: to.path },
      ]),
      faqPage(product.faqs),
      {
        // 공개 가격이 없어 offers 는 생략(허위 가격 미기재). brand·category 로 엔티티 맥락 제공.
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        category: parent?.h1 ?? product.category,
        brand: { '@type': 'Brand', name: product.brand },
        url,
      },
    ]);
  } else if (cat) {
    setJsonLd([
      breadcrumb([
        { name: 'Beranda', path: '/' },
        { name: cat.h1, path: to.path },
      ]),
      faqPage(cat.faqs),
    ]);
  } else {
    setJsonLd([]);
  }
});

export default router;
