<script setup lang="ts">
import { ref } from "vue"
import { DOC_TYPES, type DocType } from "../types/widget"

const props = defineProps<{
  id: number
  initialText: string
  initialDocType?: DocType
  createdAt: string
  updatedAt: string
}>()

const emit = defineEmits<{
  delete: [id: number]
  saved: []
}>()

const text = ref(props.initialText)
const docType = ref<DocType | undefined>(props.initialDocType)
const saved = ref(false)

async function save() {
  await fetch(`/api/widgets/${props.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text.value,
      docType: docType.value ?? null,
    }),
  })
  saved.value = true
  emit("saved")
  setTimeout(() => (saved.value = false), 2000)
}

async function remove() {
  await fetch(`/api/widgets/${props.id}`, { method: "DELETE" })
  emit("delete", props.id)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div class="mb-2 flex items-center gap-2 text-xs text-gray-400">
      <span>Created: {{ formatDate(createdAt) }}</span>
      <span>·</span>
      <span>Updated: {{ formatDate(updatedAt) }}</span>
    </div>
    <textarea
      v-model="text"
      class="w-full resize-y rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
      rows="4"
      placeholder="Enter text..."
    />
    <div class="mt-2 flex items-center gap-2">
      <select
        v-model="docType"
        data-testid="doctype-select"
        class="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option :value="undefined">No doc type</option>
        <option v-for="dt in DOC_TYPES" :key="dt" :value="dt">{{ dt }}</option>
      </select>
      <button
        data-testid="save-btn"
        class="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        @click="save"
      >
        Save
      </button>
      <button
        data-testid="delete-btn"
        class="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        @click="remove"
      >
        Delete
      </button>
      <span v-if="saved" class="text-sm text-green-600">Saved!</span>
    </div>
  </div>
</template>
