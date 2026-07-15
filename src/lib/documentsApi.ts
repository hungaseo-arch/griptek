// ─── 문서 저장 타입 정의 ─────────────────────────────────────────────────────
// 저장/불러오기는 DB(Express API `/api/documents`)에서 처리한다(apiDocs.ts).
// (localStorage 백엔드 localDocs.ts 는 오프라인/마이그레이션용으로 남겨둠.)

export type DocType = 'PO' | 'PI' | 'CI' | 'PL' | 'QT';

export interface SavedDocument {
  id: string;
  doc_type: DocType;
  doc_no: string;
  payload: Record<string, unknown>;
  created_at: string;
}

/** 목록 표시용 경량 메타 (payload 제외). */
export interface DocumentMeta {
  id: string;
  doc_no: string;
  created_at: string;
}

/**
 * 문서 저장소 백엔드 인터페이스. 현재 구현은 로컬(localStorage) 하나뿐이다.
 */
export interface DocBackend {
  list: (docType: DocType) => Promise<DocumentMeta[]>;
  get: (id: string) => Promise<SavedDocument>;
  create: (docType: DocType, docNo: string, payload: Record<string, unknown>) => Promise<SavedDocument>;
  update: (id: string, docNo: string, payload: Record<string, unknown>) => Promise<SavedDocument>;
  remove: (id: string) => Promise<void>;
}
