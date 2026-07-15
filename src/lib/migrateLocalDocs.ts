// ─── 로컬(localStorage) 문서 → DB(API) 일괄 이전 (1회용) ─────────────────────
// localStorage 는 브라우저 안에만 있으므로, 로그인 상태에서 앱이 직접 읽어 DB로 보낸다.
import { localBackend } from '@/lib/localDocs';
import { apiBackend } from '@/lib/apiDocs';
import type { DocType } from '@/lib/documentsApi';

const TYPES: DocType[] = ['QT', 'PO', 'PI', 'CI', 'PL'];
const LOCAL_KEY = 'griptek:documents';
const BACKUP_KEY = 'griptek:documents.bak';

/** 로컬에 저장된 문서 총 개수. */
export async function countLocalDocs(): Promise<number> {
  let n = 0;
  for (const t of TYPES) n += (await localBackend.list(t)).length;
  return n;
}

export interface MigrateResult {
  migrated: number;
  failed: number;
  errors: string[];
}

/**
 * 로컬 문서를 전부 DB로 생성. 전부 성공하면 로컬 원본을 백업(.bak) 후 비운다(재실행 중복 방지).
 * 일부 실패 시 로컬은 그대로 두어 재시도 가능.
 */
export async function migrateLocalToDb(): Promise<MigrateResult> {
  let migrated = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const t of TYPES) {
    const metas = await localBackend.list(t);
    for (const m of metas) {
      try {
        const doc = await localBackend.get(m.id);
        await apiBackend.create(t, doc.doc_no, doc.payload);
        migrated += 1;
      } catch (e) {
        failed += 1;
        errors.push(`${t} ${m.doc_no}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  if (failed === 0 && migrated > 0) {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) localStorage.setItem(BACKUP_KEY, raw); // 안전 백업
    localStorage.removeItem(LOCAL_KEY);
  }

  return { migrated, failed, errors };
}
