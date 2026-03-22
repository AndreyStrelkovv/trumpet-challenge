import { describe, it, expect, vi } from "vitest"
import { errorHandler } from "@/middleware/errorHandler.js"
import { NotFoundError, ValidationError } from "common/errors"
import { Request, Response, NextFunction } from "express"

function createMockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response
  return res
}

const req = {} as Request
const next = vi.fn() as NextFunction

describe("errorHandler", () => {
  it("maps NotFoundError to 404", () => {
    const res = createMockRes()
    errorHandler(new NotFoundError("Widget", 1), req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" })
  })

  it("maps ValidationError to 400", () => {
    const res = createMockRes()
    errorHandler(new ValidationError("too long"), req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "too long" })
  })

  it("maps unknown errors to 500", () => {
    const res = createMockRes()
    errorHandler(new Error("boom"), req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" })
  })
})
