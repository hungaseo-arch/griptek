// 등록 고객 목록 로드 (문서 자동입력 드롭다운용).
import { ref, onMounted } from 'vue';
import { fetchCustomers, type Customer } from '@/lib/customersApi';

export function useCustomers() {
  const customers = ref<Customer[]>([]);
  onMounted(async () => { customers.value = await fetchCustomers(); });
  return { customers };
}
