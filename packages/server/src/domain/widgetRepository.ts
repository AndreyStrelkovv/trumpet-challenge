import { Widget, DocType } from "./widget.js"

export interface WidgetRepository {
  findAll(): Widget[]
  findById(id: number): Widget | undefined
  create(docType?: DocType): Widget
  save(widget: Widget): Widget
  remove(id: number): number
}
