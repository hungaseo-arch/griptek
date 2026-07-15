// ─── 구매고객 조회/저장 (Rumahweb Express API) ──────────────────────────────
// 목록 조회는 공개(GET), upsert 는 로그인(문서 저장 시 자동 누적).
import { authToken } from '@/lib/asuraDb';

const API = import.meta.env.VITE_API_BASE;

export interface Customer {
  id: string;
  name: string;
  address: string | null;
  city_state: string | null;
  phone: string | null;
  email: string | null;
  contact: string | null;
  npwp: string | null;
}

export interface CustomerInput {
  name: string;
  address?: string;
  city_state?: string;
  phone?: string;
  email?: string;
  contact?: string;
  npwp?: string;
}

/** 활성 고객 목록. 미설정/오류 시 빈 배열. */
export async function fetchCustomers(): Promise<Customer[]> {
  if (!API) return [];
  try {
    const res = await fetch(`${API}/api/customers`);
    if (!res.ok) return [];
    return (await res.json()) as Customer[];
  } catch {
    return [];
  }
}

/** 고객 upsert(이름 기준). 문서 저장 시 호출 — best-effort(실패해도 저장 흐름 방해 안 함). */
export async function upsertCustomer(c: CustomerInput): Promise<void> {
  const token = authToken();
  if (!API || !token || !c.name || !c.name.trim()) return;
  try {
    await fetch(`${API}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(c),
    });
  } catch {
    /* 무시 */
  }
}
