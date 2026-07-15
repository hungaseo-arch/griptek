// ─── 제품 가격 조회 (Rumahweb Express API) ──────────────────────────────────
// 역할별 가격은 서버(API)가 결정한다:
//   - super_admin·staff → wh_price(원가) 포함
//   - distributor·end_user → unit_price(판매가)만, 원가 미전송
// 따라서 프론트는 토큰만 보내고 반환값을 그대로 사용한다.
import { authToken } from '@/lib/asuraDb';
import type { Role } from '@/lib/roles';

export interface Product {
  id: string;
  item: string | null;
  brand: string | null;
  description: string | null;
  sku: string | null;
  unit: 'pcs' | 'set';
  /** 원가 — 원가 수신 역할에서만 채워짐 */
  wh_price?: number;
  wh_price_set?: number;
  /** 서버 계산 판매가 — 원가 미수신 역할에서 채워짐 */
  unit_price?: number;
  unit_price_set?: number;
}

const API = import.meta.env.VITE_API_BASE;

/**
 * 활성 제품 목록(역할별 가격). 미인증/미설정 시 빈 배열.
 * role 인자는 호환용(서버가 JWT 로 역할을 판단하므로 사용하지 않음).
 */
export async function fetchProducts(_role?: Role): Promise<Product[]> {
  const token = authToken();
  if (!API || !token) return [];
  const res = await fetch(`${API}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({} as Record<string, unknown>));
    throw new Error((e as { error?: string }).error || `제품 조회 실패 (${res.status})`);
  }
  return (await res.json()) as Product[];
}
