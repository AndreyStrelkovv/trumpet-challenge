import { ValidationError } from "./errors.js"

const MAX_TEXT_LENGTH = 10000

export class Widget {
  private constructor(
    private readonly _id: number,
    private _text: string,
  ) {}

  static create(id: number, text: string): Widget {
    return new Widget(id, text)
  }

  get id(): number {
    return this._id
  }

  get text(): string {
    return this._text
  }

  updateText(text: string) {
    if (text.length === 0) {
      throw new ValidationError("Widget text cannot be empty")
    }
    if (text.length > MAX_TEXT_LENGTH) {
      throw new ValidationError(
        `Widget text cannot exceed ${MAX_TEXT_LENGTH} characters`,
      )
    }
    this._text = text
  }
}
