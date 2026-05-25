<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: string;
  align?: 'left' | 'center' | 'right';
  placeholder?: string;
  numeric?: boolean;
  spinner?: boolean;
  step?: string;
  min?: string;
  max?: string;
  formatNumber?: boolean;
  autoSize?: boolean;
}>(), {
  align: 'left',
  placeholder: '',
  numeric: false,
  spinner: false,
  step: '1',
  min: '0',
  max: undefined,
  formatNumber: false,
  autoSize: false,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const alignClass: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const displayVal = ref(props.modelValue);

const sizeStyle = computed(() =>
  props.autoSize
    ? { width: `calc(${Math.max(1, displayVal.value.length)}ch + 10px)` }
    : {},
);

watch(() => props.modelValue, (val) => {
  displayVal.value = val;
});

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  displayVal.value = raw;
  if (!props.formatNumber) emit('update:modelValue', raw);
}

function onFocus() {
  if (props.formatNumber) {
    displayVal.value = props.modelValue.replace(/,/g, '');
  }
}

function onBlur() {
  if (!props.formatNumber) return;
  const n = parseFloat(displayVal.value.replace(/,/g, ''));
  if (isNaN(n)) {
    emit('update:modelValue', '');
    displayVal.value = '';
  } else {
    const formatted = n.toLocaleString('en-US', { maximumFractionDigits: 2 });
    displayVal.value = formatted;
    emit('update:modelValue', formatted);
  }
}
</script>

<template>
  <input
    class="field-input bg-transparent border-0 outline-none p-0 m-0 text-inherit leading-snug"
    :class="[alignClass[align], autoSize ? '' : 'w-full']"
    :style="sizeStyle"
    :type="spinner ? 'number' : 'text'"
    :inputmode="(numeric || spinner) ? 'decimal' : 'text'"
    :step="spinner ? step : undefined"
    :min="spinner ? min : undefined"
    :max="spinner && max !== undefined ? max : undefined"
    :value="displayVal"
    :placeholder="placeholder"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>
