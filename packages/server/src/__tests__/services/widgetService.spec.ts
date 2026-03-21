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

    expect(service.getAll()).toEqual(widgets)
    expect(repo.findAll).toHaveBeenCalledOnce()
  })

  it("create delegates to repo.create", () => {
    const widget = Widget.create(1, "")
    vi.mocked(repo.create).mockReturnValue(widget)

    expect(service.create()).toBe(widget)
    expect(repo.create).toHaveBeenCalledOnce()
  })

  it("update finds widget, updates text, saves", () => {
    const widget = Widget.create(1, "old")
    vi.mocked(repo.findById).mockReturnValue(widget)

    const result = service.update(1, "new")
    expect(result.text).toBe("new")
    expect(repo.findById).toHaveBeenCalledWith(1)
    expect(repo.save).toHaveBeenCalledWith(widget)
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
