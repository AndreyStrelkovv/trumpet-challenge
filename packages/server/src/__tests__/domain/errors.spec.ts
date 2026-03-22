import { describe, it, expect } from "vitest"
import {
  DomainError,
  NotFoundError,
  ValidationError,
} from "common/errors"

describe("DomainError", () => {
  it("is an instance of Error", () => {
    const err = new DomainError("test")
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe("test")
  })
})

describe("NotFoundError", () => {
  it("extends DomainError and carries entity + id", () => {
    const err = new NotFoundError("Widget", 42)
    expect(err).toBeInstanceOf(DomainError)
    expect(err.entity).toBe("Widget")
    expect(err.entityId).toBe(42)
    expect(err.message).toBe("Widget with id 42 not found")
  })
})

describe("ValidationError", () => {
  it("extends DomainError and carries message", () => {
    const err = new ValidationError("too long")
    expect(err).toBeInstanceOf(DomainError)
    expect(err.message).toBe("too long")
  })
})
