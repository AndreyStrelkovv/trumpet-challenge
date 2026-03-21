import { Widget } from "../domain/widget.js"
import { NotFoundError } from "../domain/errors.js"
import { WidgetRepository } from "../domain/widgetRepository.js"

export class WidgetService {
  constructor(private repo: WidgetRepository) {}

  getAll(): Widget[] {
    return this.repo.findAll()
  }

  create(): Widget {
    return this.repo.create()
  }

  update(id: number, text: string): Widget {
    const widget = this.repo.findById(id)
    if (!widget) throw new NotFoundError("Widget", id)
    widget.updateText(text)
    this.repo.save(widget)
    return widget
  }

  delete(id: number) {
    this.repo.remove(id)
  }
}
