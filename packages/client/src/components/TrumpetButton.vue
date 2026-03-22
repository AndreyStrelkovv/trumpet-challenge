<script setup lang="ts">
const VARIANTS = {
  primary:
    "rounded-lg bg-indigo-600 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700",
  secondary:
    "rounded-lg border border-slate-300 font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50",
  danger:
    "font-medium text-rose-500 transition-colors hover:text-rose-700",
} as const

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
} as const

type Variant = keyof typeof VARIANTS
type Size = keyof typeof SIZES

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
  }>(),
  {
    variant: "secondary",
    size: "md",
  },
)

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    :class="[VARIANTS[variant], SIZES[size]]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
