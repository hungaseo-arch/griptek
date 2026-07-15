// ─── 제품 추천/가격 불러오기 (QT/PO/PI/CI 공용) ──────────────────────────────
// 로그인(JWT) → 제품 목록 로드 → Item Description 추천 + 역할별 Unit Price 산정.
// MoneyItemsTable 에 products/price-policy/on-pick-product/on-unit-change 로 연결한다.
import { ref, computed, onMounted } from 'vue';
import { asuraRole, asuraReady, isAsuraConfigured, initAsuraSession, signOutAsura } from '@/lib/asuraDb';
import { ROLE_POLICY } from '@/lib/roles';
import { fetchProducts, type Product } from '@/lib/productsApi';
import type { MoneyItem } from '@/utils/calc';

export function useProductPicker(items: MoneyItem[]) {
  const products = ref<Product[]>([]);
  const productsLoading = ref(false);
  const productsError = ref<string | null>(null);
  const showLogin = ref(false);

  async function loadProducts(): Promise<void> {
    if (!asuraRole.value) return;
    productsLoading.value = true;
    productsError.value = null;
    try {
      products.value = await fetchProducts(asuraRole.value);
    } catch (e) {
      productsError.value = e instanceof Error ? e.message : String(e);
    } finally {
      productsLoading.value = false;
    }
  }

  onMounted(async () => {
    if (!isAsuraConfigured) return;
    if (!asuraReady.value) await initAsuraSession();
    if (asuraRole.value) void loadProducts(); // 세션이 이미 있으면 자동 로드
  });

  function onLoginSuccess(): void {
    showLogin.value = false;
    void loadProducts();
  }

  async function logout(): Promise<void> {
    await signOutAsura();
    products.value = [];
    productsError.value = null;
  }

  // 현재 역할의 가격 정책(Unit Price 배수·원가/마진 노출). 미로그인 시 null.
  const policy = computed(() => (asuraRole.value ? ROLE_POLICY[asuraRole.value] : null));

  const floor1000 = (v: number) => Math.floor(v / 1000) * 1000;

  // 원가(wh_price) — 원가 수신 역할에서만 존재. 없으면 0.
  function whFor(p: Product, unit: string): number {
    return (unit === 'set' ? p.wh_price_set : p.wh_price) ?? 0;
  }

  // 역할별 Unit Price(최초 제시가격) = 천단위 절사.
  function unitPriceFor(p: Product, unit: string): number {
    const base = p.unit_price != null
      ? (unit === 'set' ? p.unit_price_set : p.unit_price) ?? p.unit_price
      : whFor(p, unit) / (policy.value?.divisor ?? 0.85);
    return floor1000(base);
  }

  function applyProduct(index: number, p: Product): void {
    const row = items[index];
    if (!row) return;
    row.itemType = p.item ?? '';
    row.brand = p.brand ?? '';
    row.desc = p.description ?? '';
    row.unit = p.unit;
    row.productSku = p.sku ?? '';
    row.whPrice = String(whFor(p, p.unit));
    row.unitPrice = String(unitPriceFor(p, p.unit));
  }

  // Unit(pcs/set) 변경 시: 연결된 제품의 해당 단위로 재가격 산정.
  function repriceUnit(index: number): void {
    const row = items[index];
    if (!row?.productSku) return;
    const p = products.value.find((x) => x.sku === row.productSku);
    if (!p) return;
    row.whPrice = String(whFor(p, row.unit));
    row.unitPrice = String(unitPriceFor(p, row.unit));
  }

  return {
    products, productsLoading, productsError, showLogin,
    asuraRole, isAsuraConfigured, policy,
    onLoginSuccess, logout, applyProduct, repriceUnit,
  };
}
