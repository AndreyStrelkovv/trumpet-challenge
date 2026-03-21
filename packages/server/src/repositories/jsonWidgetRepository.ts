import { Db } from "../db.js"
import { Widget, DocType } from "../domain/widget.js"
import { NotFoundError } from "../domain/errors.js"
import { WidgetRepository } from "../domain/widgetRepository.js"

function hydrate(raw: {
  id: number
  text: string
  createdAt?: string
  updatedAt?: string
  docType?: string
}): Widget {
  const fallback = new Date(0)
  return Widget.create(
    raw.id,
    raw.text,
    raw.createdAt ? new Date(raw.createdAt) : fallback,
    raw.updatedAt ? new Date(raw.updatedAt) : fallback,
    raw.docType as DocType | undefined,
  )
}

export class JsonWidgetRepository implements WidgetRepository {
  constructor(private db: Db) {}

  findAll(): Widget[] {
    return this.db.getWidgets().map(hydrate)
  }

  findById(id: number): Widget | undefined {
    const raw = this.db.getWidgets().find((record) => record.id === id)
    if (!raw) return undefined
    return hydrate(raw)
  }

  create(docType?: DocType): Widget {
    const raw = this.db.createWidget(docType)
    return hydrate(raw)
  }

  save(widget: Widget) {
    const result = this.db.updateWidget(widget.id, {
      text: widget.text,
      docType: widget.docType ?? null,
      updatedAt: widget.updatedAt.toISOString(),
    })
    if (!result) throw new NotFoundError("Widget", widget.id)
    return widget
  }

  remove(id: number) {
    const deleted = this.db.deleteWidget(id)
    if (!deleted) throw new NotFoundError("Widget", id)
    return id
  }
}
