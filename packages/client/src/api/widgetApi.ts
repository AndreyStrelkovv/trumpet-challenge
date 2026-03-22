import { get, post, put, del } from "./httpClient"
import type { Widget, DocType } from "../types/widget"

interface GetWidgetsParams {
  orderBy?: "createdAt" | "updatedAt"
  order?: "asc" | "desc"
  docType?: DocType
}

export function getWidgets(params?: GetWidgetsParams): Promise<Widget[]> {
  const query: Record<string, string> = {}
  if (params?.orderBy) query.orderBy = params.orderBy
  if (params?.order) query.order = params.order
  if (params?.docType) query.docType = params.docType
  return get("/widgets", query)
}

export function createWidget(payload: { text: string; docType?: DocType }) {
  return post("/widgets", payload)
}

export function updateWidget(
  id: number,
  payload: { text: string; docType?: DocType },
) {
  return put(`/widgets/${id}`, payload)
}

export function deleteWidget(id: number) {
  return del(`/widgets/${id}`)
}
