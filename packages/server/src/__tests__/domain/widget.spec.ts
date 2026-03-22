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

  it("creates a widget with empty text (initial creation)", () => {
    const widget = Widget.create(1, "")
    expect(widget.text).toBe("")
  })

  it("updates text", () => {
    const widget = Widget.create(1, "old")
    widget.updateText("new")
    expect(widget.text).toBe("new")
  })

  it.each(["", "   "])("throws ValidationError for blank text update '%s'", (text) => {
    const widget = Widget.create(1, "existing")
    expect(() => widget.updateText(text)).toThrow(ValidationError)
    expect(() => widget.updateText(text)).toThrow("Widget text cannot be empty")
  })

  it("throws ValidationError when text exceeds max length", () => {
    const widget = Widget.create(1, "existing")
    expect(() => widget.updateText("x".repeat(10001))).toThrow(ValidationError)
    expect(() => widget.updateText("x".repeat(10001))).toThrow("cannot exceed")
  })

  it("sets createdAt and updatedAt on creation", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const widget = Widget.create(1, "hi")
    expect(widget.createdAt).toEqual(new Date("2026-01-01T00:00:00Z"))
    expect(widget.updatedAt).toEqual(new Date("2026-01-01T00:00:00Z"))
  })

  it("bumps updatedAt on text update", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const widget = Widget.create(1, "old")
    vi.setSystemTime(new Date("2026-01-02T00:00:00Z"))
    widget.updateText("new")
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

  it("updates docType", () => {
    const widget = Widget.create(1, "hi")
    widget.updateDocType("DOC_TYPE_2")
    expect(widget.docType).toBe("DOC_TYPE_2")
  })

  it("clears docType", () => {
    const widget = Widget.create(1, "hi", undefined, undefined, "DOC_TYPE_1")
    widget.updateDocType(undefined)
    expect(widget.docType).toBeUndefined()
  })

  it("bumps updatedAt on docType update", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const widget = Widget.create(1, "hi")
    vi.setSystemTime(new Date("2026-01-02T00:00:00Z"))
    widget.updateDocType("DOC_TYPE_3")
    expect(widget.updatedAt).toEqual(new Date("2026-01-02T00:00:00Z"))
  })

  it("throws ValidationError for invalid docType", () => {
    const widget = Widget.create(1, "hi")
    expect(() => widget.updateDocType("INVALID" as any)).toThrow(ValidationError)
    expect(() => widget.updateDocType("INVALID" as any)).toThrow("Invalid doc type")
  })
})
