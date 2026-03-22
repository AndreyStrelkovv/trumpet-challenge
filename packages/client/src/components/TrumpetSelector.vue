<script setup lang="ts">
export interface SelectOption {
  value?: string
  label: string
}

const props = defineProps<{
  modelValue?: string
  options: SelectOption[]
  placeholder?: string
}>()

defineEmits<{
  "update:modelValue": [value?: string]
  change: []
}>()

const chevronSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"

const pillStyle = {
  backgroundImage: `url("${chevronSvg}")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 8px center",
}
</script>

<template>
  <select
    :value="modelValue ?? ''"
    class="cursor-pointer appearance-none rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 pr-7 text-xs font-medium transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    :class="modelValue ? 'text-slate-600' : 'text-slate-400'"
    :style="pillStyle"
    @change="
      $emit('update:modelValue', ($event.target as HTMLSelectElement).value || undefined);
      $emit('change')
    "
  >
    <option v-if="props.placeholder" value="" disabled hidden>
      {{ props.placeholder }}
    </option>
    <option
      v-for="option in options"
      :key="String(option.value)"
      :value="option.value ?? ''"
    >
      {{ option.label }}
    </option>
  </select>
</template>
