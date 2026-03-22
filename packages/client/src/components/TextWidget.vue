<script setup lang="ts">
import { ref } from "vue"
import { type DocType } from "../types/widget"
import EditWidgetModal from "./EditWidgetModal.vue"

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
  <div class="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
    <div class="flex items-start gap-4">
      <div class="mt-1 h-full w-1 shrink-0 rounded-full bg-indigo-500" />

      <div class="min-w-0 flex-1">
        <div data-testid="widget-meta" class="mb-2 flex items-center gap-2 text-xs text-slate-400">
          <span>Created: {{ formatDate(createdAt) }}</span>
          <span class="text-slate-300">·</span>
          <span>Updated: {{ formatDate(updatedAt) }}</span>
          <span
            v-if="initialDocType"
            data-testid="doctype-badge"
            class="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600"
          >
            {{ initialDocType }}
          </span>
        </div>

        <p data-testid="widget-text" class="mb-3 whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-800">
          {{ initialText }}
        </p>

        <div class="flex items-center gap-2">
          <button
            data-testid="edit-btn"
            class="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            @click="editing = true"
          >
            Edit
          </button>
          <button
            data-testid="delete-btn"
            class="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700"
            @click="remove"
          >
            Delete
          </button>
        </div>
      </div>
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
