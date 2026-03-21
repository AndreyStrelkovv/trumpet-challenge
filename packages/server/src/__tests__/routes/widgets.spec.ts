import { describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import { createApp } from "../../app.js"
import { createDb } from "../../db.js"
import { JsonWidgetRepository } from "../../repositories/jsonWidgetRepository.js"
import { WidgetService } from "../../services/widgetService.js"

describe("Widget API", () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    const db = createDb(":memory:")
    const repo = new JsonWidgetRepository(db)
    const service = new WidgetService(repo)
    app = createApp(service)
  })

  it("GET /api/widgets returns empty array initially", async () => {
    const res = await request(app).get("/api/widgets")
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it("POST /api/widgets creates a widget with timestamps", async () => {
    const res = await request(app).post("/api/widgets")
    expect(res.status).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.text).toBe("")
    expect(res.body.createdAt).toBeDefined()
    expect(res.body.updatedAt).toBeDefined()

    const list = await request(app).get("/api/widgets")
    expect(list.body).toHaveLength(1)
  })

  it("POST /api/widgets with docType", async () => {
    const res = await request(app)
      .post("/api/widgets")
      .send({ docType: "DOC_TYPE_1" })
    expect(res.status).toBe(201)
    expect(res.body.docType).toBe("DOC_TYPE_1")
  })

  it("POST /api/widgets with invalid docType returns 400", async () => {
    const res = await request(app)
      .post("/api/widgets")
      .send({ docType: "INVALID" })
    expect(res.status).toBe(400)
  })

  it("PUT /api/widgets/:id updates widget text", async () => {
    await request(app).post("/api/widgets")
    const res = await request(app).put("/api/widgets/1").send({ text: "hello" })
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
    expect(res.body.text).toBe("hello")
    expect(res.body.createdAt).toBeDefined()
    expect(res.body.updatedAt).toBeDefined()
  })

  it("PUT /api/widgets/:id updates docType", async () => {
    await request(app).post("/api/widgets")
    const res = await request(app)
      .put("/api/widgets/1")
      .send({ text: "hi", docType: "DOC_TYPE_3" })
    expect(res.body.docType).toBe("DOC_TYPE_3")
  })

  it("PUT /api/widgets/:id clears docType with null", async () => {
    await request(app).post("/api/widgets").send({ docType: "DOC_TYPE_1" })
    const res = await request(app)
      .put("/api/widgets/1")
      .send({ text: "hi", docType: null })
    expect(res.body.docType).toBeUndefined()
  })

  it("PUT /api/widgets/:id returns 404 for unknown id", async () => {
    const res = await request(app).put("/api/widgets/999").send({ text: "nope" })
    expect(res.status).toBe(404)
  })

  it("PUT /api/widgets/:id returns 400 for empty text", async () => {
    await request(app).post("/api/widgets")
    const res = await request(app).put("/api/widgets/1").send({ text: "" })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe("Widget text cannot be empty")
  })

  it("PUT /api/widgets/:id returns 400 for invalid docType", async () => {
    await request(app).post("/api/widgets")
    const res = await request(app)
      .put("/api/widgets/1")
      .send({ text: "hi", docType: "INVALID" })
    expect(res.status).toBe(400)
  })

  it("DELETE /api/widgets/:id removes widget", async () => {
    await request(app).post("/api/widgets")
    const res = await request(app).delete("/api/widgets/1")
    expect(res.status).toBe(204)

    const list = await request(app).get("/api/widgets")
    expect(list.body).toEqual([])
  })

  it("DELETE /api/widgets/:id returns 404 for unknown id", async () => {
    const res = await request(app).delete("/api/widgets/999")
    expect(res.status).toBe(404)
  })

  it("auto-increments widget IDs", async () => {
    const w1 = await request(app).post("/api/widgets")
    const w2 = await request(app).post("/api/widgets")
    expect(w1.body.id).toBe(1)
    expect(w2.body.id).toBe(2)
  })

  it("GET /api/widgets filters by docType", async () => {
    await request(app).post("/api/widgets").send({ docType: "DOC_TYPE_1" })
    await request(app).post("/api/widgets").send({ docType: "DOC_TYPE_2" })
    await request(app).post("/api/widgets")

    const res = await request(app).get("/api/widgets?docType=DOC_TYPE_1")
    expect(res.body).toHaveLength(1)
    expect(res.body[0].docType).toBe("DOC_TYPE_1")
  })

  it("GET /api/widgets returns 400 for invalid orderBy", async () => {
    const res = await request(app).get("/api/widgets?orderBy=invalid")
    expect(res.status).toBe(400)
  })

  it("GET /api/widgets returns 400 for invalid order", async () => {
    const res = await request(app).get("/api/widgets?order=invalid")
    expect(res.status).toBe(400)
  })

  it("GET /api/widgets returns 400 for invalid docType filter", async () => {
    const res = await request(app).get("/api/widgets?docType=INVALID")
    expect(res.status).toBe(400)
  })
})
