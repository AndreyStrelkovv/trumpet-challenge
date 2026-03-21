<script setup lang="ts">
import { ref } from "vue"
import { DOC_TYPES, type DocType } from "../types/widget"

const props = defineProps<{
  text: string
  docType?: DocType
}>()

const emit = defineEmits<{
  save: [payload: { text: string; docType?: DocType }]
  cancel: []
}>()

const editText = ref(props.text)
const editDocType = ref<DocType | undefined>(props.docType)

function handleSave() {
  emit("save", { text: editText.value, docType: editDocType.value })
}
</script>

<template>
  <div data-testid="modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-lg font-semibold text-gray-900">Edit Widget</h2>

      <textarea
        v-model="editText"
        class="mb-3 w-full resize-y rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        rows="4"
        placeholder="Enter text..."
      />

      <select
        v-model="editDocType"
        data-testid="modal-doctype-select"
        class="mb-4 w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option :value="undefined">No doc type</option>
        <option v-for="dt in DOC_TYPES" :key="dt" :value="dt">{{ dt }}</option>
      </select>

      <div class="flex justify-end gap-2">
        <button
          data-testid="modal-cancel-btn"
          class="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          data-testid="modal-save-btn"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          @click="handleSave"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
