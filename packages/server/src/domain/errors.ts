export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DomainError"
  }
}

export class NotFoundError extends DomainError {
  constructor(
    public readonly entity: string,
    public readonly entityId: number,
  ) {
    super(`${entity} with id ${entityId} not found`)
    this.name = "NotFoundError"
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}
