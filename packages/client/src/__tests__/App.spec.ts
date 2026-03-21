import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import App from "../App.vue"

const fetchMock = vi.fn()
vi.stubGlobal("fetch", fetchMock)

describe("App", () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it("fetches and renders widgets on mount", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1, text: "existing" }]),
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith("/api/widgets")
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
        json: () => Promise.resolve({ id: 1, text: "" }),
      })

    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find("[data-testid='add-widget-btn']").trigger("click")
    await flushPromises()

    expect(wrapper.findAll("textarea")).toHaveLength(1)
  })
})
