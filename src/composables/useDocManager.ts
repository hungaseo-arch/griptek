import { ref, inject, onMounted, onUnmounted, type InjectionKey, type Ref } from 'vue';
import type { DocType, DocumentMeta, SavedDocument, DocBackend } from '@/lib/documentsApi';
import { apiBackend } from '@/lib/apiDocs';
import { upsertCustomer, type CustomerInput } from '@/lib/customersApi';
import { upsertVendor, type VendorInput } from '@/lib/vendorsApi';

export type { DocBackend } from '@/lib/documentsApi';

/** 상단 바(DocManagerBar)가 현재 활성 문서를 제어하기 위한 컨트롤러. */
export interface DocController {
  docType: DocType;
  currentId: Ref<string | null>;
  loadedNo: Ref<string | null>;
  busy: Ref<boolean>;
  error: Ref<string | null>;
  status: Ref<string | null>;
  save: () => Promise<void>;
  update: () => Promise<void>;
  remove: () => Promise<void>;
  list: () => Promise<DocumentMeta[]>;
  load: (id: string) => Promise<void>;
  removeById: (id: string) => Promise<void>;
  applyLoaded: (doc: SavedDocument) => void;
  snapshot: () => Record<string, unknown>;
}

/** App.vue 가 제공하고 각 뷰가 자신의 컨트롤러를 등록하는 슬롯. */
export const ACTIVE_DOC: InjectionKey<Ref<DocController | null>> = Symbol('activeDoc');

/** 다음 단계 문서로 내용을 넘기는 App 레벨 핸드오프 버퍼. */
export interface CarryBuffer {
  toType: DocType;
  data: Record<string, unknown>;
}
export const CARRY_BUFFER: InjectionKey<Ref<CarryBuffer | null>> = Symbol('carryBuffer');

function message(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/**
 * 문서 CRUD 상태와 동작을 캡슐화하고, 마운트 시 활성 문서 슬롯에 등록한다.
 *
 * @param docType     문서 유형
 * @param getDocNo    현재 문서 번호를 읽는 함수
 * @param getPayload  저장할 폼 내용을 직렬화하는 함수
 * @param applyPayload 불러온 payload 를 폼 상태에 반영하는 함수
 */
export function useDocManager(
  docType: DocType,
  getDocNo: () => string,
  getPayload: () => Record<string, unknown>,
  applyPayload: (payload: Record<string, unknown>) => void,
  backend: DocBackend = apiBackend,
  getCustomer?: () => CustomerInput | null,
  getVendor?: () => VendorInput | null,
): DocController {
  const currentId = ref<string | null>(null);
  const loadedNo = ref<string | null>(null);
  const busy = ref(false);
  const error = ref<string | null>(null);
  const status = ref<string | null>(null);

  async function run(fn: () => Promise<void>): Promise<void> {
    busy.value = true;
    error.value = null;
    try {
      await fn();
    } catch (e) {
      error.value = message(e);
    } finally {
      busy.value = false;
    }
  }

  // 저장/수정 시 구매고객·벤더를 DB에 자동 누적(이름 기준 upsert). best-effort.
  async function upsertParties(): Promise<void> {
    if (getCustomer) { const c = getCustomer(); if (c && c.name && c.name.trim()) await upsertCustomer(c); }
    if (getVendor) { const v = getVendor(); if (v && v.name && v.name.trim()) await upsertVendor(v); }
  }

  async function save(): Promise<void> {
    await run(async () => {
      const doc = await backend.create(docType, getDocNo(), getPayload());
      currentId.value = doc.id;
      loadedNo.value = doc.doc_no;
      status.value = `Saved ${new Date().toLocaleString('en-GB')}`;
      await upsertParties();
    });
  }

  async function update(): Promise<void> {
    if (!currentId.value) return;
    await run(async () => {
      const doc = await backend.update(currentId.value as string, getDocNo(), getPayload());
      loadedNo.value = doc.doc_no;
      status.value = `Updated ${new Date().toLocaleString('en-GB')}`;
      await upsertParties();
    });
  }

  async function remove(): Promise<void> {
    if (!currentId.value) return;
    await run(async () => {
      await backend.remove(currentId.value as string);
      currentId.value = null;
      loadedNo.value = null;
      status.value = 'Deleted';
    });
  }

  function applyLoaded(doc: SavedDocument): void {
    applyPayload(doc.payload);
    currentId.value = doc.id;
    loadedNo.value = doc.doc_no;
    error.value = null;
    status.value = `Loaded ${doc.doc_no}`;
  }

  /** 목록에서 선택한 문서를 불러와 폼에 반영. */
  async function load(id: string): Promise<void> {
    const doc = await backend.get(id);
    applyLoaded(doc);
  }

  /** 목록의 임의 문서를 삭제(현재 편집 중인 문서면 상태 초기화). */
  async function removeById(id: string): Promise<void> {
    await backend.remove(id);
    if (currentId.value === id) {
      currentId.value = null;
      loadedNo.value = null;
    }
  }

  const controller: DocController = {
    docType, currentId, loadedNo, busy, error, status,
    save, update, remove,
    list: () => backend.list(docType),
    load,
    removeById,
    applyLoaded,
    snapshot: () => JSON.parse(JSON.stringify(getPayload())) as Record<string, unknown>,
  };

  const slot = inject(ACTIVE_DOC, null);
  const carry = inject(CARRY_BUFFER, null);
  onMounted(() => {
    if (slot) slot.value = controller;
    // 이전 문서에서 넘어온 내용이 있으면 적용. currentId/loadedNo 는 건드리지 않아 저장 시 새 문서가 된다.
    if (carry?.value && carry.value.toType === docType) {
      applyPayload(carry.value.data);
      carry.value = null;
      status.value = 'Carried from previous document';
    }
  });
  onUnmounted(() => { if (slot && slot.value === controller) slot.value = null; });

  return controller;
}
