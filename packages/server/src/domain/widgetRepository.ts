import { Widget } from "./widget.js"

export interface WidgetRepository {
  findAll(): Widget[]
  findById(id: number): Widget | undefined
  create(): Widget
  save(widget: Widget): Widget
  remove(id: number): number
}
