import { get, post, put, remove } from "@/api/httpClient"
import type { WidgetDTO as Widget, DocType } from "common/widget"
import type { SortField, SortOrder } from "common/sorting"

interface GetWidgetsParams {
  orderBy?: SortField
  order?: SortOrder
  docType?: DocType
}

export const getWidgets = (params?: GetWidgetsParams): Promise<Widget[]> => {
  const query: Record<string, string> = {}
  if (params?.orderBy) query.orderBy = params.orderBy
  if (params?.order) query.order = params.order
  if (params?.docType) query.docType = params.docType
  return get("/widgets", query)
}

export const createWidget = (payload: {
  text: string
  docType?: DocType
}): Promise<Widget> => post("/widgets", payload)

export const updateWidget = (
  id: number,
  payload: { text: string; docType?: DocType },
): Promise<Widget> => put(`/widgets/${id}`, payload)

export const deleteWidget = (id: number): Promise<void> =>
  remove(`/widgets/${id}`)
