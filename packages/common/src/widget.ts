import { ValidationError } from "./errors.js"

export const DOC_TYPES = [
  "DOC_TYPE_1",
  "DOC_TYPE_2",
  "DOC_TYPE_3",
  "DOC_TYPE_4",
] as const

export type DocType = (typeof DOC_TYPES)[number]

export const isValidDocType = (value: string): value is DocType =>
  DOC_TYPES.includes(value as DocType)

export interface WidgetDTO {
  id: number
  text: string
  createdAt: string
  updatedAt: string
  docType?: DocType
}

const MAX_TEXT_LENGTH = 10000

const validateText = (text: string) => {
  if (!text.trim()) {
    throw new ValidationError("Widget text cannot be empty")
  }
  if (text.length > MAX_TEXT_LENGTH) {
    throw new ValidationError(
      `Widget text cannot exceed ${MAX_TEXT_LENGTH} characters`,
    )
  }
}

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
    validateText(text)
    if (docType && !isValidDocType(docType)) {
      throw new ValidationError(`Invalid doc type: ${docType}`)
    }
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

  toDTO(): WidgetDTO {
    return {
      id: this._id,
      text: this._text,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      ...(this._docType ? { docType: this._docType } : {}),
    }
  }

  update(text: string, docType?: DocType): Widget {
    validateText(text)
    if (docType && !isValidDocType(docType)) {
      throw new ValidationError(`Invalid doc type: ${docType}`)
    }
    this._text = text
    this._docType = docType
    this._updatedAt = new Date()
    return this
  }
}
