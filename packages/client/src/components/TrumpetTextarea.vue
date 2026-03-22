<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue"

const MAX_HEIGHT = 320

defineProps<{
  modelValue: string
  error?: string
  placeholder?: string
  rows?: number
}>()

defineEmits<{
  "update:modelValue": [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement>()

function autoResize() {
  const element = textareaRef.value
  if (!element) return
  element.style.height = "auto"
  element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT)}px`
  element.style.overflowY = element.scrollHeight > MAX_HEIGHT ? "auto" : "hidden"
}

onMounted(() => nextTick(autoResize))
</script>

<template>
  <div>
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows ?? 4"
      class="w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1"
      :class="
        error
          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
          : 'border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-indigo-200'
      "
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value);
        autoResize()
      "
    />
    <p v-if="error" data-testid="text-error" class="mt-1.5 text-sm text-rose-600">{{ error }}</p>
  </div>
</template>
