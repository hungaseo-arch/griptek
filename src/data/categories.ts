// ─── CV GRIPTEK Solusi — 제품 카테고리 랜딩 페이지 콘텐츠 ──────────────────────
// 각 항목이 하나의 SEO 랜딩 페이지(/ban-*)를 구성한다.
// title/metaDescription 는 페이지 <head> 에, 나머지는 본문에 렌더링된다.
// 콘텐츠는 카테고리별로 고유하게 작성해 thin/duplicate content 를 피한다.

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface ProductCategory {
  slug: string;          // URL: /{slug}
  /** 상단 배지 */
  badge: string;
  /** <title> — 회사명 + 핵심 키워드 + 지역 (50~60자 권장) */
  title: string;
  /** meta description (120~155자) */
  metaDescription: string;
  /** H1 (페이지당 1개) */
  h1: string;
  /** H1 안에서 강조(midblue)할 키워드 */
  h1Highlight: string;
  /** 부제 (id · ko) */
  tagline: string;
  /** 본문 리드 문단 (크롤 가능한 정적 텍스트) */
  intro: string[];
  /** 추천 브랜드 */
  brand: { name: string; ko: string; why: string };
  /** 대표 규격 */
  sizes: string[];
  /** 주요 적용처 */
  applications: { en: string; ko: string }[];
  /** 타겟 산업 */
  industries: string[];
  /** FAQ — FAQPage 구조화 데이터 + 롱테일 콘텐츠 */
  faqs: CategoryFaq[];
}

export const CATEGORIES: ProductCategory[] = [
  {
    slug: 'ban-forklift',
    badge: 'FORKLIFT TIRE · 지게차 타이어',
    title: 'Ban Forklift Solid & Pneumatic — CV GRIPTEK Solusi Jakarta',
    metaDescription:
      'Distributor ban forklift solid press-on & pneumatic di Jakarta, Cikarang, Karawang. 인도네시아 한국기업 지게차 타이어 전문 · 한국어 상담·즉납.',
    h1: 'Ban Forklift Solid & Pneumatic untuk Pabrik & Gudang di Indonesia',
    h1Highlight: 'Forklift',
    tagline: 'Ban Forklift Solid Press-On & Pneumatic · 지게차 타이어 (한국어 상담 가능)',
    intro: [
      'CV Griptek Solusi menyediakan ban forklift solid press-on dan pneumatic lengkap untuk warehouse, pabrik manufaktur, dan pelabuhan di seluruh Indonesia. Stok siap kirim memastikan operasional forklift Anda tidak terhenti.',
      '인도네시아에 진출한 한국계 제조·물류 기업을 대상으로 지게차 타이어(solid·pneumatic)를 한국어 상담과 함께 즉납 재고로 공급합니다. 자카르타·찌까랑·까라왕 산업단지 현장 배송과 빠른 교체를 지원합니다.',
    ],
    brand: { name: 'ASCENDO', ko: 'Solid S1000 / S2000', why: 'Ban forklift solid ASCENDO seri S1000 & S2000 — daya tahan tinggi untuk operasi warehouse intensif, tersedia varian non-marking. Alternatif: DIAMOND seri XN.' },
    sizes: ['5.00-8', '6.00-9', '6.50-10', '7.00-12', '8.25-15', '28×9-15', '16×6-8'],
    applications: [
      { en: 'Warehouse & Logistics', ko: '물류창고' },
      { en: 'Manufacturing Plant', ko: '제조 공장' },
      { en: 'Port & Terminal', ko: '항만·터미널' },
      { en: 'Distribution Center', ko: '물류센터' },
    ],
    industries: ['Manufaktur', 'Logistik & Pergudangan', 'Port & Terminal', 'Distribusi & Retail'],
    faqs: [
      { q: 'Apa perbedaan ban forklift solid dan pneumatic?', a: 'Ban solid (press-on/cushion) tahan tusukan dan ideal untuk permukaan keras di dalam gudang, sedangkan ban pneumatic memberikan bantalan lebih baik untuk permukaan tidak rata dan area luar ruangan.' },
      { q: 'Apakah tersedia stok ban forklift siap kirim di Jakarta dan Cikarang?', a: 'Ya. Kami menyimpan stok ban forklift untuk pengiriman cepat ke Jakarta, Cikarang, Karawang, Tangerang, dan Bogor, serta dapat mengirim ke seluruh Indonesia.' },
      { q: '한국어로 지게차 타이어 상담이 가능한가요?', a: '네, 인도네시아 진출 한국기업을 위해 한국어 상담과 견적을 제공합니다. 규격 확인과 즉납 재고, 현장 교체까지 지원합니다.' },
    ],
  },
  {
    slug: 'ban-truk-bus',
    badge: 'TRUCK & BUS TIRE · 트럭·버스 타이어',
    title: 'Ban Truk & Bus Radial — Distributor ASCENDO | GRIPTEK Solusi',
    metaDescription:
      'Distributor ban truk & bus radial & bias — ASCENDO, TECHKING, TIRON, JK TYRE. Logistik jarak jauh & angkutan penumpang. Jakarta, seluruh Indonesia.',
    h1: 'Ban Truk & Bus Radial dan Bias untuk Kendaraan Komersial',
    h1Highlight: 'Truk & Bus',
    tagline: 'Ban Komersial Jarak Jauh & Angkutan Penumpang · 트럭·버스 타이어',
    intro: [
      'CV Griptek Solusi adalah distributor ban truk dan bus untuk armada logistik jarak jauh dan transportasi penumpang. Kami menyediakan ban radial dan bias dengan daya tahan tinggi dan efisiensi bahan bakar optimal.',
      'Cocok untuk fleet operator, perusahaan trucking, dan operator bus yang membutuhkan ban komersial andal dengan biaya per kilometer rendah. Tersedia untuk seluruh wilayah Indonesia dengan dukungan teknis pemilihan ban.',
    ],
    brand: { name: 'ASCENDO', ko: 'Seri AR (Radial) & AB (Bias)', why: 'Ban truk & bus ASCENDO seri AR (radial) dan AB (bias) — performa tinggi dan efisiensi bahan bakar. Tersedia juga TECHKING (seri TK/ETOT), TIRON (seri HS), dan JK TYRE.' },
    sizes: ['10.00R20', '11.00R20', '12.00R20', '11R22.5', '295/80R22.5', '10.00-20', '11.00-20', '7.50-16'],
    applications: [
      { en: 'Long-Haul Logistics', ko: '장거리 물류' },
      { en: 'Passenger Bus', ko: '여객 버스' },
      { en: 'Fleet Operation', ko: '플릿 운영' },
      { en: 'Distribution & Cargo', ko: '화물 운송' },
    ],
    industries: ['Logistik & Transportasi', 'Trucking Company', 'Bus & Angkutan Umum', 'Distribusi'],
    faqs: [
      { q: 'Apa perbedaan ban truk radial dan bias?', a: 'Ban radial menawarkan umur pakai lebih panjang, efisiensi bahan bakar lebih baik, dan kenyamanan lebih tinggi untuk jarak jauh, sementara ban bias lebih tahan beban berat pada kondisi jalan kasar.' },
      { q: 'Ukuran ban truk dan bus apa saja yang tersedia?', a: 'Kami menyediakan ukuran populer seperti 11R22.5, 12R22.5, 295/80R22.5, hingga 1000R20 dan 1100R20. Ukuran lain tersedia berdasarkan permintaan.' },
      { q: 'Apakah melayani pembelian armada (fleet) dalam jumlah besar?', a: 'Ya, kami menawarkan skema harga distributor yang kompetitif dengan terms pembayaran fleksibel untuk pembelian armada.' },
    ],
  },
  {
    slug: 'ban-otr',
    badge: 'OTR TIRE · 건설중장비 타이어',
    title: 'Ban OTR Alat Berat, Tambang & Konstruksi | GRIPTEK Solusi',
    metaDescription:
      'Distributor ban OTR (Off-The-Road) untuk dump truck, wheel loader & grader. ASCENDO/MAXAM tahan ekstrem untuk tambang, konstruksi & port di Indonesia.',
    h1: 'Ban OTR untuk Alat Berat, Pertambangan & Konstruksi',
    h1Highlight: 'OTR',
    tagline: 'Off-The-Road Tire untuk Dump Truck, Loader & Grader · 건설중장비 타이어',
    intro: [
      'CV Griptek Solusi menyediakan ban OTR (Off-The-Road) untuk dump truck, wheel loader, grader, dan alat berat tambang. Dirancang untuk medan ekstrem dengan ketahanan terhadap potongan, panas, dan beban berat.',
      'Melayani sektor pertambangan, konstruksi infrastruktur, dan port logistics di seluruh Indonesia dengan brand kelas dunia dan dukungan teknis pemilihan ukuran yang tepat untuk setiap aplikasi alat berat.',
    ],
    brand: { name: 'ASCENDO', ko: 'AD905 (Radial) / AE803 (Bias)', why: 'Ban OTR ASCENDO radial AD905 dan bias AE803 (E-3/L-3) untuk pertambangan, konstruksi, dan port. Alternatif: MAXAM (seri MS) dan TECHKING (ETCRANE/ETRTV).' },
    sizes: ['17.5-25', '20.5-25', '23.5-25', '26.5-25', '29.5R25', '14.00R25', '16.00R25', '18.00-25'],
    applications: [
      { en: 'Dump Truck', ko: '덤프 트럭' },
      { en: 'Wheel Loader', ko: '휠 로더' },
      { en: 'Motor Grader', ko: '모터 그레이더' },
      { en: 'Port & Container Handler', ko: '항만 하역장비' },
    ],
    industries: ['Pertambangan', 'Konstruksi', 'Port & Terminal', 'Heavy Equipment Rental'],
    faqs: [
      { q: 'Apa itu ban OTR?', a: 'OTR (Off-The-Road) adalah ban untuk alat berat yang beroperasi di luar jalan raya, seperti dump truck, wheel loader, dan grader di tambang dan lokasi konstruksi.' },
      { q: 'Ukuran ban OTR apa saja yang tersedia?', a: 'Kami menyediakan ukuran umum seperti 23.5R25, 26.5R25, dan 29.5R25, serta ukuran lain sesuai jenis alat berat dan aplikasi.' },
      { q: 'Apakah ban OTR cocok untuk operasi tambang yang berat?', a: 'Ya. Brand yang kami salurkan (ASCENDO, MAXAM) dirancang dengan compound dan konstruksi tahan ekstrem untuk operasi tambang dan port yang intensif.' },
    ],
  },
  {
    slug: 'ban-industri',
    badge: 'INDUSTRIAL TIRE · 산업용 타이어',
    title: 'Ban Industri Solid & Pneumatic — CV GRIPTEK Solusi Indonesia',
    metaDescription:
      'Distributor ban industrial solid & pneumatic di Indonesia — ASCENDO seri S1000/S2000. Untuk pabrik, gudang & material handling. Konsultasi teknis tersedia.',
    h1: 'Ban Industri Solid & Pneumatic untuk Peralatan Industri',
    h1Highlight: 'Industri',
    tagline: 'Solid & Pneumatic Industrial Tire · 산업용 타이어',
    intro: [
      'CV Griptek Solusi menyediakan ban industrial solid dan pneumatic untuk berbagai peralatan industri, material handling, dan logistik. Solusi ban tahan lama untuk operasi pabrik dan pergudangan intensif.',
      'Tersedia rentang produk lengkap untuk kebutuhan industrial di seluruh Indonesia, dengan dukungan teknis untuk memilih tipe dan ukuran ban yang sesuai dengan beban dan kondisi operasi Anda.',
    ],
    brand: { name: 'ASCENDO', ko: 'Solid S1000 / S2000', why: 'Ban industrial solid ASCENDO seri S1000 & S2000 untuk material handling dan peralatan industri, tersedia varian non-marking. Alternatif: DIAMOND seri XN.' },
    sizes: ['5.00-8', '6.00-9', '6.50-10', '7.00-12', '8.25-15', '28×9-15'],
    applications: [
      { en: 'Material Handling', ko: '자재 운반' },
      { en: 'Manufacturing Equipment', ko: '제조 설비' },
      { en: 'Warehouse Vehicle', ko: '창고 차량' },
      { en: 'Industrial Trailer', ko: '산업용 트레일러' },
    ],
    industries: ['Manufaktur', 'Logistik & Pergudangan', 'Material Handling', 'Industri Berat'],
    faqs: [
      { q: 'Kapan sebaiknya memilih ban industrial solid?', a: 'Ban solid ideal untuk lingkungan dengan risiko tusukan tinggi dan beban berat di permukaan keras, karena bebas perawatan tekanan dan tahan lama.' },
      { q: 'Apakah tersedia konsultasi teknis pemilihan ban industri?', a: 'Ya, tim teknis kami membantu memilih tipe dan ukuran ban industrial sesuai beban, kecepatan, dan kondisi operasi peralatan Anda.' },
      { q: 'Apakah melayani pengiriman ke seluruh Indonesia?', a: 'Ya. Berbasis di Jakarta Selatan, kami melayani Jakarta, Cikarang, Karawang, Tangerang, Bogor, hingga seluruh Indonesia.' },
    ],
  },
  {
    slug: 'ban-pertanian',
    badge: 'AGRICULTURAL TIRE · 농경용 타이어',
    title: 'Ban Pertanian Traktor & Harvester — GRIPTEK Solusi Indonesia',
    metaDescription:
      'Distributor ban pertanian (AGR) untuk traktor, harvester & perkebunan di Indonesia. ASCENDO R-1/R-1W untuk sawit, karet, tebu & pertanian besar.',
    h1: 'Ban Pertanian untuk Traktor, Harvester & Perkebunan',
    h1Highlight: 'Pertanian',
    tagline: 'Agricultural Tire untuk Traktor & Harvester · 농경용 타이어',
    intro: [
      'CV Griptek Solusi menyediakan ban pertanian (AGR) untuk traktor, harvester, dan kendaraan perkebunan. Dirancang untuk traksi optimal di lahan basah dan berlumpur serta daya tahan tinggi di medan pertanian.',
      'Melayani sektor sawit, karet, tebu, dan pertanian besar di seluruh Indonesia, termasuk koperasi dan perusahaan perkebunan, dengan dukungan pemilihan ukuran ban yang tepat untuk setiap jenis alat.',
    ],
    brand: { name: 'ASCENDO', ko: 'Pola R-1 / R-1W 12PR', why: 'Ban pertanian ASCENDO pola R-1 & R-1W (12PR) dengan traksi tinggi untuk traktor, harvester, dan perkebunan. Tersedia juga MAXAM radial (seri MS951R) untuk traktor modern.' },
    sizes: ['11.2-24', '12.4-24', '13.6-24', '14.9-28', '16.9-30', '18.4-30', '18.4-34', '23.1-26'],
    applications: [
      { en: 'Tractor', ko: '트랙터' },
      { en: 'Harvester', ko: '수확기' },
      { en: 'Plantation Vehicle', ko: '농장 차량' },
      { en: 'Implement & Trailer', ko: '농기계 트레일러' },
    ],
    industries: ['Pertanian & Perkebunan', 'Sawit & Karet', 'Tebu & Pertanian Besar', 'Koperasi Tani'],
    faqs: [
      { q: 'Ukuran ban traktor apa saja yang tersedia?', a: 'Kami menyediakan ukuran populer seperti 12.4-24, 14.9-28, dan 18.4-30, serta ukuran lain sesuai jenis traktor dan harvester.' },
      { q: 'Apakah ban pertanian ini cocok untuk perkebunan sawit?', a: 'Ya. Pola tapak traksi tinggi cocok untuk lahan basah dan berlumpur di perkebunan sawit, karet, dan tebu.' },
      { q: 'Apakah bisa konsultasi pemilihan ban untuk armada pertanian?', a: 'Tentu. Tim kami membantu memilih ukuran dan tipe ban yang sesuai dengan beban dan kondisi lahan untuk setiap kendaraan pertanian.' },
    ],
  },
];

/** slug → 카테고리 빠른 조회 */
export const CATEGORY_BY_SLUG: Record<string, ProductCategory> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);
