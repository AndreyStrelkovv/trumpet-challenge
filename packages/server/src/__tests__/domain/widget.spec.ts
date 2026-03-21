import { describe, it, expect, vi, afterEach } from "vitest"
import { Widget } from "../../domain/widget.js"
import { ValidationError } from "../../domain/errors.js"

describe("Widget", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("creates a widget with id and text", () => {
    const w = Widget.create(1, "hello")
    expect(w.id).toBe(1)
    expect(w.text).toBe("hello")
  })

  it("creates a widget with empty text (initial creation)", () => {
    const w = Widget.create(1, "")
    expect(w.text).toBe("")
  })

  it("updates text", () => {
    const w = Widget.create(1, "old")
    w.updateText("new")
    expect(w.text).toBe("new")
  })

  it("throws ValidationError for empty text update", () => {
    const w = Widget.create(1, "existing")
    expect(() => w.updateText("")).toThrow(ValidationError)
    expect(() => w.updateText("")).toThrow("Widget text cannot be empty")
  })

  it("throws ValidationError when text exceeds max length", () => {
    const w = Widget.create(1, "existing")
    expect(() => w.updateText("x".repeat(10001))).toThrow(ValidationError)
    expect(() => w.updateText("x".repeat(10001))).toThrow("cannot exceed")
  })

  it("sets createdAt and updatedAt on creation", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const w = Widget.create(1, "hi")
    expect(w.createdAt).toEqual(new Date("2026-01-01T00:00:00Z"))
    expect(w.updatedAt).toEqual(new Date("2026-01-01T00:00:00Z"))
  })

  it("bumps updatedAt on text update", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const w = Widget.create(1, "old")
    vi.setSystemTime(new Date("2026-01-02T00:00:00Z"))
    w.updateText("new")
    expect(w.createdAt).toEqual(new Date("2026-01-01T00:00:00Z"))
    expect(w.updatedAt).toEqual(new Date("2026-01-02T00:00:00Z"))
  })

  it("creates with no docType by default", () => {
    const w = Widget.create(1, "hi")
    expect(w.docType).toBeUndefined()
  })

  it("creates with docType when provided", () => {
    const w = Widget.create(1, "hi", undefined, undefined, "DOC_TYPE_1")
    expect(w.docType).toBe("DOC_TYPE_1")
  })

  it("updates docType", () => {
    const w = Widget.create(1, "hi")
    w.updateDocType("DOC_TYPE_2")
    expect(w.docType).toBe("DOC_TYPE_2")
  })

  it("clears docType", () => {
    const w = Widget.create(1, "hi", undefined, undefined, "DOC_TYPE_1")
    w.updateDocType(undefined)
    expect(w.docType).toBeUndefined()
  })

  it("bumps updatedAt on docType update", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const w = Widget.create(1, "hi")
    vi.setSystemTime(new Date("2026-01-02T00:00:00Z"))
    w.updateDocType("DOC_TYPE_3")
    expect(w.updatedAt).toEqual(new Date("2026-01-02T00:00:00Z"))
  })

  it("throws ValidationError for invalid docType", () => {
    const w = Widget.create(1, "hi")
    expect(() => w.updateDocType("INVALID" as any)).toThrow(ValidationError)
    expect(() => w.updateDocType("INVALID" as any)).toThrow("Invalid doc type")
  })
})
