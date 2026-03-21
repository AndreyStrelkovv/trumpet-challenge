<script setup lang="ts">
import { ref, onMounted } from "vue"
import TextWidget from "./components/TextWidget.vue"
import { DOC_TYPES, type Widget, type DocType } from "./types/widget"

const widgets = ref<Widget[]>([])
const orderBy = ref<"updatedAt" | "createdAt">("updatedAt")
const order = ref<"asc" | "desc">("desc")
const filterDocType = ref<DocType | "">("")

async function fetchWidgets() {
  const params = new URLSearchParams()
  params.set("orderBy", orderBy.value)
  params.set("order", order.value)
  if (filterDocType.value) params.set("docType", filterDocType.value)

  const res = await fetch(`/api/widgets?${params}`)
  widgets.value = await res.json()
}

async function addWidget() {
  const res = await fetch("/api/widgets", { method: "POST" })
  const widget = await res.json()
  widgets.value.unshift(widget)
}

function removeWidget(id: number) {
  widgets.value = widgets.value.filter((widget) => widget.id !== id)
}

onMounted(fetchWidgets)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-2xl">
      <h1 class="mb-6 text-2xl font-bold text-gray-900">Digital Sales Room</h1>

      <div class="mb-4 flex flex-wrap items-center gap-3">
        <button
          data-testid="add-widget-btn"
          class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          @click="addWidget"
        >
          Add Widget
        </button>

        <select
          v-model="orderBy"
          data-testid="order-by-select"
          class="rounded border border-gray-300 px-2 py-2 text-sm"
          @change="fetchWidgets"
        >
          <option value="updatedAt">Sort by Updated</option>
          <option value="createdAt">Sort by Created</option>
        </select>

        <select
          v-model="order"
          data-testid="order-select"
          class="rounded border border-gray-300 px-2 py-2 text-sm"
          @change="fetchWidgets"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>

        <select
          v-model="filterDocType"
          data-testid="filter-doctype-select"
          class="rounded border border-gray-300 px-2 py-2 text-sm"
          @change="fetchWidgets"
        >
          <option value="">All doc types</option>
          <option v-for="dt in DOC_TYPES" :key="dt" :value="dt">{{ dt }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-4">
        <TextWidget
          v-for="widget in widgets"
          :key="widget.id"
          :id="widget.id"
          :initial-text="widget.text"
          :initial-doc-type="widget.docType"
          :created-at="widget.createdAt"
          :updated-at="widget.updatedAt"
          @delete="removeWidget"
          @saved="fetchWidgets"
        />
      </div>
    </div>
  </div>
</template>
