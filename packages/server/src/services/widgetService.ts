import { Widget } from "common/widget"
import type { DocType } from "common/widget"
import { NotFoundError } from "common/errors"
import type { WidgetRepository } from "../repositories/widgetRepository.js"
import { SORT_FIELDS, SORT_ORDERS } from "common/sorting"
import type { SortField, SortOrder } from "common/sorting"

export interface GetAllOptions {
  orderBy?: SortField
  order?: SortOrder
  docType?: DocType
}

export class WidgetService {
  constructor(private repo: WidgetRepository) {}

  getAll(options?: GetAllOptions): Widget[] {
    let widgets = this.repo.findAll()

    if (options?.docType) {
      widgets = widgets.filter((widget) => widget.docType === options.docType)
    }

    const orderBy = options?.orderBy ?? SORT_FIELDS.UPDATED_AT
    const order = options?.order ?? SORT_ORDERS.DESC

    widgets.sort((first, second) => {
      const diff = first[orderBy].getTime() - second[orderBy].getTime()
      return order === SORT_ORDERS.ASC ? diff : -diff
    })

    return widgets
  }

  create(text: string, docType?: DocType): Widget {
    return this.repo.create(text, docType)
  }

  update(id: number, text: string, docType?: DocType): Widget {
    const widget = this.repo.findById(id)
    if (!widget) throw new NotFoundError("Widget", id)
    widget.updateText(text)
    widget.updateDocType(docType)
    this.repo.save(widget)
    return widget
  }

  delete(id: number) {
    this.repo.remove(id)
  }
}
