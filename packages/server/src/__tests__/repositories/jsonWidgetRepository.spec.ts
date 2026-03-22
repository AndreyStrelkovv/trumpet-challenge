import { describe, it, expect, beforeEach } from "vitest"
import { createDb } from "@/db.js"
import { JsonWidgetRepository } from "@/repositories/jsonWidgetRepository.js"
import { NotFoundError } from "common/errors"

describe("JsonWidgetRepository", () => {
  let repo: JsonWidgetRepository

  beforeEach(() => {
    const db = createDb(":memory:")
    repo = new JsonWidgetRepository(db)
  })

  it("findAll returns empty array initially", () => {
    expect(repo.findAll()).toEqual([])
  })

  it("create returns a Widget entity with auto-incremented id", () => {
    const widget1 = repo.create("text")
    const widget2 = repo.create("text")
    expect(widget1.id).toBe(1)
    expect(widget1.text).toBe("text")
    expect(widget2.id).toBe(2)
  })

  it("findById returns Widget or undefined", () => {
    const created = repo.create("text")
    const found = repo.findById(created.id)
    expect(found?.id).toBe(created.id)
    expect(repo.findById(999)).toBeUndefined()
  })

  it("save persists text changes", () => {
    const widget =repo.create("text")
    widget.updateText("updated")
    repo.save(widget)

    const found = repo.findById(widget.id)
    expect(found?.text).toBe("updated")
  })

  it("remove deletes a widget", () => {
    const widget =repo.create("text")
    repo.remove(widget.id)
    expect(repo.findAll()).toHaveLength(0)
  })

  it("remove throws NotFoundError for unknown id", () => {
    expect(() => repo.remove(999)).toThrow(NotFoundError)
  })

  it("create sets createdAt and updatedAt", () => {
    const widget =repo.create("text")
    expect(widget.createdAt).toBeInstanceOf(Date)
    expect(widget.updatedAt).toBeInstanceOf(Date)
  })

  it("create with docType persists it", () => {
    const widget =repo.create("text", "DOC_TYPE_1")
    expect(widget.docType).toBe("DOC_TYPE_1")
    const found = repo.findById(widget.id)
    expect(found?.docType).toBe("DOC_TYPE_1")
  })

  it("create without docType leaves it undefined", () => {
    const widget =repo.create("text")
    expect(widget.docType).toBeUndefined()
  })

  it("save persists docType changes", () => {
    const widget =repo.create("text")
    widget.updateDocType("DOC_TYPE_2")
    repo.save(widget)
    const found = repo.findById(widget.id)
    expect(found?.docType).toBe("DOC_TYPE_2")
  })

  it("save persists docType clearing", () => {
    const widget =repo.create("text", "DOC_TYPE_1")
    widget.updateDocType(undefined)
    repo.save(widget)
    const found = repo.findById(widget.id)
    expect(found?.docType).toBeUndefined()
  })
})
