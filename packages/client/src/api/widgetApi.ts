import { get, post, put, del } from "@/api/httpClient"
import type { WidgetDTO as Widget, DocType } from "common/widget"
import type { SortField, SortOrder } from "common/sorting"

interface GetWidgetsParams {
  orderBy?: SortField
  order?: SortOrder
  docType?: DocType
}

export function getWidgets(params?: GetWidgetsParams): Promise<Widget[]> {
  const query: Record<string, string> = {}
  if (params?.orderBy) query.orderBy = params.orderBy
  if (params?.order) query.order = params.order
  if (params?.docType) query.docType = params.docType
  return get("/widgets", query)
}

export function createWidget(payload: {
  text: string
  docType?: DocType
}): Promise<Widget> {
  return post("/widgets", payload)
}

export function updateWidget(
  id: number,
  payload: { text: string; docType?: DocType },
): Promise<Widget> {
  return put(`/widgets/${id}`, payload)
}

export function deleteWidget(id: number): Promise<void> {
  return del(`/widgets/${id}`)
}
