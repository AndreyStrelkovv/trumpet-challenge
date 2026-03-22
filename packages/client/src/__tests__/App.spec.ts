import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import App from "../App.vue"
import * as widgetApi from "../api/widgetApi"
import { SORT_FIELDS, SORT_ORDERS } from "../types/sorting"

vi.mock("../api/widgetApi")

const mockedGetWidgets = vi.mocked(widgetApi.getWidgets)
const mockedCreateWidget = vi.mocked(widgetApi.createWidget)

const now = "2026-01-01T00:00:00.000Z"

describe("App", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockedGetWidgets.mockResolvedValue([])
  })

  it("fetches and renders widgets on mount", async () => {
    mockedGetWidgets.mockResolvedValueOnce([
      { id: 1, text: "existing", createdAt: now, updatedAt: now },
    ])

    const wrapper = mount(App)
    await flushPromises()

    expect(mockedGetWidgets).toHaveBeenCalledWith({
      orderBy: SORT_FIELDS.CREATED_AT,
      order: SORT_ORDERS.DESC,
      docType: undefined,
    })
    expect(wrapper.findAll("[data-testid='widget-text']")).toHaveLength(1)
  })

  it("add widget button opens modal instead of immediate POST", async () => {
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find("[data-testid='add-widget-btn']").trigger("click")
    await flushPromises()

    expect(mockedCreateWidget).not.toHaveBeenCalled()
    expect(wrapper.find("[data-testid='modal-backdrop']").exists()).toBe(true)
  })

  it("modal save POSTs with text and docType, adds widget to list", async () => {
    mockedCreateWidget.mockResolvedValueOnce({
      id: 1,
      text: "hello",
      createdAt: now,
      updatedAt: now,
      docType: "DOC_TYPE_1",
    })

    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find("[data-testid='add-widget-btn']").trigger("click")
    await flushPromises()

    await wrapper.find("textarea").setValue("hello")
    await wrapper.find("[data-testid='modal-doctype-select']").setValue("DOC_TYPE_1")
    await wrapper.find("[data-testid='modal-save-btn']").trigger("click")
    await flushPromises()

    expect(mockedCreateWidget).toHaveBeenCalledWith({
      text: "hello",
      docType: "DOC_TYPE_1",
    })
    expect(wrapper.findAll("[data-testid='widget-text']")).toHaveLength(1)
    expect(wrapper.find("[data-testid='modal-backdrop']").exists()).toBe(false)
  })

  it("modal cancel closes modal without POST", async () => {
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find("[data-testid='add-widget-btn']").trigger("click")
    await flushPromises()

    await wrapper.find("[data-testid='modal-cancel-btn']").trigger("click")
    await flushPromises()

    expect(mockedCreateWidget).not.toHaveBeenCalled()
    expect(wrapper.find("[data-testid='modal-backdrop']").exists()).toBe(false)
  })
})
