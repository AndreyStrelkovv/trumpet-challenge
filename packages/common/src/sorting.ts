export const SORT_FIELDS = {
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const

export type SortField = (typeof SORT_FIELDS)[keyof typeof SORT_FIELDS]

export const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
} as const

export type SortOrder = (typeof SORT_ORDERS)[keyof typeof SORT_ORDERS]

export const isValidSortField = (value: string): value is SortField =>
  Object.values(SORT_FIELDS).includes(value as SortField)

export const isValidSortOrder = (value: string): value is SortOrder =>
  Object.values(SORT_ORDERS).includes(value as SortOrder)
