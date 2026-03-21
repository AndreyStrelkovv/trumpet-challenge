<script setup lang="ts">
import { ref } from "vue"
import { type DocType } from "../types/widget"
import EditWidgetModal from "./editWidgetModal.vue"

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

const editing = ref(false)

async function handleSave(payload: { text: string; docType?: DocType }) {
  await fetch(`/api/widgets/${props.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: payload.text,
      docType: payload.docType ?? null,
    }),
  })
  editing.value = false
  emit("saved")
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
    <div data-testid="widget-meta" class="mb-2 flex items-center gap-2 text-xs text-gray-400">
      <span>Created: {{ formatDate(createdAt) }}</span>
      <span>·</span>
      <span>Updated: {{ formatDate(updatedAt) }}</span>
      <span
        v-if="initialDocType"
        data-testid="doctype-badge"
        class="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
      >
        {{ initialDocType }}
      </span>
    </div>

    <p data-testid="widget-text" class="mb-2 whitespace-pre-wrap text-sm text-gray-800">
      {{ initialText }}
    </p>

    <div class="flex items-center gap-2">
      <button
        data-testid="edit-btn"
        class="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        @click="editing = true"
      >
        Edit
      </button>
      <button
        data-testid="delete-btn"
        class="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        @click="remove"
      >
        Delete
      </button>
    </div>

    <EditWidgetModal
      v-if="editing"
      :text="initialText"
      :doc-type="initialDocType"
      @save="handleSave"
      @cancel="editing = false"
    />
  </div>
</template>
