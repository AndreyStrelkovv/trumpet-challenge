<script setup lang="ts">
import { computed } from "vue"
import { type DocType } from "common/widget"

const props = defineProps<{
  docType: DocType
}>()

const colorClasses = computed(() => {
  const colors: Record<DocType, string> = {
    DOC_TYPE_1: "bg-emerald-50 text-emerald-700",
    DOC_TYPE_2: "bg-purple-50 text-purple-700",
    DOC_TYPE_3: "bg-amber-50 text-amber-700",
    DOC_TYPE_4: "bg-pink-50 text-pink-700",
  }
  return colors[props.docType]
})
</script>

<template>
  <span
    data-testid="doctype-badge"
    class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
    :class="colorClasses"
  >
    {{ docType }}
  </span>
</template>
