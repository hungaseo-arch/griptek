// ─── CV GRIPTEK Solusi — 개별 제품(규격) 상세페이지 콘텐츠 ────────────────────
// 각 항목이 /{category}/{slug} 형태의 상세페이지 하나를 구성한다.
// 사양은 실제 취급 카탈로그(AsuraDB products)의 브랜드·패턴·타입에 맞춰 작성한다.
// 정밀 수치(load index 등)는 재고/사양에 따라 달라지므로 단정하지 않고 "문의" 로 안내한다.

export interface TireProduct {
  /** 상위 카테고리 slug (예: 'ban-otr') */
  category: string;
  /** 규격 기반 URL slug (예: '29-5r25') */
  slug: string;
  /** 규격 표기 (예: '29.5R25') */
  size: string;
  /** 제품명 (H1) */
  name: string;
  /** <title> (50~60자) */
  title: string;
  /** meta description (120~155자) */
  metaDescription: string;
  brand: string;
  /** 구조 타입 (예: 'Radial OTR', 'Solid Industrial') */
  type: string;
  /** 패턴/모델 코드 (실제 카탈로그 기준) */
  pattern: string;
  /** 대표 적용처 */
  applications: string[];
  /** 본문 설명 (고유) */
  description: string;
  /** 핵심 특징 */
  highlights: string[];
  /** FAQ */
  faqs: { q: string; a: string }[];
}

export const PRODUCTS: TireProduct[] = [
  // ── OTR — 실제: ASCENDO AD905(radial) / AE803(bias) ───────────────────────────
  {
    category: 'ban-otr', slug: '29-5r25', size: '29.5R25', brand: 'ASCENDO', type: 'Radial OTR', pattern: 'AD905 (E-3/L-3)',
    name: 'Ban OTR 29.5R25 ASCENDO AD905',
    title: 'Ban OTR 29.5R25 ASCENDO AD905 — Loader & Dozer | GRIPTEK',
    metaDescription: 'Ban OTR radial 29.5R25 ASCENDO AD905 (E-3/L-3) untuk wheel loader & dozer di tambang. Varian H2 & R1. CV GRIPTEK Solusi — penawaran distributor.',
    applications: ['Wheel Loader Berat', 'Dozer', 'Tambang Batubara & Mineral'],
    description: 'Ban OTR radial 29.5R25 ASCENDO pola AD905 (E-3/L-3) ditujukan untuk wheel loader dan dozer kelas berat. Konstruksi radial memberikan kontak merata, keausan lebih lambat, dan ketahanan panas untuk operasi tambang batubara serta mineral yang menuntut. Tersedia varian tapak H2 dan R1.',
    highlights: ['Konstruksi radial — keausan lebih lambat, biaya per jam lebih rendah', 'Pola AD905 E-3/L-3 tahan potongan & panas', 'Varian H2 (rock) dan R1 (traksi) sesuai medan'],
    faqs: [
      { q: 'Apa beda varian AD905 H2 dan R1 pada 29.5R25?', a: 'H2 dioptimalkan untuk medan batuan dengan ketahanan potongan ekstra, sedangkan R1 menekankan traksi. Tim kami membantu memilih sesuai kondisi lokasi.' },
      { q: 'Apakah 29.5R25 ini tipe radial atau bias?', a: 'Ini tipe radial (29.5R25). Untuk kebutuhan bias, tersedia juga ukuran 29.5-25 pola E-3/L-3. Hubungi kami untuk ketersediaan.' },
    ],
  },
  {
    category: 'ban-otr', slug: '23-5-25', size: '23.5-25', brand: 'ASCENDO', type: 'Bias OTR', pattern: 'AE803 (E-3/L-3)',
    name: 'Ban OTR 23.5-25 ASCENDO AE803',
    title: 'Ban OTR 23.5-25 ASCENDO AE803 E-3/L-3 — Loader | GRIPTEK',
    metaDescription: 'Ban OTR bias 23.5-25 ASCENDO AE803 (E-3/L-3) untuk wheel loader & dump truck di tambang & konstruksi. Tahan potongan, stok siap. CV GRIPTEK Solusi.',
    applications: ['Wheel Loader', 'Dump Truck Artikulasi', 'Tambang & Quarry'],
    description: 'Ban OTR 23.5-25 ASCENDO pola AE803 (E-3/L-3) adalah salah satu ukuran paling umum untuk wheel loader kelas menengah. Konstruksi bias dengan pola E-3/L-3 memberikan keseimbangan traksi dan ketahanan potongan di lokasi tambang serta konstruksi.',
    highlights: ['Pola AE803 E-3/L-3 — traksi & ketahanan potongan seimbang', 'Cocok untuk medan batuan dan permukaan abrasif', 'Ukuran loader paling umum, stok mudah'],
    faqs: [
      { q: 'Ban 23.5-25 cocok untuk alat berat apa?', a: 'Umumnya untuk wheel loader kelas menengah dan dump truck artikulasi di tambang, quarry, dan proyek konstruksi.' },
      { q: 'Apakah tersedia ukuran 26.5-25 dan 29.5R25?', a: 'Ya. Tersedia 26.5-25 (bias AE803) dan 29.5R25 (radial AD905). Hubungi kami untuk rekomendasi sesuai alat berat Anda.' },
    ],
  },
  {
    category: 'ban-otr', slug: '26-5-25', size: '26.5-25', brand: 'ASCENDO', type: 'Bias OTR', pattern: 'AE803 (E-3/L-3)',
    name: 'Ban OTR 26.5-25 ASCENDO AE803',
    title: 'Ban OTR 26.5-25 ASCENDO AE803 E-3/L-3 — Loader | GRIPTEK',
    metaDescription: 'Ban OTR bias 26.5-25 ASCENDO AE803 (E-3/L-3) untuk wheel loader besar di tambang & konstruksi. Kapasitas beban tinggi. CV GRIPTEK Solusi.',
    applications: ['Wheel Loader Besar', 'Tambang Skala Besar', 'Port & Stockyard'],
    description: 'Ban OTR 26.5-25 ASCENDO pola AE803 (E-3/L-3) ditujukan untuk wheel loader berkapasitas lebih besar yang menuntut daya angkut dan stabilitas tinggi, cocok untuk operasi tambang skala besar dan stockyard pelabuhan.',
    highlights: ['Kapasitas beban lebih tinggi dibanding 23.5-25', 'Pola AE803 E-3/L-3 tahan potongan', 'Stabilitas baik untuk loader bermuatan penuh'],
    faqs: [
      { q: 'Apa beda 26.5-25 dengan 23.5-25?', a: '26.5-25 memiliki kapasitas beban dan diameter lebih besar, untuk wheel loader kelas yang lebih besar.' },
      { q: 'Apakah cocok untuk operasi pelabuhan?', a: 'Ya, umum dipakai pada loader di stockyard dan terminal pelabuhan dengan beban berat.' },
    ],
  },

  // ── Industrial (Solid) — 실제: ASCENDO S1000/S2000, DIAMOND XN ─────────────────
  {
    category: 'ban-industri', slug: '600-9', size: '6.00-9', brand: 'ASCENDO', type: 'Solid Industrial', pattern: 'S2000',
    name: 'Ban Industri Solid 6.00-9 ASCENDO S2000',
    title: 'Ban Solid 6.00-9 ASCENDO S2000 — Material Handling | GRIPTEK',
    metaDescription: 'Ban industri solid 6.00-9 ASCENDO S2000 untuk material handling & forklift. Bebas perawatan, tahan tusukan, varian non-marking. CV GRIPTEK Solusi.',
    applications: ['Material Handling', 'Forklift Kecil', 'Mesin Industri Ringan'],
    description: 'Ban industri solid 6.00-9 ASCENDO pola S2000 banyak digunakan pada peralatan material handling dan forklift kecil. Sebagai ban solid, ia bebas perawatan tekanan dan tahan tusukan, ideal untuk lingkungan dengan banyak puing. Tersedia juga varian non-marking.',
    highlights: ['Bebas perawatan tekanan — tanpa risiko kempes', 'Tahan tusukan di lingkungan industri', 'Tersedia varian non-marking (lantai bersih)'],
    faqs: [
      { q: 'Apa beda S1000 dan S2000?', a: 'Keduanya ban solid ASCENDO; pemilihan tergantung aplikasi dan ketersediaan ukuran. Tim kami membantu mencocokkan yang tepat.' },
      { q: 'Apakah tersedia versi non-marking?', a: 'Ya, varian non-marking tersedia untuk area dengan lantai yang harus bebas bekas hitam.' },
    ],
  },
  {
    category: 'ban-industri', slug: '700-12', size: '7.00-12', brand: 'ASCENDO', type: 'Solid Industrial', pattern: 'S1000',
    name: 'Ban Industri Solid 7.00-12 ASCENDO S1000',
    title: 'Ban Solid 7.00-12 ASCENDO S1000 — Forklift & Industri | GRIPTEK',
    metaDescription: 'Ban industri solid 7.00-12 ASCENDO S1000 untuk forklift & alat industri beban menengah. Tahan lama, non-marking tersedia. CV GRIPTEK Solusi.',
    applications: ['Forklift', 'Peralatan Industri', 'Material Handling Menengah'],
    description: 'Ban solid 7.00-12 ASCENDO pola S1000 cocok untuk forklift dan peralatan industri dengan beban menengah. Konstruksi solid memberikan stabilitas dan daya tahan tinggi untuk operasi pabrik dan pergudangan yang intensif. Tersedia varian non-marking.',
    highlights: ['Kapasitas beban menengah dengan stabilitas baik', 'Tahan lama pada operasi pabrik intensif', 'Minim perawatan, downtime rendah'],
    faqs: [
      { q: 'Ban 7.00-12 untuk peralatan apa?', a: 'Umum dipakai pada forklift, peralatan industri beban menengah, dan kendaraan material handling.' },
      { q: 'Apakah bisa konsultasi pemilihan ukuran?', a: 'Ya, tim teknis kami membantu mencocokkan ukuran dan tipe ban dengan beban dan kondisi operasi Anda.' },
    ],
  },
  {
    category: 'ban-industri', slug: '825-15', size: '8.25-15', brand: 'ASCENDO', type: 'Solid Industrial', pattern: 'S2000',
    name: 'Ban Industri Solid 8.25-15 ASCENDO S2000',
    title: 'Ban Solid 8.25-15 ASCENDO S2000 — Forklift Besar | GRIPTEK',
    metaDescription: 'Ban industri solid 8.25-15 ASCENDO S2000 untuk forklift kapasitas besar & alat industri berat. Daya angkut tinggi. CV GRIPTEK Solusi.',
    applications: ['Forklift Kapasitas Besar', 'Peralatan Industri Berat', 'Logistik Pabrik'],
    description: 'Ban solid 8.25-15 ASCENDO pola S2000 ditujukan untuk forklift kapasitas besar dan peralatan industri beban berat. Memberikan daya angkut tinggi dan stabilitas pada operasi logistik pabrik yang intensif, bebas dari perawatan tekanan.',
    highlights: ['Daya angkut tinggi untuk beban berat', 'Stabil pada operasi forklift kapasitas besar', 'Bebas perawatan tekanan, umur pakai panjang'],
    faqs: [
      { q: 'Ban 8.25-15 solid untuk forklift berapa ton?', a: 'Umum dipakai pada forklift kapasitas besar; pemilihan tepat tergantung beban dan rim. Hubungi kami untuk pencocokan.' },
      { q: 'Apakah tersedia ukuran solid lain?', a: 'Ya, tersedia rentang solid 5.00-8, 6.00-9, 6.50-10, 7.00-12, hingga 28×9-15. Hubungi kami untuk daftar lengkap.' },
    ],
  },

  // ── Agricultural — 실제: ASCENDO R-1 / R-1W 12PR ──────────────────────────────
  {
    category: 'ban-pertanian', slug: '124-24', size: '12.4-24', brand: 'ASCENDO', type: 'Agricultural Bias', pattern: 'R-1 12PR',
    name: 'Ban Traktor 12.4-24 ASCENDO R-1 12PR',
    title: 'Ban Traktor 12.4-24 ASCENDO R-1 12PR — Pertanian | GRIPTEK',
    metaDescription: 'Ban traktor 12.4-24 ASCENDO R-1 12PR untuk traktor utility & perkebunan. Traksi tinggi di lahan basah. Varian R-1W & R-2. CV GRIPTEK Solusi.',
    applications: ['Traktor Utility', 'Perkebunan', 'Lahan Basah'],
    description: 'Ban traktor 12.4-24 ASCENDO pola R-1 12PR dirancang untuk traktor utility dan kendaraan perkebunan. Pola tapak dalam memberikan traksi optimal di lahan basah dan berlumpur serta pembersihan lumpur yang baik. Tersedia varian R-1W (extra traksi) dan R-2.',
    highlights: ['Pola R-1 12PR — traksi tinggi di lahan basah', 'Pembersihan lumpur baik (self-cleaning)', 'Varian R-1W & R-2 tersedia sesuai kebutuhan'],
    faqs: [
      { q: 'Apa beda pola R-1, R-1W, dan R-2?', a: 'R-1 adalah pola pertanian standar; R-1W memiliki lug lebih dalam untuk traksi ekstra di lahan basah; R-2 untuk kondisi sawah/lumpur dalam.' },
      { q: 'Ban 12.4-24 untuk traktor ukuran apa?', a: 'Umum untuk traktor utility, sebagai roda penggerak pada traktor kecil maupun aplikasi perkebunan.' },
    ],
  },
  {
    category: 'ban-pertanian', slug: '149-28', size: '14.9-28', brand: 'ASCENDO', type: 'Agricultural Bias', pattern: 'R-1W 12PR',
    name: 'Ban Traktor 14.9-28 ASCENDO R-1W 12PR',
    title: 'Ban Traktor 14.9-28 ASCENDO R-1W 12PR — Penggerak | GRIPTEK',
    metaDescription: 'Ban traktor 14.9-28 ASCENDO R-1W 12PR untuk roda penggerak traktor menengah. Traksi tinggi — sawit, tebu, pertanian besar. CV GRIPTEK Solusi.',
    applications: ['Roda Penggerak Traktor', 'Sawit & Tebu', 'Pertanian Besar'],
    description: 'Ban traktor 14.9-28 ASCENDO pola R-1W 12PR umum digunakan sebagai roda penggerak (rear) pada traktor kelas menengah. Pola R-1W dengan lug dalam memberikan traksi dan daya tarik tinggi untuk pekerjaan berat di perkebunan sawit, tebu, dan pertanian skala besar.',
    highlights: ['Pola R-1W — traksi ekstra untuk roda penggerak', 'Tahan beban kerja berat di perkebunan', 'Cocok untuk lahan basah dan berlumpur'],
    faqs: [
      { q: 'Ban 14.9-28 untuk traktor ukuran apa?', a: 'Umum sebagai roda belakang penggerak pada traktor kelas menengah di perkebunan dan pertanian besar.' },
      { q: 'Apakah cocok untuk perkebunan sawit?', a: 'Ya, pola R-1W cocok untuk lahan basah dan berlumpur khas perkebunan sawit dan tebu.' },
    ],
  },
  {
    category: 'ban-pertanian', slug: '184-30', size: '18.4-30', brand: 'ASCENDO', type: 'Agricultural Bias', pattern: 'R-1W 12PR',
    name: 'Ban Traktor 18.4-30 ASCENDO R-1W 12PR',
    title: 'Ban Traktor 18.4-30 ASCENDO R-1W 12PR — Traktor Besar | GRIPTEK',
    metaDescription: 'Ban traktor 18.4-30 ASCENDO R-1W 12PR untuk traktor besar & harvester. Daya angkut & traksi tinggi. Tersedia R-1. CV GRIPTEK Solusi.',
    applications: ['Traktor Besar', 'Harvester', 'Pertanian Besar'],
    description: 'Ban traktor 18.4-30 ASCENDO pola R-1W 12PR ditujukan untuk traktor besar dan harvester yang menuntut daya angkut dan traksi tinggi. Konstruksi kuat menahan beban kerja berat pada operasi pertanian dan perkebunan skala besar. Tersedia juga varian R-1.',
    highlights: ['Untuk traktor besar & harvester', 'Pola R-1W — daya angkut dan traksi tinggi', 'Konstruksi kuat untuk beban kerja berat'],
    faqs: [
      { q: 'Ban 18.4-30 untuk alat apa?', a: 'Digunakan pada traktor besar dan harvester di pertanian dan perkebunan skala besar.' },
      { q: 'Tersedia ukuran traktor lain?', a: 'Ya, tersedia rentang 11.2-24 hingga 24.5-32 (R-1/R-1W). Hubungi kami untuk daftar ukuran lengkap.' },
    ],
  },
];

/** "{category}/{slug}" 경로 → 제품 빠른 조회 */
export const PRODUCT_BY_PATH: Record<string, TireProduct> = Object.fromEntries(
  PRODUCTS.map((p) => [`${p.category}/${p.slug}`, p]),
);

/** 카테고리 slug → 해당 제품 목록 */
export function productsOfCategory(category: string): TireProduct[] {
  return PRODUCTS.filter((p) => p.category === category);
}
