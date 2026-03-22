<script setup lang="ts">
import { ref } from "vue"
import { DOC_TYPES, type DocType } from "common/widget"
import TrumpetTextarea from "@/components/TrumpetTextarea.vue"
import TrumpetSelector, { type SelectOption } from "@/components/TrumpetSelector.vue"
import TrumpetButton from "@/components/TrumpetButton.vue"

const docTypeOptions: SelectOption[] = [
  { value: undefined, label: "No doc type" },
  ...DOC_TYPES.map((docType) => ({ value: docType, label: docType })),
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
        placeholder="Select document type"
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
        <TrumpetButton
          data-testid="modal-cancel-btn"
          variant="secondary"
          @click="emit('cancel')"
        >
          Cancel
        </TrumpetButton>
        <TrumpetButton
          data-testid="modal-save-btn"
          variant="primary"
          @click="handleSave"
        >
          Save
        </TrumpetButton>
      </div>
    </div>
  </div>
</template>
