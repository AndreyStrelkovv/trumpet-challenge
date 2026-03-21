import { Request, Response, NextFunction } from "express"
import { NotFoundError, ValidationError } from "../domain/errors.js"

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: "Not found" })
    return
  }
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message })
    return
  }
  res.status(500).json({ error: "Internal server error" })
}
