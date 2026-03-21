import { Widget, DocType } from "../domain/widget.js"
import { NotFoundError } from "../domain/errors.js"
import { WidgetRepository } from "../domain/widgetRepository.js"

export interface GetAllOptions {
  orderBy?: "createdAt" | "updatedAt"
  order?: "asc" | "desc"
  docType?: DocType
}

export class WidgetService {
  constructor(private repo: WidgetRepository) {}

  getAll(options?: GetAllOptions): Widget[] {
    let widgets = this.repo.findAll()

    if (options?.docType) {
      widgets = widgets.filter((widget) => widget.docType === options.docType)
    }

    const orderBy = options?.orderBy ?? "updatedAt"
    const order = options?.order ?? "desc"

    widgets.sort((first, second) => {
      const diff = first[orderBy].getTime() - second[orderBy].getTime()
      return order === "asc" ? diff : -diff
    })

    return widgets
  }

  create(docType?: DocType): Widget {
    return this.repo.create(docType)
  }

  update(id: number, text: string, docType?: DocType | null): Widget {
    const widget = this.repo.findById(id)
    if (!widget) throw new NotFoundError("Widget", id)
    widget.updateText(text)
    if (docType === null) widget.updateDocType(undefined)
    else if (docType) widget.updateDocType(docType)
    this.repo.save(widget)
    return widget
  }

  delete(id: number) {
    this.repo.remove(id)
  }
}
