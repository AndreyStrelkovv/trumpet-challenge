<script setup lang="ts">
import { ref, onMounted } from "vue"
import TextWidget from "./components/TextWidget.vue"
import EditWidgetModal from "./components/EditWidgetModal.vue"
import TrumpetSelector, {
  type SelectOption,
} from "./components/TrumpetSelector.vue"
import SortIcon from "./components/illustrations/SortIcon.vue"
import FilterIcon from "./components/illustrations/FilterIcon.vue"
import EmptyBoxIcon from "./components/illustrations/EmptyBoxIcon.vue"
import TrumpetSuperButton from "./components/TrumpetSuperButton.vue"
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
          <SortIcon class="h-4 w-4 text-slate-400" />
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
          <FilterIcon class="h-4 w-4 text-slate-400" />
          <TrumpetSelector
            v-model="filterDocType"
            :options="docTypeFilterOptions"
            data-testid="filter-doctype-select"
            @change="fetchWidgets"
          />
        </div>
      </div>

      <TrumpetSuperButton data-testid="add-widget-btn" @click="openAddModal">
        Add Widget
      </TrumpetSuperButton>

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
        <EmptyBoxIcon class="mb-4 h-16 w-16 text-slate-300" />
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
