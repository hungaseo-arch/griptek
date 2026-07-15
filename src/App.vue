<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { CO } from '@/data/company';
import { CATEGORIES } from '@/data/categories';
import { productsOfCategory } from '@/data/products';
import { BIZ_DOCS } from '@/data/bizDocs';

const route = useRoute();

// 드롭다운: 호버(CSS group-hover)로 열림 + 클릭으로 고정. 바깥 클릭 시 닫힘.
const menuOpen = ref(false);   // Produk
const bizOpen = ref(false);    // Biz Form
function closeMenu(): void { menuOpen.value = false; bizOpen.value = false; }

// 현재 선택된 서류 문서(/biz?doc=) — 드롭다운 활성 표시용
const currentDoc = computed(() => String(route.query.doc ?? 'qt').toLowerCase());

// Produk 드롭다운: 카테고리 + 하위 규격 상세페이지(있으면) 중첩
const MENU = CATEGORIES.map((c) => ({
  slug: c.slug,
  label: c.badge.split('·')[0].trim(),
  products: productsOfCategory(c.slug).map((p) => ({
    path: `/${p.category}/${p.slug}`,
    label: `${p.size} · ${p.brand}`,
  })),
}));
</script>

<template>
  <div class="min-h-screen">
    <!-- ── Top bar (no-print) ── -->
    <!-- z-50: 페이지 콘텐츠(회사소개 hero 등 relative z-10)보다 위에 두어 드롭다운이 덮이지 않게 함 -->
    <div class="sticky top-0 left-0 w-full z-50">
      <div
        class="no-print bg-navy px-5 py-3 flex items-center justify-between
               shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      >
        <RouterLink to="/" class="flex items-center gap-3 cursor-pointer">
          <img src="/logo-griptec.png" alt="Logo CV GRIPTEK Solusi — Distributor Ban Komersial & Industri" class="h-9 w-auto object-contain" />
          <div class="text-left">
            <div class="text-gold font-bold text-[15px] tracking-[1px]">{{ CO.name }}</div>
            <div class="text-[#aac4df] text-[10px] mt-0.5">Distributor Resmi Ban Komersial & Industri</div>
          </div>
        </RouterLink>

        <div class="flex items-center gap-4">
          <nav class="flex items-center gap-1">
            <RouterLink
              to="/"
              class="px-4 py-1.5 text-[12px] font-bold rounded-md cursor-pointer transition-colors"
              :class="route.path === '/' ? 'bg-midblue text-white' : 'text-[#aac4df] hover:text-white'"
              @click="closeMenu"
            >Profil Perusahaan</RouterLink>

            <!-- Produk 드롭다운 — 호버(group-hover) 또는 클릭(menuOpen)으로 열림 -->
            <div class="relative group">
              <button
                type="button"
                class="flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-bold rounded-md cursor-pointer transition-colors"
                :class="route.path.startsWith('/ban-') ? 'bg-midblue text-white' : 'text-[#aac4df] hover:text-white'"
                @click="menuOpen = !menuOpen"
              >
                Jajaran Produk
                <svg class="w-3 h-3 transition-transform group-hover:rotate-180" :class="menuOpen ? 'rotate-180' : ''"
                     viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>

              <!-- 호버(group-hover:block) 또는 클릭(menuOpen) 시 표시. pt-1.5 브리지로 버튼-패널 틈 없음. -->
              <div
                class="absolute right-0 top-full pt-1.5 w-56 z-20"
                :class="menuOpen ? 'block' : 'hidden group-hover:block'"
              >
              <div class="bg-white rounded-lg shadow-xl ring-1 ring-black/5 py-1.5 max-h-[80vh] overflow-y-auto">
                <template v-for="m in MENU" :key="m.slug">
                  <!-- 카테고리 (랜딩 페이지) — 행 전체 폭·균일 높이 -->
                  <RouterLink
                    :to="`/${m.slug}`"
                    class="flex items-center justify-between gap-2 w-full px-4 h-10 text-[13px] font-bold text-navy hover:bg-graybg transition-colors"
                    :class="route.path === `/${m.slug}` ? 'bg-paleblue/60' : ''"
                    @click="closeMenu"
                  >
                    <span>{{ m.label }}</span>
                    <span v-if="m.products.length"
                          class="text-[10px] text-white bg-midblue rounded-full px-1.5 py-px font-semibold">{{ m.products.length }}</span>
                  </RouterLink>
                  <!-- 하위 규격 상세페이지 — 같은 높이, 들여쓰기로만 구분 -->
                  <RouterLink
                    v-for="p in m.products"
                    :key="p.path"
                    :to="p.path"
                    class="flex items-center w-full pl-8 pr-4 h-10 text-[12px] text-gray-600 hover:bg-graybg hover:text-midblue transition-colors"
                    :class="route.path === p.path ? 'text-midblue font-semibold bg-paleblue/40' : ''"
                    @click="closeMenu"
                  >{{ p.label }}</RouterLink>
                </template>
              </div><!-- /white panel -->
              </div><!-- /positioning bridge -->
            </div><!-- /relative -->

            <!-- Biz Form 드롭다운 — 호버 또는 클릭으로 열림, 문서 유형 선택 -->
            <div class="relative group">
              <button
                type="button"
                class="flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-bold rounded-md cursor-pointer transition-colors"
                :class="route.path === '/biz' ? 'bg-midblue text-white' : 'text-[#aac4df] hover:text-white'"
                @click="bizOpen = !bizOpen"
              >
                Biz Form
                <svg class="w-3 h-3 transition-transform group-hover:rotate-180" :class="bizOpen ? 'rotate-180' : ''"
                     viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>

              <div
                class="absolute right-0 top-full pt-1.5 w-56 z-20"
                :class="bizOpen ? 'block' : 'hidden group-hover:block'"
              >
              <div class="bg-white rounded-lg shadow-xl ring-1 ring-black/5 py-1.5 max-h-[80vh] overflow-y-auto">
                <!-- /biz 밖에서는 <a>(풀 로드) → 서버 Basic Auth 발동. /biz 안에서는 RouterLink(클라이언트 전환). -->
                <component
                  :is="route.path === '/biz' ? 'RouterLink' : 'a'"
                  v-for="d in BIZ_DOCS"
                  :key="d.id"
                  :to="route.path === '/biz' ? { path: '/biz', query: { doc: d.id } } : undefined"
                  :href="route.path !== '/biz' ? `/biz?doc=${d.id}` : undefined"
                  class="flex items-center gap-3 w-full px-4 h-10 text-[13px] font-semibold text-navy hover:bg-graybg transition-colors"
                  :class="route.path === '/biz' && currentDoc === d.id ? 'bg-paleblue/60' : ''"
                  @click="closeMenu"
                >
                  <span
                    class="inline-block rounded text-white px-1.5 py-px text-[10px] font-bold min-w-6.5 text-center"
                    :class="route.path === '/biz' && currentDoc === d.id ? 'bg-midblue' : 'bg-navy/70'"
                  >{{ d.short }}</span>
                  {{ d.label }}
                </component>
              </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- 드롭다운 바깥 클릭 닫기용 오버레이 — z-40: 헤더(z-50) 아래, 페이지 콘텐츠(z-10) 위 -->
    <div v-if="menuOpen || bizOpen" class="fixed inset-0 z-40" @click="closeMenu"></div>

    <!-- ── 라우트 콘텐츠 ── -->
    <div class="pt-8 pb-14">
      <RouterView />
    </div>
  </div>
</template>
