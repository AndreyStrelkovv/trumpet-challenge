import { readFileSync, writeFileSync, existsSync } from "fs"
import { Widget, DbSchema } from "./types/widget.js"

export interface Db {
  getWidgets(): Widget[]
  createWidget(): Widget
  updateWidget(id: number, text: string): Widget | null
  deleteWidget(id: number): boolean
}

export function createDb(path: string): Db {
  const isMemory = path === ":memory:"
  let data: DbSchema = { nextId: 1, widgets: [] }

  if (!isMemory && existsSync(path)) {
    data = JSON.parse(readFileSync(path, "utf-8"))
  }

  function persist() {
    if (!isMemory) {
      writeFileSync(path, JSON.stringify(data, null, 2))
    }
  }

  return {
    getWidgets() {
      return data.widgets
    },
    createWidget() {
      const widget: Widget = { id: data.nextId++, text: "" }
      data.widgets.push(widget)
      persist()
      return widget
    },
    updateWidget(id, text) {
      const widget = data.widgets.find((w) => w.id === id)
      if (!widget) return null
      widget.text = text
      persist()
      return widget
    },
    deleteWidget(id) {
      const idx = data.widgets.findIndex((w) => w.id === id)
      if (idx === -1) return false
      data.widgets.splice(idx, 1)
      persist()
      return true
    },
  }
}
