import { describe, it, expect, vi, afterEach } from "vitest"
import { relativeTime } from "@/relativeTime"

describe("relativeTime", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  function freezeAt(iso: string) {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(iso))
  }

  it("returns 'just now' for timestamps in the future", () => {
    freezeAt("2026-01-01T00:00:00Z")
    expect(relativeTime("2026-01-01T00:01:00Z")).toBe("just now")
  })

  it("returns 'just now' for less than a minute ago", () => {
    freezeAt("2026-01-01T00:00:30Z")
    expect(relativeTime("2026-01-01T00:00:00Z")).toBe("just now")
  })

  it("returns minutes ago", () => {
    freezeAt("2026-01-01T00:05:00Z")
    expect(relativeTime("2026-01-01T00:00:00Z")).toBe("5m ago")
  })

  it("returns hours ago", () => {
    freezeAt("2026-01-01T03:00:00Z")
    expect(relativeTime("2026-01-01T00:00:00Z")).toBe("3h ago")
  })

  it("returns days ago", () => {
    freezeAt("2026-01-04T00:00:00Z")
    expect(relativeTime("2026-01-01T00:00:00Z")).toBe("3d ago")
  })

  it("returns weeks ago", () => {
    freezeAt("2026-01-22T00:00:00Z")
    expect(relativeTime("2026-01-01T00:00:00Z")).toBe("3w ago")
  })

  it("returns months ago", () => {
    freezeAt("2026-04-01T00:00:00Z")
    expect(relativeTime("2026-01-01T00:00:00Z")).toBe("3mo ago")
  })

  it("returns years ago", () => {
    freezeAt("2028-01-01T00:00:00Z")
    expect(relativeTime("2026-01-01T00:00:00Z")).toBe("2y ago")
  })
})
