import { Router, NextFunction, Request, Response } from "express"
import { WidgetService } from "../services/widgetService.js"
import { isValidDocType } from "common/widget"
import type { DocType } from "common/widget"
import { ValidationError } from "common/errors"
import { VALID_SORT_FIELDS, VALID_SORT_ORDERS } from "common/sorting"
import type { SortField, SortOrder } from "common/sorting"

function serialize(w: {
  id: number
  text: string
  createdAt: Date
  updatedAt: Date
  docType?: DocType
}) {
  return {
    id: w.id,
    text: w.text,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
    ...(w.docType ? { docType: w.docType } : {}),
  }
}

export function widgetRoutes(service: WidgetService) {
  const router = Router()

  router.get("/", (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderBy, order, docType } = req.query

      if (orderBy && !VALID_SORT_FIELDS.includes(orderBy as any)) {
        throw new ValidationError(`Invalid orderBy: ${orderBy}`)
      }
      if (order && !VALID_SORT_ORDERS.includes(order as any)) {
        throw new ValidationError(`Invalid order: ${order}`)
      }
      if (docType && !isValidDocType(docType as string)) {
        throw new ValidationError(`Invalid docType: ${docType}`)
      }

      const widgets = service.getAll({
        orderBy: orderBy as SortField | undefined,
        order: order as SortOrder | undefined,
        docType: docType as DocType | undefined,
      })
      res.json(widgets.map(serialize))
    } catch (err) {
      next(err)
    }
  })

  router.post("/", (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, docType } = req.body ?? {}
      if (!text?.trim()) {
        throw new ValidationError("Widget text is required")
      }
      if (docType && !isValidDocType(docType)) {
        throw new ValidationError(`Invalid docType: ${docType}`)
      }
      const widget = service.create(text, docType)
      res.status(201).json(serialize(widget))
    } catch (err) {
      next(err)
    }
  })

  router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, docType } = req.body
      if (docType && !isValidDocType(docType)) {
        throw new ValidationError(`Invalid docType: ${docType}`)
      }
      const widget = service.update(Number(req.params.id), text, docType)
      res.json(serialize(widget))
    } catch (err) {
      next(err)
    }
  })

  router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
      service.delete(Number(req.params.id))
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  })

  return router
}
