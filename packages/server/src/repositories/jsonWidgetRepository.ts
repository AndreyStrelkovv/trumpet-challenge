import { Db } from "../db.js"
import { Widget } from "../domain/widget.js"
import { NotFoundError } from "../domain/errors.js"
import { WidgetRepository } from "../domain/widgetRepository.js"

export class JsonWidgetRepository implements WidgetRepository {
  constructor(private db: Db) {}

  findAll(): Widget[] {
    return this.db.getWidgets().map((w) => Widget.create(w.id, w.text))
  }

  findById(id: number): Widget | undefined {
    const raw = this.db.getWidgets().find((w) => w.id === id)
    if (!raw) return undefined
    return Widget.create(raw.id, raw.text)
  }

  create(): Widget {
    const raw = this.db.createWidget()
    return Widget.create(raw.id, raw.text)
  }

  save(widget: Widget) {
    const result = this.db.updateWidget(widget.id, widget.text)
    if (!result) throw new NotFoundError("Widget", widget.id)
    return widget
  }

  remove(id: number) {
    const deleted = this.db.deleteWidget(id)
    if (!deleted) throw new NotFoundError("Widget", id)
    return id
  }
}
