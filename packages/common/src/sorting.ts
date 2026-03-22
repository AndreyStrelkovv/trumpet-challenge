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

export function isValidSortField(value: string): value is SortField {
  return Object.values(SORT_FIELDS).includes(value as SortField)
}

export function isValidSortOrder(value: string): value is SortOrder {
  return Object.values(SORT_ORDERS).includes(value as SortOrder)
}
