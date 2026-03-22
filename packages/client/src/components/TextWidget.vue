<script setup lang="ts">
import { ref } from "vue"
import { type DocType } from "../types/widget"
import { relativeTime } from "../relativeTime"
import { updateWidget, deleteWidget } from "../api/widgetApi"
import EditWidgetModal from "./EditWidgetModal.vue"
import DocTypeBadge from "./DocTypeBadge.vue"

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
  await updateWidget(props.id, {
    text: payload.text,
    docType: payload.docType,
  })
  editing.value = false
  emit("saved")
}

async function remove() {
  await deleteWidget(props.id)
  emit("delete", props.id)
}

function formatDate(iso: string) {
  return relativeTime(iso)
}
</script>

<template>
  <div
    class="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
  >
    <div class="flex items-start gap-4">
      <div class="mt-1 h-full w-1 shrink-0 rounded-full bg-indigo-500" />

      <div class="min-w-0 flex-1">
        <div
          data-testid="widget-meta"
          class="mb-2 flex items-center gap-2 text-xs text-slate-400"
        >
          <span>Created: {{ formatDate(createdAt) }}</span>
          <span class="text-slate-300">·</span>
          <span>Updated: {{ formatDate(updatedAt) }}</span>
          <DocTypeBadge v-if="initialDocType" :doc-type="initialDocType" />
        </div>

        <p
          data-testid="widget-text"
          class="mb-3 whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-800"
        >
          {{ initialText }}
        </p>

        <div
          class="flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <button
            data-testid="edit-btn"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
            @click="editing = true"
          >
            Edit
          </button>
          <button
            data-testid="delete-btn"
            class="text-sm font-medium text-rose-500 transition-colors hover:text-rose-700"
            @click="remove"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <Transition name="modal">
      <EditWidgetModal
        v-if="editing"
        :text="initialText"
        :doc-type="initialDocType"
        @save="handleSave"
        @cancel="editing = false"
      />
    </Transition>
  </div>
</template>
