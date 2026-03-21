import { describe, it, expect, afterEach } from "vitest"
import { unlinkSync, existsSync } from "fs"
import { createDb } from "../db.js"

const TEST_DB = "/tmp/trumpet-test-db.json"

describe("DB persistence", () => {
  afterEach(() => {
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB)
  })

  it("persists data across reloads", () => {
    const db1 = createDb(TEST_DB)
    const widget = db1.createWidget()
    db1.updateWidget(widget.id, "persisted text")

    const db2 = createDb(TEST_DB)
    const widgets = db2.getWidgets()
    expect(widgets).toHaveLength(1)
    expect(widgets[0].text).toBe("persisted text")
  })

  it("auto-increments across reloads", () => {
    const db1 = createDb(TEST_DB)
    db1.createWidget()

    const db2 = createDb(TEST_DB)
    const w2 = db2.createWidget()
    expect(w2.id).toBe(2)
  })
})
