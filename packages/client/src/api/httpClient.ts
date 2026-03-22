const BASE = "/api"

const request = async (path: string, options?: RequestInit) => {
  const response = await fetch(`${BASE}${path}`, options)
  if (!response.ok) {
    throw new Error(
      `${options?.method ?? "GET"} ${path} failed: ${response.status}`,
    )
  }
  if (response.status === 204) return
  return response.json()
}

export const get = <T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> => {
  const query = params ? `?${new URLSearchParams(params)}` : ""
  return request(`${path}${query}`)
}

export const post = <T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> =>
  request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

export const put = <T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> =>
  request(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

export const del = (path: string): Promise<void> =>
  request(path, { method: "DELETE" })
