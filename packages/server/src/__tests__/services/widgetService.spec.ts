import { describe, it, expect, beforeEach, vi } from "vitest"
import { WidgetService } from "../../services/widgetService.js"
import { Widget } from "../../domain/widget.js"
import { NotFoundError, ValidationError } from "../../domain/errors.js"
import { WidgetRepository } from "../../domain/widgetRepository.js"

function createMockRepo(): WidgetRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  }
}

describe("WidgetService", () => {
  let service: WidgetService
  let repo: ReturnType<typeof createMockRepo>

  beforeEach(() => {
    repo = createMockRepo()
    service = new WidgetService(repo)
  })

  it("getAll delegates to repo.findAll", () => {
    const widgets = [Widget.create(1, "a"), Widget.create(2, "b")]
    vi.mocked(repo.findAll).mockReturnValue(widgets)

    const result = service.getAll()
    expect(result).toHaveLength(2)
    expect(repo.findAll).toHaveBeenCalledOnce()
  })

  it("getAll sorts by updatedAt desc by default", () => {
    const older = Widget.create(
      1,
      "a",
      new Date("2026-01-01"),
      new Date("2026-01-01"),
    )
    const newer = Widget.create(
      2,
      "b",
      new Date("2026-01-02"),
      new Date("2026-01-02"),
    )
    vi.mocked(repo.findAll).mockReturnValue([older, newer])

    const result = service.getAll()
    expect(result[0].id).toBe(2)
    expect(result[1].id).toBe(1)
  })

  it("getAll sorts by createdAt asc", () => {
    const older = Widget.create(
      1,
      "a",
      new Date("2026-01-01"),
      new Date("2026-01-03"),
    )
    const newer = Widget.create(
      2,
      "b",
      new Date("2026-01-02"),
      new Date("2026-01-01"),
    )
    vi.mocked(repo.findAll).mockReturnValue([newer, older])

    const result = service.getAll({ orderBy: "createdAt", order: "asc" })
    expect(result[0].id).toBe(1)
    expect(result[1].id).toBe(2)
  })

  it("getAll filters by docType", () => {
    const w1 = Widget.create(
      1,
      "a",
      undefined,
      undefined,
      "DOC_TYPE_1",
    )
    const w2 = Widget.create(
      2,
      "b",
      undefined,
      undefined,
      "DOC_TYPE_2",
    )
    const w3 = Widget.create(3, "c")
    vi.mocked(repo.findAll).mockReturnValue([w1, w2, w3])

    const result = service.getAll({ docType: "DOC_TYPE_1" })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it("create delegates to repo.create with text", () => {
    const widget = Widget.create(1, "hello")
    vi.mocked(repo.create).mockReturnValue(widget)

    expect(service.create("hello")).toBe(widget)
    expect(repo.create).toHaveBeenCalledWith("hello", undefined)
  })

  it("create passes text and docType to repo", () => {
    const widget = Widget.create(1, "hello", undefined, undefined, "DOC_TYPE_1")
    vi.mocked(repo.create).mockReturnValue(widget)

    service.create("hello", "DOC_TYPE_1")
    expect(repo.create).toHaveBeenCalledWith("hello", "DOC_TYPE_1")
  })

  it("update finds widget, updates text, saves", () => {
    const widget = Widget.create(1, "old")
    vi.mocked(repo.findById).mockReturnValue(widget)

    const result = service.update(1, "new")
    expect(result.text).toBe("new")
    expect(repo.findById).toHaveBeenCalledWith(1)
    expect(repo.save).toHaveBeenCalledWith(widget)
  })

  it("update sets docType when provided", () => {
    const widget = Widget.create(1, "old")
    vi.mocked(repo.findById).mockReturnValue(widget)

    const result = service.update(1, "new", "DOC_TYPE_2")
    expect(result.docType).toBe("DOC_TYPE_2")
  })

  it("update clears docType when null", () => {
    const widget = Widget.create(1, "old", undefined, undefined, "DOC_TYPE_1")
    vi.mocked(repo.findById).mockReturnValue(widget)

    const result = service.update(1, "new", null)
    expect(result.docType).toBeUndefined()
  })

  it("update throws NotFoundError for unknown id", () => {
    vi.mocked(repo.findById).mockReturnValue(undefined)
    expect(() => service.update(999, "text")).toThrow(NotFoundError)
  })

  it("update throws ValidationError for empty text", () => {
    const widget = Widget.create(1, "existing")
    vi.mocked(repo.findById).mockReturnValue(widget)
    expect(() => service.update(1, "")).toThrow(ValidationError)
  })

  it("delete delegates to repo.remove", () => {
    service.delete(1)
    expect(repo.remove).toHaveBeenCalledWith(1)
  })
})
