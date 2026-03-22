import { describe, it, expect, vi, afterEach } from "vitest"
import { Widget } from "common/widget"
import { ValidationError } from "common/errors"

describe("Widget", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("creates a widget with id and text", () => {
    const widget = Widget.create(1, "hello")
    expect(widget.id).toBe(1)
    expect(widget.text).toBe("hello")
  })

  it.each(["", "   "])("throws ValidationError for blank text on create '%s'", (text) => {
    expect(() => Widget.create(1, text)).toThrow(ValidationError)
    expect(() => Widget.create(1, text)).toThrow("Widget text cannot be empty")
  })

  it("throws ValidationError when create text exceeds max length", () => {
    expect(() => Widget.create(1, "x".repeat(10001))).toThrow(ValidationError)
    expect(() => Widget.create(1, "x".repeat(10001))).toThrow("cannot exceed")
  })

  it("throws ValidationError for invalid docType on create", () => {
    expect(() => Widget.create(1, "hi", undefined, undefined, "INVALID" as any)).toThrow(ValidationError)
  })

  it("updates text and docType in a single update call", () => {
    const widget = Widget.create(1, "old")
    widget.update("new", "DOC_TYPE_2")
    expect(widget.text).toBe("new")
    expect(widget.docType).toBe("DOC_TYPE_2")
  })

  it.each(["", "   "])("throws ValidationError for blank text update '%s'", (text) => {
    const widget = Widget.create(1, "existing")
    expect(() => widget.update(text)).toThrow(ValidationError)
    expect(() => widget.update(text)).toThrow("Widget text cannot be empty")
  })

  it("throws ValidationError when update text exceeds max length", () => {
    const widget = Widget.create(1, "existing")
    expect(() => widget.update("x".repeat(10001))).toThrow(ValidationError)
    expect(() => widget.update("x".repeat(10001))).toThrow("cannot exceed")
  })

  it("sets createdAt and updatedAt on creation", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const widget = Widget.create(1, "hi")
    expect(widget.createdAt).toEqual(new Date("2026-01-01T00:00:00Z"))
    expect(widget.updatedAt).toEqual(new Date("2026-01-01T00:00:00Z"))
  })

  it("bumps updatedAt once on update", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const widget = Widget.create(1, "old")
    vi.setSystemTime(new Date("2026-01-02T00:00:00Z"))
    widget.update("new", "DOC_TYPE_1")
    expect(widget.createdAt).toEqual(new Date("2026-01-01T00:00:00Z"))
    expect(widget.updatedAt).toEqual(new Date("2026-01-02T00:00:00Z"))
  })

  it("creates with no docType by default", () => {
    const widget = Widget.create(1, "hi")
    expect(widget.docType).toBeUndefined()
  })

  it("creates with docType when provided", () => {
    const widget = Widget.create(1, "hi", undefined, undefined, "DOC_TYPE_1")
    expect(widget.docType).toBe("DOC_TYPE_1")
  })

  it("clears docType via update", () => {
    const widget = Widget.create(1, "hi", undefined, undefined, "DOC_TYPE_1")
    widget.update("hi", undefined)
    expect(widget.docType).toBeUndefined()
  })

  it("throws ValidationError for invalid docType on update", () => {
    const widget = Widget.create(1, "hi")
    expect(() => widget.update("hi", "INVALID" as any)).toThrow(ValidationError)
    expect(() => widget.update("hi", "INVALID" as any)).toThrow("Invalid doc type")
  })

  it("toDTO returns correct shape", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const widget = Widget.create(1, "hello", undefined, undefined, "DOC_TYPE_1")
    const dto = widget.toDTO()
    expect(dto).toEqual({
      id: 1,
      text: "hello",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      docType: "DOC_TYPE_1",
    })
  })

  it("toDTO omits docType when undefined", () => {
    const widget = Widget.create(1, "hello")
    const dto = widget.toDTO()
    expect(dto).not.toHaveProperty("docType")
  })
})
