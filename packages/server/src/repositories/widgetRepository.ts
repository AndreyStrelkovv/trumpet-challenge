import type { Widget, DocType } from "common/widget"

export interface WidgetRepository {
  findAll(): Widget[]
  findById(id: number): Widget | undefined
  create(text: string, docType?: DocType): Widget
  save(widget: Widget): Widget
  remove(id: number): number
}
