<script setup lang="ts">
// ─── Biz Form (서류 작성) — 로그인 게이트 영역, noindex ───────────────────────
// 문서 유형 선택은 네비바 드롭다운(App.vue) → URL 쿼리(/biz?doc=po)로 관리.
// 여기서는 쿼리에 따라 해당 문서 컴포넌트를 렌더링하고 CRUD/캐리포워드/프린트를 캡슐화.
import { shallowRef, computed, provide, ref, onMounted, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ACTIVE_DOC, CARRY_BUFFER, type DocController, type CarryBuffer } from '@/composables/useDocManager';
import { NEXT_TYPE, mapCarry } from '@/lib/carryForward';
import { BIZ_DOCS, isBizDoc } from '@/data/bizDocs';
import { asuraRole, asuraReady, isAsuraConfigured, initAsuraSession, signOutAsura } from '@/lib/asuraDb';
import { countLocalDocs, migrateLocalToDb } from '@/lib/migrateLocalDocs';
import DocManagerBar from '@/components/DocManagerBar.vue';
import EmailLogin from '@/components/EmailLogin.vue';
import PurchasingOrder from '@/views/PurchasingOrder.vue';
import ProformaInvoice from '@/views/ProformaInvoice.vue';
import CommercialInvoice from '@/views/CommercialInvoice.vue';
import PackingList from '@/views/PackingList.vue';
import Quotation from '@/views/Quotation.vue';

// 문서 id → 컴포넌트
const COMP: Record<string, Component> = {
  qt: Quotation,
  po: PurchasingOrder,
  pi: ProformaInvoice,
  ci: CommercialInvoice,
  pl: PackingList,
};

const route = useRoute();
const router = useRouter();

// 활성 문서: ?doc 쿼리 (없거나 잘못되면 기본 qt)
const active = computed(() => {
  const d = String(route.query.doc ?? 'qt').toLowerCase();
  return isBizDoc(d) ? d : 'qt';
});
const activeComp = computed<Component>(() => COMP[active.value] ?? Quotation);
const activeTab = computed(() => BIZ_DOCS.find((t) => t.id === active.value) ?? BIZ_DOCS[0]);

// 현재 활성 문서가 자신의 CRUD 컨트롤러를 등록하는 슬롯. DocManagerBar 가 이를 제어한다.
const activeDoc = shallowRef<DocController | null>(null);
provide(ACTIVE_DOC, activeDoc);

// 다음 단계 문서로 내용을 넘기는 핸드오프 버퍼. 문서 전환 시 뷰가 언마운트되므로 상위에 둔다.
const carryBuffer = shallowRef<CarryBuffer | null>(null);
provide(CARRY_BUFFER, carryBuffer);

function onCarry(): void {
  const ctrl = activeDoc.value;
  if (!ctrl) return;
  const to = NEXT_TYPE[ctrl.docType];
  if (!to) return;
  carryBuffer.value = { toType: to, data: mapCarry(ctrl.docType, ctrl.snapshot()) };
  // 다음 문서로 라우팅(쿼리 변경) → activeComp 가 교체되며 carryBuffer 를 읽어 반영
  router.push({ path: '/biz', query: { doc: to.toLowerCase() } });
}

// 문서 저장/불러오기는 DB(API) — 로그인 필요. /biz 전체에 공용 로그인.
const showLogin = ref(false);
const localCount = ref(0);
const migrating = ref(false);
onMounted(async () => {
  if (isAsuraConfigured && !asuraReady.value) await initAsuraSession();
  localCount.value = await countLocalDocs();
});
async function logout(): Promise<void> { await signOutAsura(); }

// 로컬(localStorage) 문서 → DB 1회 일괄 이전.
async function migrate(): Promise<void> {
  if (migrating.value) return;
  if (!window.confirm(`로컬에 저장된 문서 ${localCount.value}건을 DB로 이전합니다. 진행할까요?`)) return;
  migrating.value = true;
  try {
    const r = await migrateLocalToDb();
    localCount.value = await countLocalDocs();
    if (r.failed === 0) window.alert(`${r.migrated}건 이전 완료. (로컬은 백업 후 정리됨)`);
    else window.alert(`이전 결과 — 성공 ${r.migrated} · 실패 ${r.failed}\n${r.errors.slice(0, 5).join('\n')}`);
  } finally {
    migrating.value = false;
  }
}
</script>

<template>
  <div class="doc-area pt-7 pb-12">
    <component :is="activeComp" />

    <!-- ── 문서 액션 레일 (no-print) — 화면 오른쪽 세로 고정 ── -->
    <aside
      class="no-print fixed right-4 bottom-4 z-20 w-44
             bg-navy/95 backdrop-blur rounded-xl shadow-2xl p-3 flex flex-col gap-2"
    >
      <div class="flex items-center gap-2 pb-2 mb-1 border-b border-white/10
                  text-[#aac4df] text-[11px] font-bold">
        <span class="inline-block rounded bg-midblue text-white px-1.5 py-px text-[10px]">{{ activeTab.short }}</span>
        <span class="truncate">{{ activeTab.label }}</span>
      </div>

      <!-- 로그인 (문서 저장/불러오기는 DB → 로그인 필요) -->
      <div v-if="isAsuraConfigured" class="text-[10px] mb-0.5">
        <button v-if="!asuraRole" type="button"
                class="w-full rounded bg-white/10 text-white py-1 font-bold hover:bg-white/20 cursor-pointer"
                @click="showLogin = true">🔑 로그인 (저장하려면)</button>
        <div v-else class="flex items-center justify-between text-[#aac4df]">
          <span class="truncate">✓ {{ asuraRole }}</span>
          <button type="button" class="hover:text-white cursor-pointer underline" @click="logout">로그아웃</button>
        </div>
      </div>

      <!-- 로컬 → DB 1회 이전 (로그인 + 로컬 문서 있을 때만) -->
      <button v-if="asuraRole && localCount > 0" type="button"
              class="w-full rounded bg-gold/90 text-navy py-1 text-[10px] font-bold hover:bg-gold cursor-pointer disabled:opacity-50"
              :disabled="migrating" @click="migrate">
        {{ migrating ? '이전 중…' : `⬆ 로컬→DB 이전 (${localCount}건)` }}
      </button>

      <DocManagerBar :controller="activeDoc" orientation="vertical" @carry="onCarry" />
    </aside>

    <EmailLogin v-if="showLogin" @success="showLogin = false" @skip="showLogin = false" />
  </div>
</template>
