import { Db } from "../db.js";
import { Widget, DocType } from "../domain/widget.js";
import { NotFoundError } from "../domain/errors.js";
import { WidgetRepository } from "../domain/widgetRepository.js";

function widgetParser(dbWidget: {
  id: number;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  docType?: string;
}): Widget {
  return Widget.create(
    dbWidget.id,
    dbWidget.text,
    dbWidget.createdAt ? new Date(dbWidget.createdAt) : new Date(0),
    dbWidget.updatedAt ? new Date(dbWidget.updatedAt) : new Date(0),
    dbWidget.docType as DocType | undefined,
  );
}

export class JsonWidgetRepository implements WidgetRepository {
  constructor(private db: Db) {}

  findAll(): Widget[] {
    return this.db.getWidgets().map((dbWidget) => widgetParser(dbWidget));
  }

  findById(id: number): Widget | undefined {
    const dbWidget = this.db.getWidgets().find((record) => record.id === id);
    if (!dbWidget) return undefined;
    return widgetParser(dbWidget);
  }

  create(text: string, docType?: DocType): Widget {
    const dbWidget = this.db.createWidget(text, docType);
    return widgetParser(dbWidget);
  }

  save(widget: Widget) {
    const result = this.db.updateWidget(widget.id, {
      text: widget.text,
      docType: widget.docType ?? null,
      updatedAt: widget.updatedAt.toISOString(),
    });
    if (!result) throw new NotFoundError("Widget", widget.id);
    return widget;
  }

  remove(id: number) {
    const deleted = this.db.deleteWidget(id);
    if (!deleted) throw new NotFoundError("Widget", id);
    return id;
  }
}
