import { readFileSync, writeFileSync, existsSync } from "fs"
import { RawWidget, DbSchema } from "@/types/widget.js"

export interface Db {
  getWidgets(): RawWidget[]
  createWidget(text: string, docType?: string): RawWidget
  updateWidget(
    id: number,
    fields: { text: string; docType: string | null; updatedAt: string },
  ): RawWidget | null
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
    createWidget(text: string, docType?: string) {
      const now = new Date().toISOString()
      const widget: RawWidget = {
        id: data.nextId++,
        text,
        createdAt: now,
        updatedAt: now,
        ...(docType ? { docType } : {}),
      }
      data.widgets.push(widget)
      persist()
      return widget
    },
    updateWidget(id, fields) {
      const widget = data.widgets.find((record) => record.id === id)
      if (!widget) return null
      widget.text = fields.text
      widget.updatedAt = fields.updatedAt
      if (fields.docType) widget.docType = fields.docType
      else delete widget.docType
      persist()
      return widget
    },
    deleteWidget(id) {
      const index = data.widgets.findIndex((record) => record.id === id)
      if (index === -1) return false
      data.widgets.splice(index, 1)
      persist()
      return true
    },
  }
}
