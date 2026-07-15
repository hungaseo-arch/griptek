<script setup lang="ts">
import { ref, computed } from 'vue';
import type { DocumentMeta } from '@/lib/documentsApi';
import type { DocController } from '@/composables/useDocManager';
import { NEXT_TYPE } from '@/lib/carryForward';

const props = withDefaults(
  defineProps<{ controller: DocController | null; orientation?: 'horizontal' | 'vertical' }>(),
  { orientation: 'horizontal' },
);
const emit = defineEmits<{ carry: [] }>();

const isVertical = computed(() => props.orientation === 'vertical');

const nextType = computed(() => (props.controller ? NEXT_TYPE[props.controller.docType] : null));

// controller 의 내부 ref 들은 prop 의 중첩 속성이라 템플릿에서 자동 unwrap 되지 않는다.
// computed 로 풀어내어 표시/disabled 바인딩이 올바르게 반응하도록 한다.
const hasController = computed(() => !!props.controller);
const busy = computed(() => props.controller?.busy.value ?? false);
const errorText = computed(() => props.controller?.error.value ?? null);
const statusText = computed(() => props.controller?.status.value ?? null);
const loadedNo = computed(() => props.controller?.loadedNo.value ?? null);

const modalOpen = ref(false);
const listLoading = ref(false);
const listError = ref<string | null>(null);
const rows = ref<DocumentMeta[]>([]);

function fmt(ts: string): string {
  return new Date(ts).toLocaleString('en-GB');
}

async function refreshList(): Promise<void> {
  if (!props.controller) return;
  listLoading.value = true;
  listError.value = null;
  try {
    rows.value = await props.controller.list();
  } catch (e) {
    listError.value = e instanceof Error ? e.message : String(e);
  } finally {
    listLoading.value = false;
  }
}

async function openLoad(): Promise<void> {
  if (!props.controller) return;
  modalOpen.value = true;
  await refreshList();
}

async function pick(id: string): Promise<void> {
  if (!props.controller) return;
  try {
    await props.controller.load(id);
    modalOpen.value = false;
  } catch (e) {
    listError.value = e instanceof Error ? e.message : String(e);
  }
}

function exportPdf(): void {
  window.print();
}

async function removeFromList(id: string): Promise<void> {
  if (!props.controller) return;
  if (!window.confirm('Delete this document?')) return;
  try {
    await props.controller.removeById(id);
    await refreshList();
  } catch (e) {
    listError.value = e instanceof Error ? e.message : String(e);
  }
}

</script>

<template>
  <div :class="isVertical ? 'flex flex-col gap-2 items-stretch' : 'flex items-center gap-2'">
    <!-- status -->
    <span v-if="errorText"
          class="text-[11px] text-red-300 font-medium truncate"
          :class="isVertical ? '' : 'max-w-60'">
      ⚠ {{ errorText }}
    </span>
    <span v-else-if="statusText" class="text-[11px] text-[#aac4df] font-medium truncate">
      {{ statusText }}
    </span>
    <span v-else-if="loadedNo" class="text-[11px] text-[#aac4df] font-medium truncate">
      ✎ {{ loadedNo }}
    </span>

    <button type="button" class="mgr-btn bg-white/10 text-white" :class="isVertical ? 'w-full' : ''"
            :disabled="!hasController || busy" @click="openLoad">
      📂 Load
    </button>
    <button type="button" class="mgr-btn bg-gold text-navy" :class="isVertical ? 'w-full' : ''"
            :disabled="!hasController || busy" @click="controller?.save()">
      💾 Save
    </button>
    <button type="button" class="mgr-btn bg-white text-navy" :class="isVertical ? 'w-full' : ''"
            @click="exportPdf">
      📄 PDF
    </button>
    <button v-if="nextType" type="button" class="mgr-btn bg-midblue text-white" :class="isVertical ? 'w-full' : ''"
            :disabled="!hasController || busy" @click="emit('carry')">
      ▶ Carry to {{ nextType }}
    </button>
  </div>

  <!-- ── Load modal ── -->
  <Teleport to="body">
    <div v-if="modalOpen"
         class="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/50"
         @click.self="modalOpen = false">
      <div class="bg-white rounded-xl w-130 max-w-[92vw] max-h-[80vh] flex flex-col shadow-2xl">
        <div class="flex items-center justify-between px-5 py-3 border-b border-[#eee]">
          <h2 class="text-navy font-bold text-[15px]">
            Load — {{ controller?.docType }} saved documents
          </h2>
          <button type="button" class="text-[#888] hover:text-navy text-xl leading-none"
                  @click="modalOpen = false">×</button>
        </div>

        <div class="overflow-y-auto px-2 py-2 grow">
          <p v-if="listLoading" class="text-center text-[#888] text-[13px] py-8">Loading…</p>
          <p v-else-if="listError" class="text-center text-red-600 text-[13px] py-8">⚠ {{ listError }}</p>
          <p v-else-if="rows.length === 0" class="text-center text-[#888] text-[13px] py-8">
            No saved documents.
          </p>
          <ul v-else class="flex flex-col">
            <li v-for="row in rows" :key="row.id"
                class="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-[#f3f6fb]">
              <button type="button" class="flex-1 text-left cursor-pointer" @click="pick(row.id)">
                <div class="text-navy font-semibold text-[13px]">{{ row.doc_no }}</div>
                <div class="text-[#888] text-[11px]">{{ fmt(row.created_at) }}</div>
              </button>
              <button type="button"
                      class="text-red-500 hover:text-red-700 text-[12px] font-medium px-2 py-1"
                      @click="removeFromList(row.id)">
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mgr-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border-radius: 7px;
  padding: 0.4rem 0.7rem;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
  white-space: nowrap;
}
.mgr-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
