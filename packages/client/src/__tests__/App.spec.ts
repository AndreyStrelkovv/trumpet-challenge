import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import App from "@/App.vue"
import * as widgetApi from "@/api/widgetApi"
import { SORT_FIELDS, SORT_ORDERS } from "common/sorting"

vi.mock("@/api/widgetApi")

const mockedGetWidgets = vi.mocked(widgetApi.getWidgets)
const mockedCreateWidget = vi.mocked(widgetApi.createWidget)
const mockedDeleteWidget = vi.mocked(widgetApi.deleteWidget)

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

  it("modal save POSTs with text and docType, re-fetches list", async () => {
    mockedCreateWidget.mockResolvedValueOnce({
      id: 1,
      text: "hello",
      createdAt: now,
      updatedAt: now,
      docType: "DOC_TYPE_1",
    })

    const wrapper = mount(App)
    await flushPromises()

    mockedGetWidgets.mockResolvedValueOnce([
      { id: 1, text: "hello", createdAt: now, updatedAt: now, docType: "DOC_TYPE_1" },
    ])

    await wrapper.find("[data-testid='add-widget-btn']").trigger("click")
    await flushPromises()

    await wrapper.find("textarea").setValue("hello")
    await wrapper.find("[data-testid='modal-doctype-select']").setValue("DOC_TYPE_1")
    await wrapper.find("[data-testid='modal-save-btn']").trigger("click")
    await flushPromises()
    await flushPromises()

    expect(mockedCreateWidget).toHaveBeenCalledWith({
      text: "hello",
      docType: "DOC_TYPE_1",
    })
    expect(mockedGetWidgets).toHaveBeenCalledTimes(2)
    expect(wrapper.findAll("[data-testid='widget-text']")).toHaveLength(1)
    expect(wrapper.find("[data-testid='modal-backdrop']").exists()).toBe(false)
  })

  it("delete removes widget from list optimistically", async () => {
    mockedGetWidgets.mockResolvedValueOnce([
      { id: 1, text: "first", createdAt: now, updatedAt: now },
      { id: 2, text: "second", createdAt: now, updatedAt: now },
    ])
    mockedDeleteWidget.mockResolvedValueOnce(undefined)

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.findAll("[data-testid='widget-text']")).toHaveLength(2)

    const deleteButtons = wrapper.findAll("[data-testid='delete-btn']")
    await deleteButtons[0].trigger("click")
    await flushPromises()

    expect(mockedDeleteWidget).toHaveBeenCalledWith(1)
    expect(wrapper.findAll("[data-testid='widget-text']")).toHaveLength(1)
    expect(wrapper.find("[data-testid='widget-text']").text()).toBe("second")
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
