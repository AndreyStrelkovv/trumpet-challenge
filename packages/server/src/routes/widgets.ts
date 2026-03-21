import { Router } from "express"
import { Db } from "../db.js"

export function widgetRoutes(db: Db) {
  const router = Router()

  router.get("/", (_req, res) => {
    res.json(db.getWidgets())
  })

  router.post("/", (_req, res) => {
    const widget = db.createWidget()
    res.status(201).json(widget)
  })

  router.put("/:id", (req, res) => {
    const widget = db.updateWidget(Number(req.params.id), req.body.text)
    if (!widget) return res.status(404).json({ error: "Not found" })
    res.json(widget)
  })

  router.delete("/:id", (req, res) => {
    const deleted = db.deleteWidget(Number(req.params.id))
    if (!deleted) return res.status(404).json({ error: "Not found" })
    res.status(204).send()
  })

  return router
}
