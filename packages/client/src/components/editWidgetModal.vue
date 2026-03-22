<script setup lang="ts">
import { ref } from "vue"
import { DOC_TYPES, type DocType } from "../types/widget"
import TrumpetTextarea from "./TrumpetTextarea.vue"
import TrumpetSelector, { type SelectOption } from "./TrumpetSelector.vue"

const docTypeOptions: SelectOption[] = [
  { value: undefined, label: "No doc type" },
  ...DOC_TYPES.map((dt) => ({ value: dt, label: dt })),
]

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
const textError = ref("")

function handleSave() {
  if (!editText.value.trim()) {
    textError.value = "Text is required"
    return
  }
  textError.value = ""
  emit("save", { text: editText.value.trim(), docType: editDocType.value })
}
</script>

<template>
  <div data-testid="modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
      <h2 class="mb-5 text-lg font-semibold text-slate-900">Edit Widget</h2>

      <TrumpetSelector
        v-model="editDocType"
        :options="docTypeOptions"
        data-testid="modal-doctype-select"
        class="mb-4 w-full"
      />

      <TrumpetTextarea
        v-model="editText"
        :error="textError"
        placeholder="Enter text..."
        class="mb-5"
      />

      <div class="flex justify-end gap-2">
        <button
          data-testid="modal-cancel-btn"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          data-testid="modal-save-btn"
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          @click="handleSave"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
