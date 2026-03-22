<script setup lang="ts">
import { ref, onMounted } from "vue"
import TextWidget from "./components/TextWidget.vue"
import EditWidgetModal from "./components/EditWidgetModal.vue"
import TrumpetSelector, {
  type SelectOption,
} from "./components/TrumpetSelector.vue"
import { DOC_TYPES, type Widget, type DocType } from "./types/widget"

const orderByOptions: SelectOption[] = [
  { value: "updatedAt", label: "Sort by Updated" },
  { value: "createdAt", label: "Sort by Created" },
]

const orderOptions: SelectOption[] = [
  { value: "desc", label: "Newest first" },
  { value: "asc", label: "Oldest first" },
]

const docTypeFilterOptions: SelectOption[] = [
  { value: "", label: "All doc types" },
  ...DOC_TYPES.map((dt) => ({ value: dt, label: dt })),
]

const widgets = ref<Widget[]>([])
const orderBy = ref<"updatedAt" | "createdAt">("createdAt")
const order = ref<"asc" | "desc">("desc")
const filterDocType = ref<DocType | "">("")
const showAddModal = ref(false)

async function fetchWidgets() {
  const params = new URLSearchParams()
  params.set("orderBy", orderBy.value)
  params.set("order", order.value)
  if (filterDocType.value) params.set("docType", filterDocType.value)

  const res = await fetch(`/api/widgets?${params}`)
  widgets.value = await res.json()
}

function openAddModal() {
  showAddModal.value = true
}

async function handleAddSave(payload: { text: string; docType?: DocType }) {
  const res = await fetch("/api/widgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const widget = await res.json()
  widgets.value.unshift(widget)
  showAddModal.value = false
}

function removeWidget(id: number) {
  widgets.value = widgets.value.filter((widget) => widget.id !== id)
}

onMounted(fetchWidgets)
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-2xl px-8 py-8">
        <h1 class="text-2xl font-bold text-slate-900">Digital Sales Room</h1>
        <p class="mt-1 text-sm text-slate-500">
          Manage and organize your content widgets
        </p>
      </div>
    </div>

    <div class="mx-auto max-w-2xl px-8 py-6">
      <div class="mb-5 flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-1.5">
          <svg
            class="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <TrumpetSelector
            v-model="orderBy"
            :options="orderByOptions"
            data-testid="order-by-select"
            @change="fetchWidgets"
          />
        </div>

        <TrumpetSelector
          v-model="order"
          :options="orderOptions"
          data-testid="order-select"
          @change="fetchWidgets"
        />

        <div class="flex items-center gap-1.5">
          <svg
            class="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <TrumpetSelector
            v-model="filterDocType"
            :options="docTypeFilterOptions"
            data-testid="filter-doctype-select"
            @change="fetchWidgets"
          />
        </div>
      </div>

      <button
        data-testid="add-widget-btn"
        class="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white py-4 text-sm font-medium text-slate-500 transition-all hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
        @click="openAddModal"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Widget
      </button>

      <div v-if="widgets.length" class="flex flex-col gap-4">
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

      <div
        v-else
        class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
      >
        <svg
          class="mb-4 h-16 w-16 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p class="text-sm font-medium text-slate-500">No widgets yet</p>
        <p class="mt-1 text-xs text-slate-400">
          Use the button above to add your first widget
        </p>
      </div>

      <EditWidgetModal
        v-if="showAddModal"
        text=""
        @save="handleAddSave"
        @cancel="showAddModal = false"
      />
    </div>
  </div>
</template>
