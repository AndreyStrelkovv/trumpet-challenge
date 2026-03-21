<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
  id: number
  initialText: string
}>()

const emit = defineEmits<{
  delete: [id: number]
}>()

const text = ref(props.initialText)
const saved = ref(false)

async function save() {
  await fetch(`/api/widgets/${props.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text.value }),
  })
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

async function remove() {
  await fetch(`/api/widgets/${props.id}`, { method: "DELETE" })
  emit("delete", props.id)
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <textarea
      v-model="text"
      class="w-full resize-y rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
      rows="4"
      placeholder="Enter text..."
    />
    <div class="mt-2 flex items-center gap-2">
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
