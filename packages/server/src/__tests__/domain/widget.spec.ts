import { describe, it, expect } from "vitest"
import { Widget } from "../../domain/widget.js"
import { ValidationError } from "../../domain/errors.js"

describe("Widget", () => {
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
})
