// ─── 인증 (Rumahweb Express API) ─────────────────────────────────────────────
// 이메일 로그인 → JWT(localStorage) → 역할. 역할 정책(가격·노출)은 roles.ts.
import { ref } from 'vue';
import { coerceRole, type Role } from '@/lib/roles';

export type { Role } from '@/lib/roles';

const API = import.meta.env.VITE_API_BASE;
export const isAsuraConfigured = Boolean(API);

const TOKEN_KEY = 'griptek-api-token';

/** 현재 로그인 여부 / 역할 (반응형). UI 게이팅에 사용. */
export const asuraRole = ref<Role | null>(null);
export const asuraReady = ref(false); // 최초 세션 확인 완료 여부

/** 저장된 JWT — productsApi 등에서 Authorization 헤더용. */
export function authToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** JWT payload(base64url) 디코드해 역할 추출. 손상/만료 시 null. */
function decodeRole(token: string): Role | null {
  try {
    const part = token.split('.')[1];
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/')
      .padEnd(part.length + ((4 - (part.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(b64)) as { role?: unknown; exp?: number };
    if (payload.exp && Date.now() / 1000 >= payload.exp) return null; // 만료
    return coerceRole(payload.role);
  } catch {
    return null;
  }
}

/** 앱 시작 시 저장된 토큰으로 세션 복원. */
export async function initAsuraSession(): Promise<void> {
  if (!isAsuraConfigured) { asuraReady.value = true; return; }
  const t = authToken();
  const role = t ? decodeRole(t) : null;
  if (t && !role) localStorage.removeItem(TOKEN_KEY); // 만료/손상 토큰 정리
  asuraRole.value = role;
  asuraReady.value = true;
}

/** 이메일 + 비밀번호 로그인 → 토큰 저장, 역할 반환. 실패 시 에러 throw. */
export async function signInWithEmail(email: string, password: string): Promise<Role> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const data = await res.json().catch(() => ({} as Record<string, unknown>));
  if (!res.ok) throw new Error((data as { error?: string }).error || `로그인 실패 (${res.status})`);
  localStorage.setItem(TOKEN_KEY, (data as { token: string }).token);
  const role = coerceRole((data as { role?: unknown }).role);
  asuraRole.value = role;
  return role;
}

/** 이메일 회원가입 → 승인 대기 계정 생성(자동 로그인 안 함). 안내 메시지 반환. */
export async function signUpWithEmail(email: string, password: string): Promise<string> {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const data = await res.json().catch(() => ({} as Record<string, unknown>));
  if (!res.ok) throw new Error((data as { error?: string }).error || `가입 실패 (${res.status})`);
  return (data as { message?: string }).message || '가입 신청이 접수되었습니다. 관리자 승인 후 로그인하세요.';
}

export async function signOutAsura(): Promise<void> {
  localStorage.removeItem(TOKEN_KEY);
  asuraRole.value = null;
}
