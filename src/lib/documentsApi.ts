import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

function ensureConfigured(): void {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase가 설정되지 않았습니다. .env의 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY를 확인하세요.');
  }
}

/** 특정 문서 유형의 저장 목록을 최신순으로 조회. */
export async function listDocuments(docType: DocType): Promise<DocumentMeta[]> {
  ensureConfigured();
  const { data, error } = await supabase
    .from('documents')
    .select('id, doc_no, created_at')
    .eq('doc_type', docType)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as DocumentMeta[];
}

/** 단일 문서 전체(payload 포함)를 조회. */
export async function getDocument(id: string): Promise<SavedDocument> {
  ensureConfigured();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data as SavedDocument;
}

/** 새 문서를 생성(INSERT)하고 저장된 레코드를 반환. */
export async function createDocument(
  docType: DocType,
  docNo: string,
  payload: Record<string, unknown>,
): Promise<SavedDocument> {
  ensureConfigured();
  const { data, error } = await supabase
    .from('documents')
    .insert({ doc_type: docType, doc_no: docNo, payload })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as SavedDocument;
}

/** 기존 문서를 수정(UPDATE)하고 갱신된 레코드를 반환. */
export async function updateDocument(
  id: string,
  docNo: string,
  payload: Record<string, unknown>,
): Promise<SavedDocument> {
  ensureConfigured();
  const { data, error } = await supabase
    .from('documents')
    .update({ doc_no: docNo, payload })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as SavedDocument;
}

/** 문서를 삭제(DELETE). */
export async function deleteDocument(id: string): Promise<void> {
  ensureConfigured();
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
