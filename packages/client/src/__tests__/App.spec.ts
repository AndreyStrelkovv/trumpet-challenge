import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import App from "../App.vue"

const fetchMock = vi.fn()
vi.stubGlobal("fetch", fetchMock)

const now = "2026-01-01T00:00:00.000Z"

describe("App", () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it("fetches and renders widgets on mount", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, text: "existing", createdAt: now, updatedAt: now },
        ]),
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/widgets?orderBy=updatedAt&order=desc",
    )
    expect(wrapper.findAll("textarea")).toHaveLength(1)
  })

  it("add widget button creates new widget", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            text: "",
            createdAt: now,
            updatedAt: now,
          }),
      })

    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find("[data-testid='add-widget-btn']").trigger("click")
    await flushPromises()

    expect(wrapper.findAll("textarea")).toHaveLength(1)
  })
})
