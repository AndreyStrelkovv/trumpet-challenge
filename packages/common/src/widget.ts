import { ValidationError } from "./errors.js"

export const DOC_TYPES = [
  "DOC_TYPE_1",
  "DOC_TYPE_2",
  "DOC_TYPE_3",
  "DOC_TYPE_4",
] as const

export type DocType = (typeof DOC_TYPES)[number]

export function isValidDocType(value: string): value is DocType {
  return DOC_TYPES.includes(value as DocType)
}

export interface WidgetDTO {
  id: number
  text: string
  createdAt: string
  updatedAt: string
  docType?: DocType
}

const MAX_TEXT_LENGTH = 10000

export class Widget {
  private constructor(
    private readonly _id: number,
    private _text: string,
    private _createdAt: Date,
    private _updatedAt: Date,
    private _docType?: DocType,
  ) {}

  static create(
    id: number,
    text: string,
    createdAt?: Date,
    updatedAt?: Date,
    docType?: DocType,
  ): Widget {
    const now = new Date()
    return new Widget(id, text, createdAt ?? now, updatedAt ?? now, docType)
  }

  get id(): number {
    return this._id
  }

  get text(): string {
    return this._text
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get docType(): DocType | undefined {
    return this._docType
  }

  updateText(text: string): Widget {
    if (!text.trim()) {
      throw new ValidationError("Widget text cannot be empty")
    }
    if (text.length > MAX_TEXT_LENGTH) {
      throw new ValidationError(
        `Widget text cannot exceed ${MAX_TEXT_LENGTH} characters`,
      )
    }
    this._text = text
    this._updatedAt = new Date()
    return this
  }

  updateDocType(docType?: DocType): Widget {
    this._docType = docType
    this._updatedAt = new Date()
    return this
  }
}
