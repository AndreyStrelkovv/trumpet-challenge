export const DOC_TYPES = [
  "DOC_TYPE_1",
  "DOC_TYPE_2",
  "DOC_TYPE_3",
  "DOC_TYPE_4",
] as const

export type DocType = (typeof DOC_TYPES)[number]

export interface Widget {
  id: number
  text: string
  createdAt: string
  updatedAt: string
  docType?: DocType
}
