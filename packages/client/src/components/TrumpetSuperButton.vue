<script setup lang="ts">
import PlusIcon from "./illustrations/PlusIcon.vue"

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white py-4 text-sm font-medium text-slate-500 transition-all hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
    @click="$emit('click')"
  >
    <PlusIcon class="h-5 w-5" />
    <slot />
  </button>
</template>
