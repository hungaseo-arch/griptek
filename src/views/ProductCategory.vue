<script setup lang="ts">
// ─── 제품 카테고리 랜딩 페이지 (/ban-*) ───────────────────────────────────────
// 라우트가 slug 를 prop 으로 주입. categories.ts 에서 콘텐츠를 조회해 렌더링한다.
// <head> 메타·구조화 데이터는 라우터 afterEach 가 처리(SEO).
import { computed } from 'vue';
import { CO, PHONE_TEL } from '@/data/company';
import { CATEGORIES, CATEGORY_BY_SLUG } from '@/data/categories';
import { productsOfCategory } from '@/data/products';
import ChevronMotif from '@/components/ChevronMotif.vue';
import ContactCta from '@/components/ContactCta.vue';

const props = defineProps<{ slug: string }>();

const cat = computed(() => CATEGORY_BY_SLUG[props.slug] ?? CATEGORIES[0]);
// 내부 링크 — 다른 카테고리(현재 제외)
const others = computed(() => CATEGORIES.filter((c) => c.slug !== cat.value.slug));
// 이 카테고리의 개별 제품(규격) 상세페이지
const products = computed(() => productsOfCategory(cat.value.slug));
</script>

<template>
  <div class="profile max-w-5xl mx-auto px-5">
    <!-- ── Breadcrumb (내부 링크 + 사용자 탐색) ── -->
    <nav class="text-[12px] text-gray-500 mb-4" aria-label="Breadcrumb">
      <RouterLink to="/" class="hover:text-midblue">Beranda</RouterLink>
      <span class="mx-1.5">/</span>
      <span class="text-navy font-semibold">{{ cat.h1 }}</span>
    </nav>

    <!-- ── Hero / H1 ── -->
    <section class="bg-navy rounded-2xl overflow-hidden shadow-lg relative">
      <ChevronMotif />
      <div class="relative z-10 p-8 md:p-12">
        <div class="inline-block bg-gold/90 text-navy font-extrabold text-[11px] tracking-[2px] rounded-full px-3 py-1 mb-4">
          {{ cat.badge }}
        </div>
        <h1 class="text-white font-extrabold text-[26px] md:text-[34px] leading-tight max-w-3xl">
          {{ cat.h1 }}
        </h1>
        <p class="text-lightblue text-[14px] md:text-[15px] font-semibold italic mt-3">{{ cat.tagline }}</p>
        <div class="mt-4 max-w-2xl space-y-3">
          <p v-for="(p, i) in cat.intro" :key="i" class="text-[#aac4df] text-[13px] md:text-[14px] leading-relaxed">{{ p }}</p>
        </div>
        <div class="flex flex-wrap gap-3 mt-6">
          <a :href="`tel:${PHONE_TEL}`"
             class="bg-gold text-navy font-extrabold text-[13px] rounded-full px-5 py-2.5 hover:brightness-95 transition">
            Hubungi Kami · 견적 문의
          </a>
          <a :href="`mailto:${CO.email}`"
             class="bg-white/10 text-white font-bold text-[13px] rounded-full px-5 py-2.5 border border-white/20 hover:bg-white/20 transition">
            {{ CO.email }}
          </a>
        </div>
      </div>
    </section>

    <!-- ── Applications ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Aplikasi Utama</h2>
        <p class="text-gray-500 text-[13px] italic">Main Applications · 주요 적용처</p>
      </header>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="a in cat.applications" :key="a.en"
             class="bg-graybg rounded-xl p-5 border-t-[3px] border-midblue">
          <h3 class="text-navy font-bold text-[15px]">{{ a.en }}</h3>
          <div class="text-midblue text-[12px] font-semibold mt-1">{{ a.ko }}</div>
        </div>
      </div>
    </section>

    <!-- ── Recommended Brand + Sizes ── -->
    <section class="mt-12 grid md:grid-cols-2 gap-6">
      <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <div class="bg-navy px-6 py-6">
          <div class="text-[#aac4df] text-[11px] tracking-[2px] font-bold">BRAND REKOMENDASI · 추천 브랜드</div>
          <div class="text-white font-extrabold text-[24px] tracking-wide mt-1">{{ cat.brand.name }}</div>
          <div class="text-[#aac4df] text-[12px] italic mt-1">{{ cat.brand.ko }}</div>
        </div>
        <div class="bg-white p-6">
          <div class="h-0.5 w-10 bg-gold mb-3"></div>
          <p class="text-gray-600 text-[13px] leading-relaxed">{{ cat.brand.why }}</p>
        </div>
      </div>
      <div class="bg-graybg rounded-2xl p-7">
        <h2 class="text-navy font-extrabold text-[18px]">Ukuran Tersedia</h2>
        <p class="text-gray-500 text-[12px] italic mb-4">Available Sizes · 대표 규격</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="s in cat.sizes" :key="s"
                class="bg-white border border-midblue text-midblue text-[13px] font-semibold rounded-full px-4 py-1.5">{{ s }}</span>
        </div>
        <p class="text-gray-400 text-[12px] italic mt-4">※ Ukuran lain tersedia berdasarkan permintaan.</p>
      </div>
    </section>

    <!-- ── 규격별 상세 (개별 제품 페이지 내부 링크) ── -->
    <section v-if="products.length" class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Detail per Ukuran</h2>
        <p class="text-gray-500 text-[13px] italic">Product Detail by Size · 규격별 상세</p>
      </header>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink v-for="p in products" :key="p.slug" :to="`/${p.category}/${p.slug}`"
                    class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-midblue transition block">
          <div class="h-1 w-10 bg-gold rounded mb-4"></div>
          <h3 class="text-navy font-bold text-[16px]">{{ p.size }}</h3>
          <div class="text-midblue text-[12px] font-semibold mt-1">{{ p.brand }} · {{ p.type }}</div>
          <div class="text-midblue text-[12px] font-semibold mt-3">Lihat detail →</div>
        </RouterLink>
      </div>
    </section>

    <!-- ── Target Industries ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Target Industri</h2>
        <p class="text-gray-500 text-[13px] italic">Target Industries · 타겟 산업</p>
      </header>
      <div class="flex flex-wrap gap-2">
        <span v-for="ind in cat.industries" :key="ind"
              class="bg-navy text-white text-[13px] font-semibold rounded-full px-4 py-1.5">{{ ind }}</span>
      </div>
    </section>

    <!-- ── FAQ (FAQPage 구조화 데이터와 동기화) ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Pertanyaan Umum</h2>
        <p class="text-gray-500 text-[13px] italic">FAQ · 자주 묻는 질문</p>
      </header>
      <div class="space-y-3">
        <details v-for="(f, i) in cat.faqs" :key="i"
                 class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <summary class="text-navy font-bold text-[14px] cursor-pointer">{{ f.q }}</summary>
          <p class="text-gray-600 text-[13px] leading-relaxed mt-3">{{ f.a }}</p>
        </details>
      </div>
    </section>

    <!-- ── 내부 링크: 다른 제품 카테고리 ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Kategori Lainnya</h2>
        <p class="text-gray-500 text-[13px] italic">Other Categories · 다른 제품</p>
      </header>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink v-for="o in others" :key="o.slug" :to="`/${o.slug}`"
                    class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-midblue transition block">
          <div class="h-1 w-10 bg-midblue rounded mb-4"></div>
          <h3 class="text-navy font-bold text-[15px] leading-snug">{{ o.h1 }}</h3>
          <div class="text-midblue text-[12px] font-semibold mt-2">Selengkapnya →</div>
        </RouterLink>
      </div>
    </section>

    <!-- ── Contact CTA ── -->
    <ContactCta
      eyebrow="KONSULTASI GRATIS"
      title="Butuh Konsultasi"
      :highlight="cat.h1Highlight"
      suffix="?"
      subtitle="Hubungi kami untuk konsultasi spesifikasi dan penawaran harga distributor."
      show-address
    />
  </div>
</template>
