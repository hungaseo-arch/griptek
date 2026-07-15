// ─── 사용자 권한(역할) 정책 ──────────────────────────────────────────────────
// 역할은 로그인 JWT(admin_users.role)에서 온다. 각 역할은 가격 표시 규칙
// (Unit Price 배수, 원가/마진 노출)을 가진다.
//
// ⚠ 원가(wh_price) 실제 차단은 서버(API)가 한다: super_admin·staff 만 원가를 응답에
// 포함하고, distributor·end_user 에겐 판매가만 보낸다. 아래 showCost/showMargin 은
// "화면 표시" 보조 플래그다.

export type Role = 'super_admin' | 'staff' | 'distributor' | 'end_user';

export interface RolePolicy {
  label: string;
  /** Unit Price = wh_price / divisor */
  divisor: number;
  /** 원가(wh_price)를 화면에 노출하는가 (제품 추천 목록 가격 라벨) */
  showCost: boolean;
  /** 마진율 컬럼을 표시하는가 */
  showMargin: boolean;
}

export const ROLE_POLICY: Record<Role, RolePolicy> = {
  // Super admin: 원가·마진 노출. Unit Price = 마진 30% (= wh × 1.30 = wh / (1/1.3))
  super_admin: { label: 'Super Admin', divisor: 1 / 1.3, showCost: true,  showMargin: true  },
  // Staff: 원가·마진 노출. Unit Price = 마진 25% (= wh × 1.25 = wh / (1/1.25))
  staff:       { label: 'Staff',       divisor: 1 / 1.25, showCost: true,  showMargin: true  },
  // Distributor: 원가·마진 미표시(서버 미수신), Unit Price = wh_price/0.7
  distributor: { label: 'Distributor', divisor: 0.70, showCost: false, showMargin: false },
  // End-user: 원가·마진 미표시(서버 미수신), Unit Price = wh_price/0.7
  end_user:    { label: 'End-user',    divisor: 0.70, showCost: false, showMargin: false },
};

const ROLES = Object.keys(ROLE_POLICY) as Role[];

/** 임의 값을 유효한 Role 로 보정. 알 수 없으면 가장 제한적인 end_user. */
export function coerceRole(raw: unknown): Role {
  return ROLES.includes(raw as Role) ? (raw as Role) : 'end_user';
}
