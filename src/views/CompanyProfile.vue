<script setup lang="ts">
// ─── CV GRIPTEK Solusi — 회사 소개 (Company Profile) 홈 ──────────────────────
// 첨부 Company Profile PDF 내용을 기반으로 구성. 연락처는 단일 출처인 CO 를 사용.
import { CO, PHONE_TEL } from '@/data/company';
import ChevronMotif from '@/components/ChevronMotif.vue';
import ContactCta from '@/components/ContactCta.vue';

// About — 핵심 지표
const ABOUT_STATS = [
  { value: 'Distribusi Ban', label: 'Bidang Usaha · 사업 분야' },
  { value: '6 Brand Utama',  label: 'Brand Mitra · 취급 브랜드' },
  { value: '5 Segmen',       label: 'Kategori Produk · 제품 카테고리' },
  { value: 'Jakarta Selatan',label: 'Lokasi · 위치' },
];

// 미션
const MISSION = [
  'Menyediakan ban berkualitas premium dari brand global terpercaya',
  'Membangun kemitraan jangka panjang dengan pelanggan industri',
  'Memberikan layanan teknis dan after-sales yang prima',
  'Mendukung produktivitas sektor logistik, pertanian, dan industri',
];

// 서비스 & 제품 — 5개 카테고리 (각 전용 랜딩 페이지로 연결)
const SERVICES = [
  { en: 'Truck & Bus Tire', ko: '트럭·버스 타이어', slug: 'ban-truk-bus',  desc: 'Ban radial dan bias untuk kendaraan komersial jarak jauh dan transportasi penumpang.' },
  { en: 'OTR Tire',         ko: '건설중장비 타이어', slug: 'ban-otr',       desc: 'Off-The-Road tire untuk dump truck, wheel loader, grader, dan alat berat tambang.' },
  { en: 'AGR Tire',         ko: '농경용 타이어',     slug: 'ban-pertanian', desc: 'Ban pertanian untuk traktor, harvester, dan kendaraan perkebunan.' },
  { en: 'Industrial Tire',  ko: '산업용 타이어',     slug: 'ban-industri',  desc: 'Solid dan pneumatic tire untuk peralatan industri dan logistik.' },
  { en: 'Forklift Tire',    ko: '지게차 타이어',     slug: 'ban-forklift',  desc: 'Ban forklift solid press-on dan pneumatic untuk warehouse dan pabrik.' },
];

// 브랜드 파트너 — 실제 취급 6개 브랜드 (카탈로그 품목 기준 설명)
const BRANDS = [
  { name: 'ASCENDO',  tag: 'Full-Range Commercial Tire',  ko: '전 카테고리 메인 브랜드', desc: 'Brand utama lini lengkap — ban truk & bus (radial AR / bias AB), OTR (AE803 / AD905), pertanian (R-1 / R-1W), serta solid forklift & industrial (S1000 / S2000).' },
  { name: 'TECHKING', tag: 'Premium Truck Radial (TBR)',  ko: '프리미엄 트럭 레이디얼',   desc: 'Ban truk radial (TBR) seri ETOT, TKAM, dan ETFN untuk logistik jarak jauh, dengan opsi OTR radial (ETCRANE / ETRTV) untuk crane dan alat berat.' },
  { name: 'TIRON',    tag: 'Truck & Bus Bias (TBB)',      ko: '트럭·버스 바이어스 타이어', desc: 'Ban truk & bus bias (TBB) seri HS dengan rentang pola lengkap (HS309 / HS314 / HS500 / HS700) untuk beban berat dan medan campuran.' },
  { name: 'MAXAM',    tag: 'OTR & Agricultural Radial',   ko: 'OTR·농경 레이디얼 전문',    desc: 'Ban OTR (MS905 / MS913) dan pertanian radial (MS951R / MS950) untuk alat berat, traktor, dan harvester modern.' },
  { name: 'DIAMOND',  tag: 'Solid Forklift Tire',         ko: '지게차 솔리드 타이어',      desc: 'Ban solid forklift seri XN (XN-018 / XN-028) untuk warehouse dan material handling, tersedia varian non-marking.' },
  { name: 'JK TYRE',  tag: 'Truck & Bus Bias (TBB)',      ko: '트럭·버스 바이어스 타이어', desc: 'Ban truk & bus bias seri JET (JET ACE / JET POWER / TIPPERKING) untuk angkutan dan dump truck.' },
];

// 제품 포트폴리오
const PORTFOLIO = [
  { cat: 'Truck & Bus Tire', app: 'Logistik jarak jauh, transportasi', brand: 'ASCENDO',  size: '11R22.5, 12R22.5, 295/80R22.5' },
  { cat: 'OTR Tire',         app: 'Pertambangan, konstruksi, port',    brand: 'ASCENDO',  size: '23.5-25, 26.5-25, 29.5R25' },
  { cat: 'AGR Tire',         app: 'Traktor, harvester, perkebunan',    brand: 'ASCENDO',    size: '12.4-24, 14.9-28, 18.4-30' },
  { cat: 'Forklift Tire',    app: 'Warehouse, manufaktur, pelabuhan',  brand: 'ASCENDO',    size: 'Solid & Pneumatic Series' },
];

// 핵심 경쟁력
const ADVANTAGES = [
  { en: 'Kualitas Premium',   ko: '프리미엄 품질', desc: 'Hanya menyalurkan brand global teruji dengan sertifikasi standar internasional.' },
  { en: 'Stok Lengkap',       ko: '재고 다양화',   desc: 'Variasi ukuran dan tipe lengkap untuk seluruh kategori ban komersial.' },
  { en: 'Pengiriman Cepat',   ko: '신속한 배송',   desc: 'Jaringan logistik yang efisien untuk seluruh wilayah Indonesia.' },
  { en: 'Dukungan Teknis',    ko: '기술 지원',     desc: 'Tim teknis berpengalaman memberikan konsultasi pemilihan ban yang tepat.' },
  { en: 'Harga Kompetitif',   ko: '가격 경쟁력',   desc: 'Skema harga distributor yang kompetitif dengan terms pembayaran fleksibel.' },
  { en: 'Layanan Purna Jual', ko: '사후 관리',     desc: 'Garansi produk dan dukungan after-sales yang menyeluruh.' },
];

// 타겟 산업
const INDUSTRIES = [
  { en: 'Logistik & Transportasi', ko: '물류·운송',   items: ['Fleet operator', 'Trucking company', 'Bus & angkutan umum'] },
  { en: 'Pertambangan',            ko: '광업',        items: ['Coal mining', 'Mineral mining', 'Quarry operation'] },
  { en: 'Konstruksi',              ko: '건설업',      items: ['Infrastruktur', 'Heavy equipment rental', 'Project contractor'] },
  { en: 'Pertanian & Perkebunan',  ko: '농업·농장',   items: ['Sawit & karet', 'Tebu & pertanian besar', 'Cooperatives'] },
  { en: 'Manufaktur & Gudang',     ko: '제조·창고',   items: ['Warehouse logistics', 'Manufacturing plant', 'Distribution center'] },
  { en: 'Port & Terminal',         ko: '항만·터미널', items: ['Container terminal', 'Cargo handling', 'Port operator'] },
];

// Why choose us — 지표
const WHY_STATS = [
  { value: '6',    en: 'Global Brands',      ko: '글로벌 브랜드' },
  { value: '5',    en: 'Product Categories', ko: '제품 카테고리' },
  { value: '100+', en: 'SKU Variants',       ko: '제품 SKU' },
  { value: '24/7', en: 'Customer Support',   ko: '고객 지원' },
];

// 판매 지역
const SALES_AREAS = {
  primary: {
    ko: '중점 판매 지역', id: 'Area Penjualan Utama',
    items: ['Jakarta', 'Cikarang', 'Karawang', 'Tangerang', 'Bogor'],
  },
  other: {
    ko: '기타 공급 지역', id: 'Area Suplai Lainnya',
    items: ['Semarang', 'Surabaya'],
    note: '인도네시아 전국 공급 가능 · Seluruh Indonesia',
  },
};
</script>

<template>
  <div class="profile max-w-5xl mx-auto px-5">
    <!-- ── 지게차 타이어 전문 (요약 — 상세는 전용 페이지 /ban-forklift) ── -->
    <section >
      <div class="bg-navy rounded-2xl overflow-hidden shadow-lg relative">
        <!-- 셰브론 모티프 -->
        <ChevronMotif :opacity="0.15" />
        <div class="relative z-10 p-8 md:p-10">
          <div class="inline-block bg-gold/90 text-navy font-extrabold text-[11px] tracking-[2px] rounded-full px-3 py-1 mb-4">
            DISTRIBUTOR BAN KOMERSIAL & INDUSTRI · 상용·산업용 타이어 유통
          </div>
          <h1 class="text-white font-extrabold text-[22px] md:text-[26px] leading-tight">
            인도네시아 진출 <span class="text-midblue">한국기업</span> 지게차·상용차 타이어 전문 공급
          </h1>
          <p class="text-[#aac4df] text-[13px] leading-relaxed mt-3 max-w-2xl">
            <span class="text-lightblue italic">Spesialis Ban Forklift & Komersial untuk perusahaan Korea di Indonesia.</span>
          </p>
        </div>
      </div>
    </section>

    <!-- ── About Us ── -->
    <section>
      <header class="mt-10 mb-10">
        <h2 class="text-navy font-extrabold text-[26px]">Tentang Kami</h2>
        <p class="text-gray-500 text-[13px] italic">About Us · 회사 개요</p>
      </header>



      <div class="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h3 class="text-navy font-bold text-[18px] mb-3">Mitra Terpercaya untuk Industri Ban Komersial</h3>
          <div class="h-0.5 w-12 bg-gold mb-4"></div>
          <p class="text-gray-700 text-[14px] leading-relaxed mb-3">
            <b>CV Griptek Solusi</b> adalah perusahaan distribusi suku cadang otomotif yang berfokus pada
            industri ban komersial dan industrial di Indonesia.
          </p>
          <p class="text-gray-600 text-[13px] leading-relaxed">
            Berbasis di Jakarta Selatan, kami menyediakan ban berkualitas untuk truk, bus, alat berat (OTR),
            pertanian (AGR), industri, dan forklift dari brand terkemuka.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="s in ABOUT_STATS" :key="s.label"
               class="bg-graybg rounded-xl p-4 border-t-[3px] border-midblue">
            <div class="text-midblue font-bold text-[15px]">{{ s.value }}</div>
            <div class="text-gray-500 text-[11px] mt-1">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Vision & Mission ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Visi &amp; Misi</h2>
        <p class="text-gray-500 text-[13px] italic">Vision &amp; Mission · 비전과 미션</p>
      </header>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-navy rounded-2xl p-7 text-white">
          <div class="text-midblue font-bold tracking-[3px] text-[12px]">VISI · Vision</div>
          <h3 class="font-bold text-[19px] mt-4 leading-snug">
            Menjadi distributor ban komersial dan industri terdepan di Indonesia
          </h3>
          <p class="text-[#aac4df] text-[13px] italic mt-5 leading-relaxed">
            Memberikan solusi mobilitas dan produktivitas terbaik melalui produk berkualitas global dan layanan profesional.
          </p>
        </div>
        <div class="bg-graybg rounded-2xl p-7">
          <div class="text-midblue font-bold tracking-[3px] text-[12px]">MISI · Mission</div>
          <ul class="mt-4 space-y-3">
            <li v-for="m in MISSION" :key="m" class="flex gap-3 text-gray-700 text-[13px] leading-relaxed">
              <span class="mt-1.5 h-2 w-2 rounded-full bg-midblue shrink-0"></span>{{ m }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── Services & Products ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Layanan &amp; Produk</h2>
        <p class="text-gray-500 text-[13px] italic">Services &amp; Products · 서비스 및 제품</p>
      </header>
      <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <RouterLink v-for="s in SERVICES" :key="s.en" :to="`/${s.slug}`"
             class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-midblue hover:shadow-md transition block">
          <div class="h-1 w-10 bg-midblue rounded mb-4"></div>
          <h3 class="text-navy font-bold text-[15px]">{{ s.en }}</h3>
          <div class="text-midblue text-[12px] font-semibold mt-1">{{ s.ko }}</div>
          <p class="text-gray-600 text-[12px] leading-relaxed mt-3">{{ s.desc }}</p>
          <div class="text-midblue text-[12px] font-bold mt-3">Selengkapnya →</div>
        </RouterLink>
      </div>
    </section>

    <!-- ── Brand Partners ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Brand Mitra</h2>
        <p class="text-gray-500 text-[13px] italic">Brand Partners · 취급 브랜드</p>
      </header>
      <div class="grid md:grid-cols-3 gap-5">
        <div v-for="b in BRANDS" :key="b.name" class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div class="bg-navy px-6 py-6">
            <div class="text-white font-extrabold text-[24px] tracking-wide">{{ b.name }}</div>
            <div class="text-[#aac4df] text-[12px] italic mt-1">{{ b.tag }}</div>
          </div>
          <div class="bg-white p-6">
            <div class="h-0.5 w-10 bg-gold mb-3"></div>
            <div class="text-midblue font-bold text-[14px] mb-3">{{ b.ko }}</div>
            <p class="text-gray-600 text-[13px] leading-relaxed">{{ b.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Product Portfolio ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Portofolio Produk</h2>
        <p class="text-gray-500 text-[13px] italic">Product Portfolio · 제품 포트폴리오</p>
      </header>
      <div class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="w-full text-[13px] border-collapse">
          <thead>
            <tr class="bg-navy text-white text-left">
              <th class="px-4 py-3 font-semibold">Kategori</th>
              <th class="px-4 py-3 font-semibold">Aplikasi Utama</th>
              <th class="px-4 py-3 font-semibold">Brand</th>
              <th class="px-4 py-3 font-semibold">Tipe Ukuran</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in PORTFOLIO" :key="p.cat" :class="i % 2 ? 'bg-paleblue/40' : 'bg-white'">
              <td class="px-4 py-3 font-bold text-navy">{{ p.cat }}</td>
              <td class="px-4 py-3 text-gray-600">{{ p.app }}</td>
              <td class="px-4 py-3 font-bold text-midblue">{{ p.brand }}</td>
              <td class="px-4 py-3 text-gray-700">{{ p.size }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-gray-400 text-[12px] italic mt-3">
        ※ Ukuran dan tipe lainnya tersedia berdasarkan permintaan. Hubungi kami untuk konsultasi spesifikasi.
      </p>
    </section>

    <!-- ── Advantages ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Keunggulan Kami</h2>
        <p class="text-gray-500 text-[13px] italic">Our Advantages · 핵심 경쟁력</p>
      </header>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="a in ADVANTAGES" :key="a.en"
             class="bg-white rounded-xl p-5 border border-gray-200 border-l-4 border-l-midblue shadow-sm">
          <h3 class="text-navy font-bold text-[15px]">{{ a.en }}</h3>
          <div class="text-midblue text-[12px] font-semibold mt-1">{{ a.ko }}</div>
          <p class="text-gray-600 text-[12px] leading-relaxed mt-3">{{ a.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── Target Industries ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Target Industri</h2>
        <p class="text-gray-500 text-[13px] italic">Target Industries · 타겟 산업</p>
      </header>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="ind in INDUSTRIES" :key="ind.en"
             class="bg-graybg rounded-xl p-5 border-t-[3px] border-midblue">
          <h3 class="text-navy font-bold text-[15px]">{{ ind.en }}</h3>
          <div class="text-midblue text-[12px] font-semibold mt-1 mb-3">{{ ind.ko }}</div>
          <ul class="space-y-1.5">
            <li v-for="it in ind.items" :key="it" class="flex gap-2 text-gray-600 text-[12px]">
              <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-midblue shrink-0"></span>{{ it }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── Why Choose Us ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Mengapa Memilih Kami</h2>
        <p class="text-gray-500 text-[13px] italic">Why Choose Us · 선택의 이유</p>
      </header>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="w in WHY_STATS" :key="w.en" class="bg-navy rounded-xl p-6 text-center">
          <div class="text-lightblue font-extrabold text-[34px] leading-none">{{ w.value }}</div>
          <div class="text-white font-bold text-[13px] mt-3">{{ w.en }}</div>
          <div class="text-[#aac4df] text-[11px] italic mt-1">{{ w.ko }}</div>
        </div>
      </div>
    </section>

    <!-- ── Sales Areas / 판매 지역 ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Area Penjualan</h2>
        <p class="text-gray-500 text-[13px] italic">Sales Areas · 판매 지역</p>
      </header>
      <div class="grid md:grid-cols-2 gap-5">
        <!-- 중점 판매 지역 -->
        <div class="bg-navy rounded-2xl p-7 text-white relative overflow-hidden">
          <div class="text-gold font-bold tracking-[2px] text-[11px]">{{ SALES_AREAS.primary.id }}</div>
          <div class="font-extrabold text-[18px] mt-1">{{ SALES_AREAS.primary.ko }}</div>
          <div class="h-0.5 w-12 bg-gold mt-3 mb-5"></div>
          <div class="flex flex-wrap gap-2">
            <span v-for="a in SALES_AREAS.primary.items" :key="a"
                  class="bg-midblue text-white text-[13px] font-semibold rounded-full px-4 py-1.5">{{ a }}</span>
          </div>
        </div>
        <!-- 기타 공급 지역 -->
        <div class="bg-graybg rounded-2xl p-7">
          <div class="text-midblue font-bold tracking-[2px] text-[11px]">{{ SALES_AREAS.other.id }}</div>
          <div class="text-navy font-extrabold text-[18px] mt-1">{{ SALES_AREAS.other.ko }}</div>
          <div class="h-0.5 w-12 bg-midblue mt-3 mb-5"></div>
          <div class="flex flex-wrap gap-2">
            <span v-for="a in SALES_AREAS.other.items" :key="a"
                  class="bg-white border border-midblue text-midblue text-[13px] font-semibold rounded-full px-4 py-1.5">{{ a }}</span>
          </div>
          <p class="text-gray-600 text-[13px] font-medium mt-4">📦 {{ SALES_AREAS.other.note }}</p>
        </div>
      </div>
    </section>

    <!-- ── Contact ── -->
    <ContactCta
      eyebrow="TERIMA KASIH"
      title="Mari Berbisnis"
      highlight="Bersama Kami"
      subtitle="Hubungi kami untuk konsultasi kebutuhan ban komersial dan industri Anda."
      show-address
    />
  </div>
</template>
