const BASE = "/api"

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${BASE}${path}`, options)
  if (!response.ok) {
    throw new Error(
      `${options?.method ?? "GET"} ${path} failed: ${response.status}`,
    )
  }
  if (response.status === 204) return
  return response.json()
}

export function get<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const query = params ? `?${new URLSearchParams(params)}` : ""
  return request(`${path}${query}`)
}

export function post<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

export function put<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  return request(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

export function del(path: string): Promise<void> {
  return request(path, { method: "DELETE" })
}
