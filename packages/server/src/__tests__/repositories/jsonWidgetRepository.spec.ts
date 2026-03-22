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
    const w1 = repo.create("text")
    const w2 = repo.create("text")
    expect(w1.id).toBe(1)
    expect(w1.text).toBe("text")
    expect(w2.id).toBe(2)
  })

  it("findById returns Widget or undefined", () => {
    const created = repo.create("text")
    const found = repo.findById(created.id)
    expect(found?.id).toBe(created.id)
    expect(repo.findById(999)).toBeUndefined()
  })

  it("save persists text changes", () => {
    const w = repo.create("text")
    w.updateText("updated")
    repo.save(w)

    const found = repo.findById(w.id)
    expect(found?.text).toBe("updated")
  })

  it("remove deletes a widget", () => {
    const w = repo.create("text")
    repo.remove(w.id)
    expect(repo.findAll()).toHaveLength(0)
  })

  it("remove throws NotFoundError for unknown id", () => {
    expect(() => repo.remove(999)).toThrow(NotFoundError)
  })

  it("create sets createdAt and updatedAt", () => {
    const w = repo.create("text")
    expect(w.createdAt).toBeInstanceOf(Date)
    expect(w.updatedAt).toBeInstanceOf(Date)
  })

  it("create with docType persists it", () => {
    const w = repo.create("text", "DOC_TYPE_1")
    expect(w.docType).toBe("DOC_TYPE_1")
    const found = repo.findById(w.id)
    expect(found?.docType).toBe("DOC_TYPE_1")
  })

  it("create without docType leaves it undefined", () => {
    const w = repo.create("text")
    expect(w.docType).toBeUndefined()
  })

  it("save persists docType changes", () => {
    const w = repo.create("text")
    w.updateDocType("DOC_TYPE_2")
    repo.save(w)
    const found = repo.findById(w.id)
    expect(found?.docType).toBe("DOC_TYPE_2")
  })

  it("save persists docType clearing", () => {
    const w = repo.create("text", "DOC_TYPE_1")
    w.updateDocType(undefined)
    repo.save(w)
    const found = repo.findById(w.id)
    expect(found?.docType).toBeUndefined()
  })
})
