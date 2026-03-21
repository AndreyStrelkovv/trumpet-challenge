<script setup lang="ts">
import { ref, onMounted } from "vue"
import TextWidget from "./components/TextWidget.vue"
import type { Widget } from "./types/widget"

const widgets = ref<Widget[]>([])

async function fetchWidgets() {
  const res = await fetch("/api/widgets")
  widgets.value = await res.json()
}

async function addWidget() {
  const res = await fetch("/api/widgets", { method: "POST" })
  const widget = await res.json()
  widgets.value.push(widget)
}

function removeWidget(id: number) {
  widgets.value = widgets.value.filter((w) => w.id !== id)
}

onMounted(fetchWidgets)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-2xl">
      <h1 class="mb-6 text-2xl font-bold text-gray-900">Digital Sales Room</h1>
      <button
        data-testid="add-widget-btn"
        class="mb-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        @click="addWidget"
      >
        Add Widget
      </button>
      <div class="flex flex-col gap-4">
        <TextWidget
          v-for="widget in widgets"
          :key="widget.id"
          :id="widget.id"
          :initial-text="widget.text"
          @delete="removeWidget"
        />
      </div>
    </div>
  </div>
</template>
