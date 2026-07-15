// ─── 문서 저장소 백엔드 (Rumahweb Express API · MySQL) ───────────────────────
// 문서(QT/PO/PI/CI/PL)를 `/api/documents` 에 저장/조회. 전부 로그인(JWT) 필요.
import { authToken } from '@/lib/asuraDb';
import type { DocType, DocumentMeta, SavedDocument, DocBackend } from '@/lib/documentsApi';

const API = import.meta.env.VITE_API_BASE;

async function call(path: string, opts: RequestInit = {}): Promise<Response> {
  if (!API) throw new Error('API가 설정되지 않았습니다.');
  const token = authToken();
  if (!token) throw new Error('로그인이 필요합니다.');
  const res = await fetch(`${API}/api/documents${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers ?? {}) },
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({} as Record<string, unknown>));
    const msg = (e as { error?: string }).error
      || (res.status === 401 ? '로그인이 필요합니다.' : `요청 실패 (${res.status})`);
    throw new Error(msg);
  }
  return res;
}

export const apiBackend: DocBackend = {
  async list(docType: DocType): Promise<DocumentMeta[]> {
    const res = await call(`?type=${encodeURIComponent(docType)}`);
    return (await res.json()) as DocumentMeta[];
  },
  async get(id: string): Promise<SavedDocument> {
    const res = await call(`/${id}`);
    const doc = (await res.json()) as SavedDocument;
    // MariaDB(JSON=LONGTEXT)는 payload 를 문자열로 반환 → 객체로 파싱.
    if (typeof doc.payload === 'string') {
      try { doc.payload = JSON.parse(doc.payload); } catch { doc.payload = {}; }
    }
    return doc;
  },
  async create(docType, docNo, payload): Promise<SavedDocument> {
    const res = await call('', { method: 'POST', body: JSON.stringify({ doc_type: docType, doc_no: docNo, payload }) });
    return (await res.json()) as SavedDocument;
  },
  async update(id, docNo, payload): Promise<SavedDocument> {
    const res = await call(`/${id}`, { method: 'PUT', body: JSON.stringify({ doc_no: docNo, payload }) });
    return (await res.json()) as SavedDocument;
  },
  async remove(id: string): Promise<void> {
    await call(`/${id}`, { method: 'DELETE' });
  },
};
