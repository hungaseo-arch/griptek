<script setup lang="ts">
// ─── 이메일 로그인 / 회원가입 ────────────────────────────────────────────────
// 신규 가입 계정은 end_user(최저 권한) — 가입 즉시 자동 로그인. 권한 승격은 관리자.
import { ref, computed } from 'vue';
import { signInWithEmail, signUpWithEmail } from '@/lib/asuraDb';

const emit = defineEmits<{ success: []; skip: [] }>();

type Mode = 'login' | 'signup';
const mode = ref<Mode>('login');
const email = ref('');
const password = ref('');
const busy = ref(false);
const error = ref<string | null>(null);
const notice = ref<string | null>(null);

const isSignup = computed(() => mode.value === 'signup');
const canSubmit = computed(() =>
  !busy.value && !!email.value.trim() && (isSignup.value ? password.value.length >= 6 : !!password.value),
);

function switchMode(): void {
  mode.value = isSignup.value ? 'login' : 'signup';
  error.value = null;
  notice.value = null;
}

async function submit(): Promise<void> {
  if (!canSubmit.value) return;
  busy.value = true;
  error.value = null;
  notice.value = null;
  try {
    if (isSignup.value) {
      // 승인 대기 — 자동 로그인 안 함. 안내 후 로그인 모드로.
      const msg = await signUpWithEmail(email.value, password.value);
      notice.value = msg;
      mode.value = 'login';
      password.value = '';
    } else {
      await signInWithEmail(email.value, password.value);
      emit('success');
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
    password.value = '';
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <!-- 배경 클릭 시 닫기 -->
    <div class="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60"
         @click.self="emit('skip')">
      <form class="relative bg-white rounded-2xl w-80 max-w-[92vw] shadow-2xl p-7" @submit.prevent="submit">
        <!-- 닫기(X) -->
        <button type="button" aria-label="닫기"
                class="absolute top-3 right-3 w-7 h-7 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer leading-none"
                @click="emit('skip')">✕</button>

        <div class="text-center mb-5">
          <div class="text-navy font-extrabold text-[18px]">제품 가격 불러오기</div>
          <div class="text-gray-500 text-[12px] mt-1">{{ isSignup ? '회원가입' : '이메일 로그인' }}</div>
        </div>

        <label class="block text-[11px] font-semibold text-gray-500 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          autocomplete="username"
          :disabled="busy"
          class="w-full mb-3 rounded-lg border border-gray-300 px-3 py-2 text-[13px] outline-none focus:border-midblue disabled:opacity-50"
          placeholder="you@example.com"
        />

        <label class="block text-[11px] font-semibold text-gray-500 mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          :autocomplete="isSignup ? 'new-password' : 'current-password'"
          :disabled="busy"
          class="w-full mb-1 rounded-lg border border-gray-300 px-3 py-2 text-[13px] outline-none focus:border-midblue disabled:opacity-50"
          placeholder="••••••••"
        />
        <p class="text-gray-400 text-[10px] mb-3">최소 6자 이상</p>

        <p v-if="error" class="text-red-600 text-[12px] text-center mb-3">⚠ {{ error }}</p>
        <p v-if="notice" class="text-green-600 text-[12px] text-center mb-3">✓ {{ notice }}</p>

        <button
          type="submit"
          :disabled="!canSubmit"
          class="w-full h-11 rounded-lg bg-midblue text-white font-bold text-[14px] cursor-pointer transition-colors hover:bg-navy disabled:opacity-50"
        >{{ busy ? '처리 중…' : (isSignup ? '회원가입' : '로그인') }}</button>

        <div class="text-center mt-4 text-[12px] text-gray-500">
          {{ isSignup ? '이미 계정이 있으신가요?' : '계정이 없으신가요?' }}
          <button type="button" class="text-midblue font-semibold hover:underline cursor-pointer" @click="switchMode">
            {{ isSignup ? '로그인' : '회원가입' }}
          </button>
        </div>

        <button
          type="button"
          class="w-full mt-3 text-gray-400 hover:text-gray-600 text-[12px] cursor-pointer"
          @click="emit('skip')"
        >나중에 (제품 가격 불러오기 비활성)</button>

        <p class="text-gray-400 text-[10px] text-center mt-4 leading-relaxed">
          신규 가입은 <b>관리자 승인 후</b> 로그인할 수 있습니다(기본 End-user). 권한 변경은 관리자에게 문의하세요.
        </p>
      </form>
    </div>
  </Teleport>
</template>
