import { ref, inject, onMounted, onUnmounted, type InjectionKey, type Ref } from 'vue';
import {
  listDocuments, createDocument, updateDocument, deleteDocument,
  type DocType, type DocumentMeta, type SavedDocument,
} from '@/lib/documentsApi';

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

  async function save(): Promise<void> {
    await run(async () => {
      const doc = await createDocument(docType, getDocNo(), getPayload());
      currentId.value = doc.id;
      loadedNo.value = doc.doc_no;
      status.value = `Saved ${new Date().toLocaleString('en-GB')}`;
    });
  }

  async function update(): Promise<void> {
    if (!currentId.value) return;
    await run(async () => {
      const doc = await updateDocument(currentId.value as string, getDocNo(), getPayload());
      loadedNo.value = doc.doc_no;
      status.value = `Updated ${new Date().toLocaleString('en-GB')}`;
    });
  }

  async function remove(): Promise<void> {
    if (!currentId.value) return;
    await run(async () => {
      await deleteDocument(currentId.value as string);
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

  const controller: DocController = {
    docType, currentId, loadedNo, busy, error, status,
    save, update, remove,
    list: () => listDocuments(docType),
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
