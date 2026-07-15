// ─── 벤더(공급사) 조회/저장 (Rumahweb Express API) ──────────────────────────
// PO 의 Vendor/Supplier 자동입력용. 목록 조회는 공개(GET), upsert 는 로그인(PO 저장 시 자동 누적).
import { authToken } from '@/lib/asuraDb';

const API = import.meta.env.VITE_API_BASE;

export interface Vendor {
  id: string;
  name: string;
  address: string | null;
  city_state: string | null;
  phone: string | null;
  email: string | null;
}

export interface VendorInput {
  name: string;
  address?: string;
  city_state?: string;
  phone?: string;
  email?: string;
}

/** 활성 벤더 목록. 미설정/오류 시 빈 배열. */
export async function fetchVendors(): Promise<Vendor[]> {
  if (!API) return [];
  try {
    const res = await fetch(`${API}/api/vendors`);
    if (!res.ok) return [];
    return (await res.json()) as Vendor[];
  } catch {
    return [];
  }
}

/** 벤더 upsert(이름 기준). PO 저장 시 호출 — best-effort(실패해도 저장 흐름 방해 안 함). */
export async function upsertVendor(v: VendorInput): Promise<void> {
  const token = authToken();
  if (!API || !token || !v.name || !v.name.trim()) return;
  try {
    await fetch(`${API}/api/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(v),
    });
  } catch {
    /* 무시 */
  }
}
