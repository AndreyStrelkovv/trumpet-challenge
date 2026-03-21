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
      "/api/widgets?orderBy=createdAt&order=desc",
    )
    expect(wrapper.findAll("[data-testid='widget-text']")).toHaveLength(1)
  })

  it("add widget button opens modal instead of immediate POST", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    })

    const wrapper = mount(App)
    await flushPromises()

    const postCalls = fetchMock.mock.calls.length

    await wrapper.find("[data-testid='add-widget-btn']").trigger("click")
    await flushPromises()

    expect(fetchMock.mock.calls.length).toBe(postCalls)
    expect(wrapper.find("[data-testid='modal-backdrop']").exists()).toBe(true)
  })

  it("modal save POSTs with text and docType, adds widget to list", async () => {
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
            text: "hello",
            createdAt: now,
            updatedAt: now,
            docType: "DOC_TYPE_1",
          }),
      })

    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find("[data-testid='add-widget-btn']").trigger("click")
    await flushPromises()

    await wrapper.find("textarea").setValue("hello")
    await wrapper.find("[data-testid='modal-doctype-select']").setValue("DOC_TYPE_1")
    await wrapper.find("[data-testid='modal-save-btn']").trigger("click")
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith("/api/widgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "hello", docType: "DOC_TYPE_1" }),
    })
    expect(wrapper.findAll("[data-testid='widget-text']")).toHaveLength(1)
    expect(wrapper.find("[data-testid='modal-backdrop']").exists()).toBe(false)
  })

  it("modal cancel closes modal without POST", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    })

    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find("[data-testid='add-widget-btn']").trigger("click")
    await flushPromises()

    const postCalls = fetchMock.mock.calls.length

    await wrapper.find("[data-testid='modal-cancel-btn']").trigger("click")
    await flushPromises()

    expect(fetchMock.mock.calls.length).toBe(postCalls)
    expect(wrapper.find("[data-testid='modal-backdrop']").exists()).toBe(false)
  })
})
