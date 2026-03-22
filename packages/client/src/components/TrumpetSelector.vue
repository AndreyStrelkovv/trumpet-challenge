<script setup lang="ts">
export interface SelectOption {
  value?: string
  label: string
}

defineProps<{
  modelValue?: string
  options: SelectOption[]
}>()

defineEmits<{
  "update:modelValue": [value?: string]
  change: []
}>()
</script>

<template>
  <select
    :value="modelValue"
    class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-1"
    @change="
      $emit('update:modelValue', ($event.target as HTMLSelectElement).value || undefined);
      $emit('change')
    "
  >
    <option
      v-for="option in options"
      :key="String(option.value)"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
