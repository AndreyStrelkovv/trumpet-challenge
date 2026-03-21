import express from "express"
import cors from "cors"
import { WidgetService } from "./services/widgetService.js"
import { widgetRoutes } from "./routes/widgets.js"
import { errorHandler } from "./middleware/errorHandler.js"

export function createApp(service: WidgetService) {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use("/api/widgets", widgetRoutes(service))
  app.use(errorHandler)
  return app
}
