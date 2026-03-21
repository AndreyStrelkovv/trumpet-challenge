import { describe, it, expect, beforeEach } from "vitest"
import { createDb } from "../../db.js"
import { JsonWidgetRepository } from "../../repositories/jsonWidgetRepository.js"
import { NotFoundError } from "../../domain/errors.js"

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
    const w1 = repo.create()
    const w2 = repo.create()
    expect(w1.id).toBe(1)
    expect(w1.text).toBe("")
    expect(w2.id).toBe(2)
  })

  it("findById returns Widget or undefined", () => {
    const created = repo.create()
    const found = repo.findById(created.id)
    expect(found?.id).toBe(created.id)
    expect(repo.findById(999)).toBeUndefined()
  })

  it("save persists text changes", () => {
    const w = repo.create()
    w.updateText("updated")
    repo.save(w)

    const found = repo.findById(w.id)
    expect(found?.text).toBe("updated")
  })

  it("remove deletes a widget", () => {
    const w = repo.create()
    repo.remove(w.id)
    expect(repo.findAll()).toHaveLength(0)
  })

  it("remove throws NotFoundError for unknown id", () => {
    expect(() => repo.remove(999)).toThrow(NotFoundError)
  })
})
