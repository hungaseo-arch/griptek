// ─── 로컬 문서 저장소 (localStorage) ────────────────────────────────────────
// 모든 문서(QT/PO/PI/CI/PL)의 Load/Save 를 브라우저 localStorage 에서 처리.
// 서버 연결 없음.
import type { DocType, DocumentMeta, SavedDocument, DocBackend } from '@/lib/documentsApi';

const KEY = 'griptek:documents';

function readAll(): SavedDocument[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedDocument[]) : [];
  } catch {
    return [];
  }
}

function writeAll(rows: SavedDocument[]): void {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

function uid(): string {
  return (crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.round(Math.random() * 1e9)}`);
}

export const localBackend: DocBackend = {
  async list(docType: DocType): Promise<DocumentMeta[]> {
    return readAll()
      .filter((d) => d.doc_type === docType)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(({ id, doc_no, created_at }) => ({ id, doc_no, created_at }));
  },

  async get(id: string): Promise<SavedDocument> {
    const doc = readAll().find((d) => d.id === id);
    if (!doc) throw new Error('문서를 찾을 수 없습니다.');
    return doc;
  },

  async create(docType: DocType, docNo: string, payload: Record<string, unknown>): Promise<SavedDocument> {
    const doc: SavedDocument = {
      id: uid(),
      doc_type: docType,
      doc_no: docNo,
      payload,
      created_at: new Date().toISOString(),
    };
    writeAll([doc, ...readAll()]);
    return doc;
  },

  async update(id: string, docNo: string, payload: Record<string, unknown>): Promise<SavedDocument> {
    const rows = readAll();
    const idx = rows.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('수정할 문서를 찾을 수 없습니다.');
    rows[idx] = { ...rows[idx], doc_no: docNo, payload };
    writeAll(rows);
    return rows[idx];
  },

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((d) => d.id !== id));
  },
};
