<script setup lang="ts">
// ─── 개별 제품(규격) 상세페이지 (/{category}/{slug}) ─────────────────────────
// 라우트가 category·slug 를 prop 으로 주입. products.ts 에서 콘텐츠 조회.
// <head> 메타·Product/Breadcrumb/FAQ 구조화 데이터는 라우터 afterEach 가 처리.
import { computed } from 'vue';
import { CO, PHONE_TEL } from '@/data/company';
import { CATEGORY_BY_SLUG } from '@/data/categories';
import { PRODUCT_BY_PATH, productsOfCategory, PRODUCTS } from '@/data/products';
import ChevronMotif from '@/components/ChevronMotif.vue';
import ContactCta from '@/components/ContactCta.vue';

const props = defineProps<{ category: string; slug: string }>();

const product = computed(() => PRODUCT_BY_PATH[`${props.category}/${props.slug}`] ?? PRODUCTS[0]);
const parent = computed(() => CATEGORY_BY_SLUG[product.value.category]);
// 같은 카테고리의 다른 규격(내부 링크)
const siblings = computed(() =>
  productsOfCategory(product.value.category).filter((p) => p.slug !== product.value.slug),
);
</script>

<template>
  <div class="profile max-w-5xl mx-auto px-5">
    <!-- ── Breadcrumb ── -->
    <nav class="text-[12px] text-gray-500 mb-4" aria-label="Breadcrumb">
      <RouterLink to="/" class="hover:text-midblue">Beranda</RouterLink>
      <span class="mx-1.5">/</span>
      <RouterLink v-if="parent" :to="`/${parent.slug}`" class="hover:text-midblue">{{ parent.h1Highlight }}</RouterLink>
      <span class="mx-1.5">/</span>
      <span class="text-navy font-semibold">{{ product.size }}</span>
    </nav>

    <!-- ── Hero / H1 ── -->
    <section class="bg-navy rounded-2xl overflow-hidden shadow-lg relative">
      <ChevronMotif />
      <div class="relative z-10 p-8 md:p-12">
        <div class="inline-block bg-gold/90 text-navy font-extrabold text-[11px] tracking-[2px] rounded-full px-3 py-1 mb-4">
          {{ product.brand }} · {{ product.pattern }}
        </div>
        <h1 class="text-white font-extrabold text-[26px] md:text-[34px] leading-tight max-w-3xl">{{ product.name }}</h1>
        <p class="text-[#aac4df] text-[13px] md:text-[14px] leading-relaxed mt-4 max-w-2xl">{{ product.description }}</p>
        <div class="flex flex-wrap gap-3 mt-6">
          <a :href="`tel:${PHONE_TEL}`"
             class="bg-gold text-navy font-extrabold text-[13px] rounded-full px-5 py-2.5 hover:brightness-95 transition">
            Minta Penawaran · 견적 문의
          </a>
          <a :href="`mailto:${CO.email}`"
             class="bg-white/10 text-white font-bold text-[13px] rounded-full px-5 py-2.5 border border-white/20 hover:bg-white/20 transition">
            {{ CO.email }}
          </a>
        </div>
      </div>
    </section>

    <!-- ── Spesifikasi ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Spesifikasi</h2>
        <p class="text-gray-500 text-[13px] italic">Specification · 규격 정보</p>
      </header>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-graybg rounded-xl p-4 border-t-[3px] border-midblue">
          <div class="text-gray-500 text-[11px]">Ukuran · 규격</div>
          <div class="text-navy font-bold text-[15px] mt-1">{{ product.size }}</div>
        </div>
        <div class="bg-graybg rounded-xl p-4 border-t-[3px] border-midblue">
          <div class="text-gray-500 text-[11px]">Brand · 브랜드</div>
          <div class="text-midblue font-bold text-[15px] mt-1">{{ product.brand }}</div>
        </div>
        <div class="bg-graybg rounded-xl p-4 border-t-[3px] border-midblue">
          <div class="text-gray-500 text-[11px]">Tipe · 타입</div>
          <div class="text-navy font-bold text-[14px] mt-1">{{ product.type }}</div>
          <div class="text-midblue text-[12px] font-semibold mt-0.5">Pola {{ product.pattern }}</div>
        </div>
        <div class="bg-graybg rounded-xl p-4 border-t-[3px] border-midblue">
          <div class="text-gray-500 text-[11px]">Kategori · 분류</div>
          <RouterLink v-if="parent" :to="`/${parent.slug}`" class="text-midblue font-bold text-[14px] mt-1 block hover:underline">
            {{ parent.h1Highlight }} →
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── Highlights + Aplikasi ── -->
    <section class="mt-12 grid md:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm">
        <h2 class="text-navy font-extrabold text-[18px]">Keunggulan</h2>
        <p class="text-gray-500 text-[12px] italic mb-4">Highlights · 핵심 특징</p>
        <ul class="space-y-3">
          <li v-for="h in product.highlights" :key="h" class="flex gap-3 text-gray-700 text-[13px] leading-relaxed">
            <span class="mt-1.5 h-2 w-2 rounded-full bg-midblue shrink-0"></span>{{ h }}
          </li>
        </ul>
      </div>
      <div class="bg-navy rounded-2xl p-7 text-white">
        <h2 class="text-white font-extrabold text-[18px]">Aplikasi Utama</h2>
        <p class="text-[#aac4df] text-[12px] italic mb-4">Main Applications · 주요 적용처</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="a in product.applications" :key="a"
                class="bg-midblue text-white text-[13px] font-semibold rounded-full px-4 py-1.5">{{ a }}</span>
        </div>
      </div>
    </section>

    <!-- ── FAQ ── -->
    <section class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Pertanyaan Umum</h2>
        <p class="text-gray-500 text-[13px] italic">FAQ · 자주 묻는 질문</p>
      </header>
      <div class="space-y-3">
        <details v-for="(f, i) in product.faqs" :key="i"
                 class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <summary class="text-navy font-bold text-[14px] cursor-pointer">{{ f.q }}</summary>
          <p class="text-gray-600 text-[13px] leading-relaxed mt-3">{{ f.a }}</p>
        </details>
      </div>
    </section>

    <!-- ── 내부 링크: 같은 카테고리 다른 규격 ── -->
    <section v-if="siblings.length" class="mt-12">
      <header class="mb-5">
        <h2 class="text-navy font-extrabold text-[26px]">Ukuran Lain</h2>
        <p class="text-gray-500 text-[13px] italic">Other Sizes · 다른 규격</p>
      </header>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink v-for="s in siblings" :key="s.slug" :to="`/${s.category}/${s.slug}`"
                    class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-midblue transition block">
          <div class="h-1 w-10 bg-midblue rounded mb-4"></div>
          <h3 class="text-navy font-bold text-[15px]">{{ s.size }} — {{ s.brand }}</h3>
          <div class="text-midblue text-[12px] font-semibold mt-2">Lihat detail →</div>
        </RouterLink>
      </div>
    </section>

    <!-- ── Contact CTA ── -->
    <ContactCta
      eyebrow="PENAWARAN HARGA"
      title="Minta Penawaran"
      :highlight="product.size"
      subtitle="Hubungi kami untuk ketersediaan stok dan harga distributor yang kompetitif."
    />
  </div>
</template>
