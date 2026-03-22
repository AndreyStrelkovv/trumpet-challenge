import { Router, Request, Response, NextFunction } from "express"
import { WidgetService } from "@/services/widgetService.js"
import { Widget, isValidDocType } from "common/widget"
import type { DocType } from "common/widget"
import { ValidationError } from "common/errors"
import { isValidSortField, isValidSortOrder } from "common/sorting"

function serialize(widget: Widget) {
  return {
    id: widget.id,
    text: widget.text,
    createdAt: widget.createdAt.toISOString(),
    updatedAt: widget.updatedAt.toISOString(),
    ...(widget.docType ? { docType: widget.docType } : {}),
  }
}

function handler(fn: (req: Request, res: Response) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      fn(req, res)
    } catch (err) {
      next(err)
    }
  }
}

function validatedDocType(docType: string): DocType {
  if (!isValidDocType(docType)) {
    throw new ValidationError(`Invalid docType: ${docType}`)
  }
  return docType
}

export function widgetRoutes(service: WidgetService) {
  const router = Router()

  router.get("/", handler((req, res) => {
    const orderBy = req.query.orderBy as string
    const order = req.query.order as string
    const docType = req.query.docType as string

    if (orderBy && !isValidSortField(orderBy)) {
      throw new ValidationError(`Invalid orderBy: ${orderBy}`)
    }
    if (order && !isValidSortOrder(order)) {
      throw new ValidationError(`Invalid order: ${order}`)
    }

    const widgets = service.getAll({
      orderBy: isValidSortField(orderBy) ? orderBy : undefined,
      order: isValidSortOrder(order) ? order : undefined,
      docType: docType ? validatedDocType(docType) : undefined,
    })
    res.json(widgets.map(serialize))
  }))

  router.post("/", handler((req, res) => {
    const { text, docType } = req.body ?? {}
    if (!text?.trim()) {
      throw new ValidationError("Widget text is required")
    }
    if (docType) validatedDocType(docType)
    const widget = service.create(text, docType)
    res.status(201).json(serialize(widget))
  }))

  router.put("/:id", handler((req, res) => {
    const { text, docType } = req.body
    if (!text?.trim()) {
      throw new ValidationError("Widget text cannot be empty")
    }
    if (docType) validatedDocType(docType)
    const widget = service.update(Number(req.params.id), text, docType)
    res.json(serialize(widget))
  }))

  router.delete("/:id", handler((req, res) => {
    service.delete(Number(req.params.id))
    res.status(204).send()
  }))

  return router
}
