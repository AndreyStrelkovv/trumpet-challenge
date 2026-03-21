import path from "path"
import { fileURLToPath } from "url"
import { existsSync } from "fs"
import { createApp } from "./app.js"
import { createDb } from "./db.js"
import { JsonWidgetRepository } from "./repositories/jsonWidgetRepository.js"
import { WidgetService } from "./services/widgetService.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "../../..")
const dbPath = path.join(rootDir, "db.json")
const db = createDb(dbPath)
const repo = new JsonWidgetRepository(db)
const service = new WidgetService(repo)

const app = createApp(service)

// Serve built client in production
const clientDist = path.join(rootDir, "packages/client/dist")
if (existsSync(clientDist)) {
  const express = await import("express")
  app.use(express.default.static(clientDist))
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"))
  })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
