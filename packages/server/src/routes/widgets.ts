import { Router, NextFunction, Request, Response } from "express"
import { WidgetService } from "../services/widgetService.js"

export function widgetRoutes(service: WidgetService) {
  const router = Router()

  router.get("/", (_req: Request, res: Response) => {
    const widgets = service.getAll()
    res.json(widgets.map((w) => ({ id: w.id, text: w.text })))
  })

  router.post("/", (_req: Request, res: Response) => {
    const widget = service.create()
    res.status(201).json({ id: widget.id, text: widget.text })
  })

  router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
      const widget = service.update(Number(req.params.id), req.body.text)
      res.json({ id: widget.id, text: widget.text })
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
