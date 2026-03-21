import express from "express"
import cors from "cors"
import { Db } from "./db.js"
import { widgetRoutes } from "./routes/widgets.js"

export function createApp(db: Db) {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use("/api/widgets", widgetRoutes(db))
  return app
}
